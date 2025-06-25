import React, { useState, useEffect } from 'react';
import JobList from './JobList';
import ApplicationsList from './ApplicationsList';
import { fetchUsersAPI } from '../services/apiAll';


const UsersList = ({ isCandidate }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const currentUser = {
      name: sessionStorage.getItem('name') || 'Guest',
      role: sessionStorage.getItem('role') || 'guest',
      token: sessionStorage.getItem('token') || null
    };


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const role = isCandidate ? 'candidate' : 'employer';
        
        
        const response = await fetchUsersAPI(role,currentUser.token);
        setUsers(response.data || []);
        setSelectedUser(null);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [isCandidate]);

  const title = isCandidate ? 'Candidates List' : 'Employers List';

  return (
    <div>
      <h3>{title}</h3>

      {selectedUser ? (
        <>
          <button className="btn btn-secondary mb-3" onClick={() => setSelectedUser(null)}>← Back</button>
          {isCandidate
            ? <ApplicationsList candidateName={selectedUser.name} />
            : <JobList filterByEmployer={selectedUser.name} showDetails={true} />
          }
        </>
      ) : (
        users.length === 0 ? (
          <p>No {isCandidate ? 'candidates' : 'employers'} found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                

              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr
                  key={user._id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedUser(user)}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  

                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default UsersList;
