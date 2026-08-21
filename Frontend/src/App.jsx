import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/Dashboard';
import StudentSetup from './pages/student/Setup';
import StudentUpload from './pages/student/Upload';
import StudentPortfolio from './pages/student/Portfolio';
import StudentProfile from './pages/student/Profile';
import StudentNotices from './pages/student/Notices';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProfile from './pages/admin/Profile';
import AdminStudents from './pages/admin/Students';
import AdminSubmissions from './pages/admin/Submissions';
import AdminNotices from './pages/admin/Notices';
import AdminRecords from './pages/admin/Records';
import AdminLogs from './pages/admin/Logs';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Student Routes */}
          <Route path="/student" element={<Navigate to="/student/dashboard" />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/setup" element={<StudentSetup />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/upload" element={<StudentUpload />} />
          <Route path="/student/portfolio" element={<StudentPortfolio />} />
          <Route path="/student/notices" element={<StudentNotices />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/records" element={<AdminRecords />} />
          <Route path="/admin/submissions" element={<AdminSubmissions />} />
          <Route path="/admin/notices" element={<AdminNotices />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster richColors position="top-right" />
      </div>
    </Router>
  );
}

export default App;
