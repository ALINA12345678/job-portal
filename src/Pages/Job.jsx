import React, { useState } from 'react';
import Header from '../Components/Header';
import JobSearch from '../Components/Search';
import JobList from '../Components/JobList';

function Job() {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <>
      <Header />
      <JobSearch setIsSearching={setIsSearching} />
      {!isSearching && <JobList viewStyle="card" showDetails={true} />}
    </>
  );
}

export default Job;
