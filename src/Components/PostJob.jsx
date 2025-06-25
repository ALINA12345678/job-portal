import React, { useState } from 'react';
import { postJobAPI } from '../services/allApi';

const PostJob = () => {
  const [job, setJob] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    description: '',
    skills: [],
    deadline: '',
    salary: '',
    applicationLink: '',
  });

  const skillsOptions = ['JavaScript', 'React', 'CSS', 'Communication', 'Node.js', 'Python'];

  const handleChange = e => {
    const { name, value } = e.target;
    setJob(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = e => {
    const { options } = e.target;
    const selectedSkills = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selectedSkills.push(options[i].value);
    }
    setJob(prev => ({ ...prev, skills: selectedSkills }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!job.title || !job.company || !job.description) {
      alert('Please fill required fields: Job Title, Company Name, Job Description');
      return;
    }

    const currentUser = {
      name: sessionStorage.getItem('name') || 'Guest',
      role: sessionStorage.getItem('role') || 'guest',
      token: sessionStorage.getItem('token') || null
    };

    if (currentUser.role !== 'employer') {
      alert('Only employers can post jobs.');
      return;
    }

    try {
      const jobId = `job-${Date.now()}`;
      const jobWithId = { ...job, id: jobId };

      const response = await postJobAPI(jobWithId, currentUser.token);

      if (response?.status !== 201 && response?.status !== 200) {
        alert(`Error: ${response?.data?.message || 'Failed to post job'}`);
        return;
      }

      alert('Job posted successfully!');
      setJob({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        description: '',
        skills: [],
        deadline: '',
        salary: '',
        applicationLink: '',
      });
    } catch (error) {
      
      alert('Error posting job: ' + error.message);
    }
  }



  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow-sm">
        <h3 className="mb-4 text-center">Post a Job</h3>

        <div className="mb-3">
          <label className="form-label">Job Title*</label>
          <input className="form-control" name="title" value={job.title} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Company Name*</label>
          <input className="form-control" name="company" value={job.company} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input className="form-control" name="location" value={job.location} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Job Type</label>
          <select className="form-select" name="type" value={job.type} onChange={handleChange}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Freelance</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Job Description*</label>
          <textarea className="form-control" name="description" rows="4" value={job.description} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Required Skills</label>
          <select multiple className="form-select" value={job.skills} onChange={handleSkillsChange}>
            {skillsOptions.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Application Deadline</label>
          <input type="date" className="form-control" name="deadline" value={job.deadline} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Salary / Stipend</label>
          <input className="form-control" name="salary" value={job.salary} onChange={handleChange} />
        </div>

        <div className="mb-4">
          <label className="form-label">Application Link / Email</label>
          <input className="form-control" name="applicationLink" value={job.applicationLink} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary w-100">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
