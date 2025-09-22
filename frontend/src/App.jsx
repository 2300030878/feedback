import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FeedbackProvider } from './contexts/FeedbackContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Components
import HomePage from './components/HomePage';
import AutoRedirect from './components/AutoRedirect';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Student Components
import StudentDashboard from './components/student/StudentDashboard';
import FeedbackForm from './components/student/FeedbackForm';
import MyFeedback from './components/student/MyFeedback';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminSubjects from './components/admin/AdminSubjects';
import AdminFaculty from './components/admin/AdminFaculty';
import AdminMappings from './components/admin/AdminMappings';
import AdminAnalytics from './components/admin/AdminAnalytics';
import AdminCreateEvent from './components/admin/AdminCreateEvent';
import AdminStudents from './components/admin/AdminStudents';
import FacultyDashboard from './components/faculty/FacultyDashboard';

// Error Pages
import Unauthorized from './components/error/Unauthorized';
import NotFound from './components/error/NotFound';

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Main App Layout
const AppLayout = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <FeedbackProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<AutoRedirect />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Student Routes */}
              <Route 
                path="/student/dashboard" 
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/feedback" 
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <FeedbackForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/student/my-feedback" 
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <MyFeedback />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Admin Routes */}
              <Route 
                path="/faculty/dashboard" 
                element={
                  <ProtectedRoute requiredRole="FACULTY">
                    <FacultyDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminAnalytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/events" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminCreateEvent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/subjects" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminSubjects />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/faculty" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminFaculty />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/mappings" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminMappings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/students" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminStudents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/feedback" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">View All Feedback</h1>
                        <p className="text-gray-600">All feedback submissions will be shown here.</p>
      </div>
      </div>
                  </ProtectedRoute>
                } 
              />

              {/* Error Routes */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/404" element={<NotFound />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </Router>
      </FeedbackProvider>
    </AuthProvider>
  );
};

export default App;