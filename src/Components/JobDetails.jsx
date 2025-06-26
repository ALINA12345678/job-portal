import React from 'react';

function JobDetails({ job }) {
  // If no job is selected, return nothing
  if (!job) return null;

  // Check if the deadline has passed (used to style deadline in red)
  const isDeadlinePassed = new Date(job.deadline) < new Date();

  return (
    <div className="card shadow p-4">
      {/* Job Title */}
      <h3 className="mb-3">{job.title}</h3>
      
      {/* Company Name */}
      <p><strong>Company:</strong> {job.company}</p>

      {/* Location (fallback to Remote) */}
      <p><strong>Location:</strong> {job.location || 'Remote'}</p>

      {/* Job Type (Full-time, Part-time, etc.) */}
      <p><strong>Type:</strong> {job.type}</p>

      {/* Salary Info */}
      <p><strong>Salary:</strong> ₹{job.salary}</p>

      {/* Skills list, only shown if skills exist */}
      {job.skills?.length > 0 && (
        <p><strong>Skills Required:</strong> {job.skills.join(', ')}</p>
      )}

      {/* Job Description */}
      <p><strong>Description:</strong> {job.description}</p>

      {/* Application Deadline, styled red if passed */}
      <p>
        <strong>Deadline:</strong>{' '}
        <span className={isDeadlinePassed ? 'text-danger' : ''}>
          {job.deadline || 'N/A'}
        </span>
      </p>

      {/* Application Link, shown only if exists */}
      {job.applicationLink && (
        <p>
          <strong>Application Link:</strong>{' '}
          <a href={job.applicationLink} target="_blank" rel="noopener noreferrer">
            {job.applicationLink}
          </a>
        </p>
      )}

      {/* Name of person who posted the job */}
      <p><strong>Posted By:</strong> {job.postedBy}</p>
    </div>
  );
}

export default JobDetails;
