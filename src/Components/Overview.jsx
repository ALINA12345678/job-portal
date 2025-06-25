import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getStatsAPI } from '../services/allApi'; // New service

function Overview({ onSelect }) {
  const [stats, setStats] = useState({
    employers: 0,
    candidates: 0,
    jobs: 0,
    applications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return toast.warning("Not authenticated");
        }

        const response = await getStatsAPI(token);
        const { employers, candidates, jobs, applications } = response.data;
        setStats({ employers, candidates, jobs, applications });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        toast.error("Error fetching dashboard stats");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) return <p>Loading stats...</p>;

  const cards = [
    { label: 'Total Employers', value: stats.employers, view: 'employers' },
    { label: 'Total Candidates', value: stats.candidates, view: 'candidates' },
    { label: 'Jobs Posted', value: stats.jobs, view: 'jobs' },
    { label: 'Applications', value: stats.applications, view: 'applications' },
  ];

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {cards.map(({ label, value, view }) => (
        <div
          key={label}
          onClick={() => onSelect(view)}
          style={{
            flex: '1 1 150px',
            padding: '1rem',
            boxShadow: '0 0 8px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 8px rgba(0,0,0,0.15)';
          }}
        >
          <h4>{label}</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</p>
        </div>
      ))}
    </div>
  );
}

export default Overview;
