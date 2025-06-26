import React, { useState } from 'react';

import Header from '../Components/Header';
// Common site header

import JobSearch from '../Components/Search';
// Search bar for filtering jobs

import JobList from '../Components/JobList';
// List of jobs, shown below the search

function Job() {
  const [isSearching, setIsSearching] = useState(false);
  // Tracks whether a search is currently active (used to hide/show job list)

  return (
    <>
      <Header />

      {/* Search bar — can control isSearching from here */}
      <JobSearch setIsSearching={setIsSearching} />

      {/* Only show the full job list when not searching */}
      {!isSearching && <JobList viewStyle="card" showDetails={true} />}
    </>
  );
}

export default Job;
