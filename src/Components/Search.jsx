import React, { useState, useEffect } from 'react';
import JobList from './JobList';
import { getJobsAPI } from '../services/allApi'; // ✅ Import API
import { toast } from 'react-toastify';

function JobSearch({ setIsSearching }) {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobsAPI(token);
        setJobs(response.data || []);
      } catch (error) {
        console.error("Failed to load jobs", error);
        toast.error("Failed to load jobs from server.");
      }
    };

    fetchJobs();
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    setIsSearching(true);
    

    const filtered = jobs.filter(job => {
      const matchesTitle = job.title?.toLowerCase().includes(keyword);
      const matchesCompany = job.company?.toLowerCase().includes(keyword);
      const matchesSkills = Array.isArray(job.skills)
        ? job.skills.some(skill => skill.toLowerCase().includes(keyword))
        : false;

      const matchesLocation = location
        ? job.location?.toLowerCase().includes(location.toLowerCase())
        : true;

      return (matchesTitle || matchesCompany || matchesSkills) && matchesLocation;
    });
    setFilteredJobs(filtered);
  };

  return (
    <>
      {/* Search Form */}
      <section className="py-4 bg-light">
        <div className="container">
          <form className="row g-2 justify-content-center" onSubmit={handleSearch}>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Job title or keyword"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">Search</button>
            </div>
          </form>
        </div>
      </section>

      {/* Job Cards Display */}
      <div className="container mt-4">
        {!hasSearched ? null : (
          filteredJobs.length === 0
            ? <p>No jobs found.</p>
            : <JobList filteredjobs={filteredJobs} />
        )}
      </div>
    </>
  );
}

export default JobSearch;
