import React from 'react';
import UsersList from '../Components/UsersList';
import Header from '../Components/Header';
import ApplicationsList from '../Components/ApplicationsList';
import JobList from '../Components/JobList';
import Overview from '../Components/Overview';

const menuItems = [
  { key: 'overview', label: 'Overview', icon: '📊' },
  { key: 'employers', label: 'Employers', icon: '🏢' },
  { key: 'candidates', label: 'Candidates', icon: '👤' },
  { key: 'jobs', label: 'Jobs', icon: '💼' },
  { key: 'applications', label: 'Applications', icon: '📬' },
];

function AdminDashboard() {
  const [view, setView] = React.useState('overview');

  return (
    <>
      <Header />
      <div style={{ display: 'flex', minHeight: '90vh', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
        {/* Sidebar */}
        <nav
          style={{
            width: '220px',
            borderRight: '2px solid #ddd',
            padding: '1rem',
            backgroundColor: '#1e1e2f',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {menuItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              style={{
                background: view === key ? '#4e54c8' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: view === key ? 'white' : '#bbb',
                padding: '10px 15px',
                fontSize: '1rem',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.3s, color 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = view === key ? 'white' : '#bbb')}
            >
              <span style={{ fontSize: '1.2rem' }}>{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main
          style={{
            flex: 1,
            padding: '2rem',
            background: '#f9f9fb',
            overflowY: 'auto',
            borderRadius: '0 15px 15px 0',
            boxShadow: 'inset 0 0 10px #ddd',
          }}
        >
          {view === 'overview' && <Overview onSelect={setView}/>}
          {view === 'employers' && <UsersList />}
          {view === 'candidates' && <UsersList isCandidate />}
          {view === 'jobs' && <JobList viewStyle="card" showDetails={true} />}
          {view === 'applications' && <ApplicationsList />}
        </main>
      </div>
    </>
  );
}

export default AdminDashboard;
