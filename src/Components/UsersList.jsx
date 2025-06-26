import React, { useState, useEffect } from 'react';
import JobList from './JobList';
import ApplicationsList from './ApplicationsList';
import { fetchUsersAPI, deleteUserAPI } from '../services/apiAll';
import { toast } from 'react-toastify';

const UsersList = ({ isCandidate }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const currentUser = {
    name: sessionStorage.getItem('name') || 'Guest',
    role: sessionStorage.getItem('role') || 'guest',
    token: sessionStorage.getItem('token') || null
  };

  useEffect(() => {
    fetchAllUsers();
  }, [isCandidate]);

  const fetchAllUsers = async () => {
    try {
      const role = isCandidate ? 'candidate' : 'employer';
      const response = await fetchUsersAPI(role, currentUser.token);
      setUsers(response.data || []);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      console.log(userId);
      
      await deleteUserAPI(userId, currentUser.token);
      toast.success("User deleted successfully!");
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error("Failed to delete user.");
    }
  };

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td onClick={() => setSelectedUser(user)} style={{ cursor: 'pointer' }}>{user.name}</td>
                  <td onClick={() => setSelectedUser(user)} style={{ cursor: 'pointer' }}>{user.email}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
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
