import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import JobSearch from '../Components/Search';

const Home = () => {
  const navigate = useNavigate();
  const name = sessionStorage.getItem('name');
  const role = sessionStorage.getItem('role');
  const token =sessionStorage.getItem('token');
  const isLoggedIn = !!token;
  

  const handlePostJobClick = () => {
       
    
    if (!isLoggedIn) {
      navigate('/auth');
    } else if (role === 'employer') {
      navigate('/dashboard');
    } else {
      toast.warn('Only employers can post jobs.');
    }
  };

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section
        className="position-relative text-white text-center py-5"
        style={{
          background: `url('/images/job-banner.jpg') center/cover no-repeat`,
          minHeight: '400px',
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75"></div>
        <div className="position-relative container py-5">
          <h1 className="display-4 fw-bold text-shadow">Find Your Dream Job</h1>
          <p className="lead mb-4">Connecting candidates with top companies worldwide</p>
          <Link to="/jobs" className="btn btn-warning btn-lg shadow">
            Browse Jobs
          </Link>
        </div>
      </section>

      {/* Search Bar */}
      <JobSearch />

      {/* Featured Jobs */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Featured Jobs</h2>
          <div className="row g-4">
            {[1, 2, 3].map((job) => (
              <div key={job} className="col-md-4">
                <div className="card h-100 shadow-sm border-0 rounded-3 hover-shadow">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="bi bi-laptop me-2 text-primary"></i>Frontend Developer
                    </h5>
                    <p className="text-muted mb-1">
                      <i className="bi bi-building me-1"></i>ABC Tech
                    </p>
                    <p className="text-muted mb-2">
                      <i className="bi bi-geo-alt me-1"></i>Remote
                    </p>
                    <p>
                      Join a fast-paced startup building modern web apps using React and Node.js.
                    </p>
                    <Link to={`/jobs/${job}`} className="btn btn-outline-primary btn-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employer CTA */}
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h3 className="mb-3">
            <i className="bi bi-briefcase-fill me-2"></i>Are you an employer?
          </h3>
          <p className="mb-4">Post jobs and find top talent quickly.</p>
          <button onClick={handlePostJobClick} className="btn btn-light btn-lg shadow-sm">
            Post a Job
          </button>
        </div>
      </section>

      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
};

export default Home;
