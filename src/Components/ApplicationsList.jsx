import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getApplicationsAPI } from '../services/apiAll';  

const Applications = ({ jobId = null }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicantDetail, setApplicantDetail] = useState(null);
  const [resume, setResume] = useState(null);

  const currentUser = {
    name: sessionStorage.getItem('name'),
    role: sessionStorage.getItem('role'),
    token: sessionStorage.getItem('token')
  };
  if (!currentUser.token) return <p>User not found or not logged in</p>;

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

  if (loading) return <p>Loading applications...</p>;
  if (applications.length === 0) {
    const emptyMsg = jobId
      ? 'No applications found for this job.'
      : currentUser.role === 'candidate'
        ? 'You have not applied to any jobs yet.'
        : 'No applications available.';
    return <p>{emptyMsg}</p>;
  }

  const handleShowResume = (app) => {
    setApplicantDetail(app);
    setResume(app.resume || (app.resumePDF ? { pdfUrl: app.resumePDF } : null));
  };

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

  let filtered = applications;
  const columns = [];

  if (currentUser.role === 'employer') {
    

    const titleCol = { header: 'Job Title', render: app => app.jobId.title || 'Deleted job' };
    const applicantCol = { header: 'Applicant', render: app => <button className="btn btn-link p-0" onClick={() => handleShowResume(app)}>{app.name}</button> };
    const dateCol = { header: 'Applied On', render: app => new Date(app.appliedAt).toLocaleDateString() };
    const statusCol = { header: 'Status', render: app => <span className={`badge bg-${app.status === 'Rejected' ? 'danger' : app.status === 'Approved' ? 'success' : 'secondary'}`}>{app.status || 'In Process'}</span> };
    columns.push(titleCol, applicantCol, dateCol, statusCol);
    if (jobId == null) {
      filtered = applications.filter(app => app.jobId?.postedBy === currentUser.name);
      


    }
  } else if (currentUser.role === 'candidate') {
    columns.push(
      { header: 'Job Title', render: app => app.jobId?.title || 'Deleted job' },
      { header: 'Company', render: app => app.jobId?.company || '-' },
      { header: 'Applied On', render: app => new Date(app.appliedAt).toLocaleDateString() },
      { header: 'Status', render: app => app.status || 'In Process' }
    );
    filtered = applications.filter(app => app.applicant._id === currentUser.name || app.name === currentUser.name);
  } else if (currentUser.role === 'admin') {
    columns.push(
      { header: 'Job Title', render: app => app.jobId.title || '-' },
      { header: 'Company', render: app => app.jobId.company || '-' },
      { header: 'Applicant', field: 'name' },
      { header: 'Applied On', render: app => new Date(app.appliedAt).toLocaleDateString() },
      { header: 'Status', render: app => app.status || 'In Process' }
    );
  }

  return (
    <>
      <h4>{currentUser.role === 'candidate' ? 'Your Job Applications' : jobId ? `Applicants for Job` : 'All Job Applications'}</h4>
      {renderTable(filtered, columns)}
      {applicantDetail && <Modal />}
    </>
  );
};

export default Applications;
