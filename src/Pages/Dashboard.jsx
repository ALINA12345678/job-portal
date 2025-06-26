import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import PostJob from '../Components/PostJob';
import JobsList from '../Components/JobList';
import JobList from '../Components/JobList';
import ProfileForm from '../Components/Profileform';
import Applications from '../Components/ApplicationsList';



const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [selectedOption, setSelectedOption] = useState('home');
  const [employer, setEmployer] = useState('');
  const [user, setUser] = useState('');
  const [allApplications, setAllApplications] = useState([]);
  const capitalizeFirst = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  // Auth & role check
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    const uname = sessionStorage.getItem('name');
   setUser(capitalizeFirst(uname));

    


    if (!token || !role) {

      navigate('/auth');
      return;
    }
    setRole(role);
    if (role === 'employer') setEmployer(uname);
  }, [navigate]);

  // Refresh application data only when needed
  useEffect(() => {
    if (selectedOption === 'history' || selectedOption === 'applications') {
      const savedApplications = JSON.parse(localStorage.getItem('applications')) || [];
      setAllApplications(savedApplications);
    }
  }, [selectedOption]);

  const updateStatus = (index, newStatus) => {
    const updatedApplications = [...allApplications];
    updatedApplications[index].status = newStatus;
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
    setAllApplications(updatedApplications);
    alert(`Application marked as ${newStatus}`);
  };



  if (!role) return null;

  const renderContent = () => {
    if (role === 'employer') {
      switch (selectedOption) {
        case 'post':
          return <PostJob />;
        case 'jobs':
          return <JobsList showDetails={true} filterByEmployer={employer} />;
        case 'applications':
          return (
            <div className="container mt-4">
              <h4>🕵️ Applications Review Panel</h4>
              {<Applications />}
            </div>
          );
        default:
          return <h4 className="text-muted">👋 Welcome, {user}! Select an option from the sidebar.</h4>;
      }
    } else {
      switch (selectedOption) {
        case 'browse':
          return <JobList />;
        case 'profile':
          return <ProfileForm />;
        case 'history':
          return (
            <div className="container mt-4">
              <h4>📬 Application History</h4>
              {<Applications />}
            </div>
          );
        default:
          return <h4 className="text-muted">👋 Welcome, {user}! Select an option from the sidebar.</h4>;
      }
    }
  };

  return (
    <>
      <Header />
      <div className="container-fluid mt-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2 bg-light border-end min-vh-100">
            <div className="p-3">
              <h5>{role === 'employer' ? 'Employer Panel' : 'Candidate Panel'}</h5>
              <div className="list-group mt-3">
                {role === 'employer' ? (
                  <>
                    <button className={`list-group-item list-group-item-action ${selectedOption === 'post' ? 'active' : ''}`} onClick={() => setSelectedOption('post')}>
                      ✅ Post a new job
                    </button>
                    <button className={`list-group-item list-group-item-action ${selectedOption === 'jobs' ? 'active' : ''}`} onClick={() => setSelectedOption('jobs')}>
                      📋 View posted jobs
                    </button>
                    <button className={`list-group-item list-group-item-action ${selectedOption === 'applications' ? 'active' : ''}`} onClick={() => setSelectedOption('applications')}>
                      🕵️ Review applications
                    </button>
                  </>
                ) : (
                  <>
                    <button className={`list-group-item list-group-item-action ${selectedOption === 'browse' ? 'active' : ''}`} onClick={() => setSelectedOption('browse')}>
                      🔍 Browse & apply to jobs
                    </button>
                    <button className={`list-group-item list-group-item-action ${selectedOption === 'profile' ? 'active' : ''}`} onClick={() => setSelectedOption('profile')}>
                      📄 Manage profile/resume
                    </button>
                    <button className={`list-group-item list-group-item-action ${selectedOption === 'history' ? 'active' : ''}`} onClick={() => setSelectedOption('history')}>
                      📬 Application history
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9 col-lg-10 p-4">
            <h2 className="mb-4">Dashboard</h2>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
