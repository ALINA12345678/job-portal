import React, { useEffect, useState } from 'react';
import JobDetails from './JobDetails';
import Applications from './ApplicationsList';
import { toast, ToastContainer } from 'react-toastify';
import {
    deleteJobAPI,
    getJobsAPI,
    applyJobAPI,
    getProfileAPI,
    markAsFeaturedAPI
} from '../services/apiAll';

const JobList = ({ showDetails = false, filterByEmployer = null, filteredjobs = null, filterfeatured = null }) => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [viewingJobId, setViewingJobId] = useState(null);
    const [profile, setProfile] = useState(null);
    const [appliedJobs, setAppliedJobs] = useState([]);

    const currentUser = {
        name: sessionStorage.getItem('name') || 'Guest',
        role: sessionStorage.getItem('role') || 'guest',
        token: sessionStorage.getItem('token') || null
    };

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getJobsAPI(currentUser.token);
                const fetchedJobs = response.data || [];

                let filtered = fetchedJobs;

                if (filterByEmployer) {
                    filtered = filtered.filter(job => job.postedBy === filterByEmployer);
                }

                if (filterfeatured) {
                    filtered = filtered.filter(job => job.isFeatured === true);
                }

                setJobs(filteredjobs ?? filtered);
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
                setJobs([]);
            }
        };

        const fetchProfile = async () => {
            if (!currentUser.token || currentUser.role !== 'candidate') return;
            try {
                const response = await getProfileAPI(currentUser.token);
                setProfile(response.data);
            } catch (error) {
                console.warn('Profile not found or failed to load');
                setProfile(null);
            }
        };

        fetchJobs();
        fetchProfile();
    }, [filterByEmployer, filteredjobs, filterfeatured]);

    const handleApplication = async (job) => {
        if (!currentUser.token) {
            return toast.warning("Please login to apply");
        }

        const uploadedPDF = localStorage.getItem('uploadedPDF');
        if (!profile && !uploadedPDF) {
            return toast.warning("Please complete your profile or upload a PDF before applying");
        }

        const resumeData = uploadedPDF
            ? { resumePDF: uploadedPDF }
            : { resume: profile };

        const payload = {
            jobId: job._id,
            name: currentUser.name,
            ...resumeData
        };

        try {
            const response = await applyJobAPI(job._id, currentUser.token, payload);

            if (response.status === 200) {
                toast.success("Application submitted successfully!");
                setAppliedJobs(prev => [...prev, job._id]);
            }
        } catch (err) {
            if (err.response?.status === 409) {
                toast.info(err.response.data?.message || "You already applied.");
                setAppliedJobs(prev => [...prev, job._id]);
            } else {
                console.error("Apply error:", err);
                toast.error("Server error when applying");
            }
        }
    };

    const deleteJob = async (id, index) => {
        try {
            const response = await deleteJobAPI(id, currentUser.token);
            if (response.status === 200) {
                const updated = [...jobs];
                updated.splice(index, 1);
                setJobs(updated);
            } else {
                toast.error(response.data?.message || 'Failed to delete job');
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            toast.error('Error deleting job');
        }
    };

    const handleMarkAsFeatured = async (id, index) => {
        try {
            const response = await markAsFeaturedAPI(id, currentUser.token);
            if (response.status === 200) {
                const updated = [...jobs];
                updated[index].isFeatured = true;
                setJobs(updated);
                toast.success("Job marked as featured!");
            } else {
                toast.error("Failed to mark as featured");
            }
        } catch (error) {
            console.error("Error marking as featured:", error);
            toast.error("Server error");
        }
    };

    const JobActions = ({ job, index }) => {
        const isDeadlinePassed = new Date(job.deadline) < new Date();
        const alreadyApplied = appliedJobs.includes(job._id);

        if (currentUser.role === 'admin') {
            return (
                <button className="btn btn-danger btn-sm float-end"
                    onClick={(e) => { e.stopPropagation(); deleteJob(job.id, index); }}>
                    Delete
                </button>
            );
        }

        if (currentUser.role === 'employer' && currentUser.name === job.postedBy) {
            return (
                <div>
                    <button className="btn btn-warning btn-sm me-2"
                        onClick={(e) => { e.stopPropagation(); setViewingJobId(job._id); }}>
                        View Applicants
                    </button>
                    <button className="btn btn-danger btn-sm float-end"
                        onClick={(e) => { e.stopPropagation(); deleteJob(job._id, index); }}>
                        Delete Job
                    </button>
                    {!job.isFeatured && (
                        <button
                            className="btn btn-success btn-sm me-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsFeatured(job._id, index);
                            }}
                        >
                            Make Featured
                        </button>
                    )}
                </div>
            );
        }

        if (currentUser.role === 'candidate') {
            return (
                <>
                    {alreadyApplied && (
                        <span className="badge bg-info text-dark me-2">Already Applied</span>
                    )}
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => { e.stopPropagation(); handleApplication(job); }}
                        disabled={isDeadlinePassed || alreadyApplied}
                        title={isDeadlinePassed ? "Deadline passed" : alreadyApplied ? "Already applied" : ""}
                    >
                        Apply Now
                    </button>
                </>
            );
        }

        return (
            <button className="btn btn-primary btn-sm"
                onClick={(e) => {
                    e.stopPropagation();
                    toast.warning("Please login/register to apply");
                    setTimeout(() => window.location.href = '/auth', 1000);
                }}>
                Apply Now
            </button>
        );
    };

    if (showDetails && selectedJob) {
        return (
            <div className="container my-4">
                <button className="btn btn-secondary mb-3" onClick={() => setSelectedJob(null)}>← Back to Jobs</button>
                <JobDetails job={selectedJob} />
            </div>
        );
    }

    return (
        <div className="container my-4">
            {viewingJobId ? (
                <>
                    <Applications jobId={viewingJobId} />
                    <button className="btn btn-outline-secondary mt-3" onClick={() => setViewingJobId(null)}>← Back to Jobs</button>
                </>
            ) : jobs.length === 0 ? (
                <div className="alert alert-info">No jobs found.</div>
            ) : (
                <div className="row">
                    {(filterfeatured ? jobs.slice(0, 3) : jobs).map((job, index) => {
                        const isDeadlinePassed = new Date(job.deadline) < new Date();

                        return (
                            <div className="col-md-6 col-lg-4 mb-4" key={job._id || index}>
                                <div className="card shadow-sm h-100"
                                    style={{ cursor: showDetails ? 'pointer' : 'default' }}
                                    onClick={() => showDetails && setSelectedJob(job)}>
                                    <div className="card-body">
                                        {job.isFeatured && (
                                            <span className="badge bg-warning text-dark mb-2">🌟 Featured</span>
                                        )}
                                        <h5 className="card-title">{job.title}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">{job.company}</h6>
                                        <p className="card-text">
                                            <strong>Type:</strong> {job.type}<br />
                                            <strong>Location:</strong> {job.location || 'Remote'}<br />
                                            <strong>Deadline:</strong>{' '}
                                            <span className={isDeadlinePassed ? 'text-danger' : ''}>
                                                {job.deadline || 'N/A'}
                                            </span>
                                        </p>
                                        {job.skills?.length > 0 && (
                                            <div className="mb-2">
                                                {job.skills.map((skill, i) => (
                                                    <span className="badge bg-secondary me-1" key={i}>{skill}</span>
                                                ))}
                                            </div>
                                        )}
                                        <JobActions job={job} index={index} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default JobList;
