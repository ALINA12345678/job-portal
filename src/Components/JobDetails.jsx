import React from 'react';

function JobDetails({ job }) {
  if (!job) return null;

  return (
    <div className="card shadow p-4">
      <h3 className="mb-3">{job.title}</h3>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Type:</strong> {job.type}</p>
      <p><strong>Salary:</strong> ₹{job.salary}</p>
      <p><strong>Skills Required:</strong> {job.skills?.join(', ')}</p>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Deadline:</strong> {job.deadline}</p>
      <p><strong>Application Link:</strong> {job.applicationLink}</p>
      <p><strong>Posted By:</strong> {job.postedBy}</p>
    </div>
  );
}

export default JobDetails;
