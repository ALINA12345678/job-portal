import { Routes, Route } from 'react-router-dom';
// Imports routing components from react-router-dom

import Home from './Pages/Home';
import Jobs from './Pages/Job';
// import JobDetail from './Pages/JobDetail'; // This route is currently not in use

import Dashboard from './Pages/Dashboard';
import Auth from './Pages/Auth';
import AdminDashboard from './Pages/AdminDashboard';
// Imports the page components used in routes

function App() {
  return (
    <Routes>
      {/* Routes define which component to render based on the URL path */}

      <Route path='/' element={<Home />} />
      {/* When user visits "/", the Home component is rendered */}

      <Route path="jobs" element={<Jobs />} />
      {/* Visiting "/jobs" shows the Jobs component */}

      <Route path="/auth" element={<Auth />} />
      {/* Shows login or signup page */}

      <Route path="/dashboard" element={<Dashboard />} />
      {/* Dashboard for logged-in users */}

      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      {/* Admin view — maybe for managing jobs, users etc. */}
    </Routes>
  );
}

export default App;
// Exports the App component to be used in main.jsx
