import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Jobs from './Pages/Job';
//import JobDetail from './Pages/JobDetail';
import Dashboard from './Pages/Dashboard';
import Auth from './Pages/Auth';
import AdminDashboard from './Pages/AdminDashboard';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="jobs" element={<Jobs />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard/>} />
    </Routes>
  );
}

export default App;
