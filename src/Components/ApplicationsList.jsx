import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getApplicationsAPI } from '../services/apiAll';
import { updateApplicationStatusAPI } from '../services/apiAll';
const Applications = ({ jobId = null }) => {
  // App state setup
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicantDetail, setApplicantDetail] = useState(null);
  const [resume, setResume] = useState(null);

  // Get current user info from sessionStorage
  const currentUser = {
    name: sessionStorage.getItem('name'),
    role: sessionStorage.getItem('role'),
    token: sessionStorage.getItem('token')
  };

  // Redirect/block if not logged in
  if (!currentUser.token) return <p>User not found or not logged in</p>;

  // Fetch applications from API
  useEffect(() => {
    async function fetchApps() {
      setLoading(true);
      try {
        const response = await getApplicationsAPI(currentUser.token, jobId);
        setApplications(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, [jobId]);

  // Loading state
  if (loading) return <p>Loading applications...</p>;

  // Filter out apps with deleted/missing jobId
  const safeApps = applications.filter(app => app.jobId);

  // Show message if no valid applications
  if (safeApps.length === 0) {
    const emptyMsg = jobId
      ? 'No applications found for this job.'
      : currentUser.role === 'candidate'
        ? 'You have not applied to any jobs yet.'
        : 'No applications available.';
    return <p>{emptyMsg}</p>;
  }

  // Open resume modal for specific applicant
  const handleShowResume = (app) => {
    setApplicantDetail(app);
    setResume(app.resume || (app.resumePDF ? { pdfUrl: app.resumePDF } : null));
  };

  

const handleUpdateStatus = async (applicationId, newStatus) => {
  try {
    // Call API to update application status
    const response = await updateApplicationStatusAPI(applicationId, newStatus, currentUser.token);

    // Show toast and update UI state
    toast.success(`Application ${newStatus.toLowerCase()} successful`);

    setApplications(prev =>
      prev.map(app =>
        app._id === applicationId ? { ...app, status: newStatus } : app
      )
    );
  } catch (error) {
    console.error("Status update failed:", error);
    toast.error("Failed to update application status");
  }
};


  // Renders a generic table given columns
  const renderTable = (apps, columns) => (
    <table className="table table-bordered mt-3">
      <thead>
        <tr>{columns.map((col, i) => <th key={i}>{col.header}</th>)}</tr>
      </thead>
      <tbody>
        {apps.map((app, i) => (
          <tr key={i}>
            {columns.map((col, j) => (
              <td key={j}>
                {col.render
                  ? col.render(app)
                  : app[col.field] || '-'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Modal for viewing resume
  const Modal = () => (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Resume of {applicantDetail.name}</h5>
            <button type="button" className="btn-close" onClick={() => setApplicantDetail(null)} />
          </div>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {resume
              ? Object.entries(resume)
                .filter(([k]) => !['_id', '__v', 'user'].includes(k))
                .map(([k, v]) => (
                  <p key={k}>
                    <strong>{k.charAt(0).toUpperCase() + k.slice(1)}:</strong> {v}
                  </p>
                ))
              : <p>No resume available</p>
            }
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setApplicantDetail(null)}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );

  // Default: show all valid applications
  let filtered = safeApps;
  const columns = [];

  // Employer-specific view
  if (currentUser.role === 'employer') {
    columns.push(
      { header: 'Job Title', render: app => app.jobId.title },
      {
        header: 'Applicant',
        render: app => (
          <button className="btn btn-link p-0" onClick={() => handleShowResume(app)}>
            {app.name}
          </button>
        )
      },
      {
        header: 'Applied On',
        render: app => new Date(app.appliedAt).toLocaleDateString()
      },
      {
        header: 'Status',
        render: app => (
          <div className="d-flex flex-column gap-1">
            <span className={`badge bg-${app.status === 'Rejected'
              ? 'danger'
              : app.status === 'Approved'
                ? 'success'
                : 'secondary'
              }`}>
              {app.status || 'In Process'}
            </span>

            {/* Action buttons only if status is not yet final */}
            {(app.status === 'Pending' || !app.status) && (
              <div className="d-flex gap-2 mt-1">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleUpdateStatus(app._id, 'Approved')}
                >
                  Accept
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleUpdateStatus(app._id, 'Rejected')}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        )
      }
    );

    // If not filtering for a single job, show all jobs posted by this employer
    if (!jobId) {
      filtered = safeApps.filter(app => app.jobId.postedBy === currentUser.name);
    }
  }
  else if (currentUser.role === 'candidate') {
    columns.push(
      { header: 'Job Title', render: app => app.jobId.title },
      { header: 'Company', render: app => app.jobId.company },
      { header: 'Applied On', render: app => new Date(app.appliedAt).toLocaleDateString() },
      { header: 'Status', render: app => app.status || 'In Process' }
    );

    filtered = safeApps.filter(
      app => app.applicant?._id === currentUser.name || app.name === currentUser.name
    );

    // Admin-specific view
  } else if (currentUser.role === 'admin') {
    columns.push(
      { header: 'Job Title', render: app => app.jobId.title },
      { header: 'Company', render: app => app.jobId.company },
      { header: 'Applicant', field: 'name' },
      { header: 'Applied On', render: app => new Date(app.appliedAt).toLocaleDateString() },
      { header: 'Status', render: app => app.status || 'In Process' }
    );
    filtered = safeApps;
  }

  return (
    <>
      <h4>
        {currentUser.role === 'candidate'
          ? 'Your Job Applications'
          : jobId
            ? 'Applicants for Job'
            : 'All Job Applications'}
      </h4>

      {renderTable(filtered, columns)}
      {applicantDetail && <Modal />}
    </>
  );
};

export default Applications;
