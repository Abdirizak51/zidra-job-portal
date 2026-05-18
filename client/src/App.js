import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Public pages
import Home from './pages/public/Home';
import Jobs from './pages/public/Jobs';
import JobDetail from './pages/public/JobDetail';
import { NotFound, ServerError } from './pages/public/ErrorPages';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Applicant pages
import ApplicantDashboard from './pages/applicant/Dashboard';
import Profile from './pages/applicant/Profile';
import AppliedJobs from './pages/applicant/AppliedJobs';
import SavedJobs from './pages/applicant/SavedJobs';

// Employer pages
import EmployerDashboard from './pages/employer/Dashboard';
import PostJob from './pages/employer/PostJob';
import MyJobs from './pages/employer/MyJobs';
import Applicants from './pages/employer/Applicants';
import CompanyProfile from './pages/employer/CompanyProfile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageJobs from './pages/admin/ManageJobs';

const Layout = ({ children, hideFooter }) => (
  <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
    <Navbar />
    <main className="flex-1">
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        {children}
      </Suspense>
    </main>
    {!hideFooter && <Footer />}
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                borderRadius: '12px',
                fontSize: '14px',
                padding: '12px 16px',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#f9fafb' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#f9fafb' } },
            }}
          />
          <Routes>
            {/* ── Public ── */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
            <Route path="/jobs/:id" element={<Layout><JobDetail /></Layout>} />
            <Route path="/500" element={<ServerError />} />

            {/* ── Auth ── */}
            <Route path="/login" element={<Layout hideFooter><Login /></Layout>} />
            <Route path="/register" element={<Layout hideFooter><Register /></Layout>} />
            <Route path="/forgot-password" element={<Layout hideFooter><ForgotPassword /></Layout>} />
            <Route path="/reset-password" element={<Layout hideFooter><ResetPassword /></Layout>} />

            {/* ── Applicant ── */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['applicant']}>
                <Layout hideFooter><ApplicantDashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['applicant']}>
                <Layout><Profile /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/applied-jobs" element={
              <ProtectedRoute allowedRoles={['applicant']}>
                <Layout><AppliedJobs /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/saved-jobs" element={
              <ProtectedRoute allowedRoles={['applicant']}>
                <Layout><SavedJobs /></Layout>
              </ProtectedRoute>
            } />

            {/* ── Employer ── */}
            <Route path="/employer/dashboard" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <Layout hideFooter><EmployerDashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/employer/post-job" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <Layout><PostJob /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/employer/jobs" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <Layout><MyJobs /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/employer/jobs/:id/applicants" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <Layout><Applicants /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/employer/company" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <Layout><CompanyProfile /></Layout>
              </ProtectedRoute>
            } />

            {/* ── Admin ── */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout hideFooter><AdminDashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout><ManageUsers /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/jobs" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout><ManageJobs /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout><AdminDashboard /></Layout>
              </ProtectedRoute>
            } />

            {/* ── 404 ── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
