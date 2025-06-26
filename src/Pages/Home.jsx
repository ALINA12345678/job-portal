import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// For navigation and linking to other pages
import bannerImg from '../assets/office.jpg'; // adjust path as needed


import Header from '../Components/Header';
// Reusable header component

import { Bounce, toast, ToastContainer } from 'react-toastify';
// For showing toast messages (alerts)

import JobSearch from '../Components/Search';
import JobList from '../Components/JobList';
// Job search bar component

const Home = () => {
  const navigate = useNavigate(); // React Router hook for navigation

  // Fetching user info from sessionStorage
  const name = sessionStorage.getItem('name');
  const role = sessionStorage.getItem('role');
  const token = sessionStorage.getItem('token');
  const isLoggedIn = !!token; // Boolean check if user is logged in

  // Called when user clicks "Post a Job"
  const handlePostJobClick = () => {
    if (!isLoggedIn) {
      navigate('/auth'); // If not logged in, go to Auth page
    } else if (role === 'employer') {
      navigate('/dashboard'); // If employer, go to dashboard
    } else {
      toast.warn('Only employers can post jobs.'); // Warn others
    }
  };

  return (
    <div>
      <Header />

      {/* Hero Section with background image */}
      <section
        className="position-relative text-white text-center py-5"
        style={{
          backgroundImage: `url(${bannerImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          minHeight: '400px',
        }}

      >
        {/* Dark overlay for readability */}
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75"></div>

        <div className="position-relative container py-5">
          <h1 className="display-4 fw-bold text-shadow">Find Your Dream Job</h1>
          <p className="lead mb-4">Connecting candidates with top companies worldwide</p>
          <Link to="/jobs" className="btn btn-warning btn-lg shadow">
            Browse Jobs
          </Link>
        </div>
      </section>

      {/* Search bar below hero */}
      <JobSearch />

      {/* Featured Jobs */}
      <section className="py-5">
        <div className="container">
          <JobList filterfeatured={true} />
          
        </div>
      </section>

      {/* Employer CTA section */}
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

      {/* Toast notifications (bottom right corner) */}
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
