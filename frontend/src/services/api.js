import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Check if token is expired before adding it
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        if (payload.exp && payload.exp < currentTime) {
          // Token is expired, remove it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return config; // Don't add expired token
        }
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        // Invalid token format, remove it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login/register page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Subjects API
export const subjectsAPI = {
  getAll: (config) => api.get('/subjects', config),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (subject) => api.post('/subjects', subject),
  update: (id, subject) => api.put(`/subjects/${id}`, subject),
  delete: (id) => api.delete(`/subjects/${id}`),
};

// Faculty API
export const facultyAPI = {
  getAll: (config) => api.get('/faculty', config),
  getById: (id) => api.get(`/faculty/${id}`),
  create: (faculty) => api.post('/faculty', faculty),
  update: (id, faculty) => api.put(`/faculty/${id}`, faculty),
  delete: (id) => api.delete(`/faculty/${id}`),
};

// Faculty-Subject Mapping API
export const facultySubjectAPI = {
  getAll: () => api.get('/faculty-subjects'),
  getByFaculty: (facultyId) => api.get(`/faculty-subjects/faculty/${facultyId}`),
  getBySubject: (subjectId) => api.get(`/faculty-subjects/subject/${subjectId}`),
  assign: (facultyId, subjectId) => api.post('/faculty-subjects', { facultyId, subjectId }),
  remove: (facultyId, subjectId) => api.delete('/faculty-subjects', { 
    data: { facultyId, subjectId } 
  }),
};

// Feedback API
export const feedbackAPI = {
  getAll: () => api.get('/feedback'),
  getById: (id) => api.get(`/feedback/${id}`),
  getByStudent: (studentId) => api.get(`/feedback/student/${studentId}`),
  getByFaculty: (facultyId) => api.get(`/feedback/faculty/${facultyId}`),
  getBySubject: (subjectId) => api.get(`/feedback/subject/${subjectId}`),
  submit: (feedback) => api.post('/feedback', feedback),
};

// Analytics API
export const analyticsAPI = {
  getSubjectAnalytics: (subjectId) => api.get(`/analytics/subjects/${subjectId}`),
  getFacultyAnalytics: (facultyId) => api.get(`/analytics/faculty/${facultyId}`),
  getOverallAnalytics: () => api.get('/analytics/overall'),
};

// Users API (Admin)
export const usersAPI = {
  listByRole: (role) => api.get(`/users/role/${role}`),
  delete: (id) => api.delete(`/users/${id}`),
  update: (id, payload) => api.put(`/users/${id}`, payload),
};

// Events API
export const eventsAPI = {
  list: () => api.get('/events'),
  create: (payload) => api.post('/events', payload),
  update: (id, payload) => api.put(`/events/${id}`, payload),
  active: () => api.get('/events/active'),
  bySubject: (subjectId) => api.get(`/events/subject/${subjectId}`),
  past: () => api.get('/events/past'),
};

export default api;