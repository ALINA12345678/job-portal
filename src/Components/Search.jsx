import React, { useState, useEffect } from 'react';
import JobList from './JobList';
import { getJobsAPI } from '../services/apiAll'; // API function to get all jobs
import { toast } from 'react-toastify';

function JobSearch({ setIsSearching = () => { } }) { // optional prop fallback
  const [jobs, setJobs] = useState([]); // all jobs from backend
  const [keyword, setKeyword] = useState(''); // search input: title/skills
  const [location, setLocation] = useState(''); // search input: location
  const [filteredJobs, setFilteredJobs] = useState([]); // jobs matching search
  const [hasSearched, setHasSearched] = useState(false); // control result visibility

  const token = sessionStorage.getItem('token'); // get user token

  // Fetch all jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobsAPI(token); // call API
        setJobs(response.data || []); // store in state
      } catch (error) {
        console.error("Failed to load jobs", error);
        toast.error("Failed to load jobs from server.");
      }
    };

    fetchJobs();
  }, [token]);

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault(); // prevent form reload
    setHasSearched(true); // show results section
    setIsSearching(true); // notify parent (if needed)

    // Filter logic based on keyword and location
    const filtered = jobs.filter(job => {
      // Convert input to lowercase for case-insensitive matching
      const lowerKeyword = keyword.trim().toLowerCase();
      const lowerLocation = location.trim().toLowerCase();

      // ✅ Match job title with keyword
      const matchesTitle = job.title?.toLowerCase().includes(lowerKeyword);

      // ✅ Match company name with keyword
      const matchesCompany = job.company?.toLowerCase().includes(lowerKeyword);

      // ✅ Match any skill in skills array with keyword
      const matchesSkills = Array.isArray(job.skills)
        ? job.skills.some(skill => skill.toLowerCase().includes(lowerKeyword))
        : false;

      // ✅ Match location with input location (or always true if location is blank)
      const matchesLocation = location
        ? job.location?.toLowerCase().includes(lowerLocation)
        : true;

      // ✅ Final condition:
      // Keyword should match title, company OR skills
      // AND location (if given) should also match
      return (matchesTitle || matchesCompany || matchesSkills) && matchesLocation;
    });


    setFilteredJobs(filtered); // update UI
  };

  return (
    <>
      {/* Search Form UI */}
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

      {/* Show results only after searching */}
      <div className="container mt-4">
        {!hasSearched ? null : (
          filteredJobs.length === 0
            ? <p>No jobs found.</p>
            : <JobList filteredjobs={filteredJobs} /> // JobList expects `filteredjobs` prop
        )}
      </div>
    </>
  );
}

export default JobSearch;
