import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

// Request interceptor - attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('zidra_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('zidra_token');
      localStorage.removeItem('zidra_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Jobs API
export const jobsAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/employer/my-jobs'),
  getJobApplicants: (id) => api.get(`/jobs/${id}/applicants`),
};

// Applications API
export const applicationsAPI = {
  apply: (jobId, formData) => api.post(`/applications/${jobId}/apply`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyApplications: () => api.get('/applications/my'),
  updateStatus: (id, data) => api.patch(`/applications/${id}/status`, data),
  downloadCV: (id) => api.get(`/applications/${id}/download-cv`, { responseType: 'blob' }),
};

// Companies API
export const companiesAPI = {
  getMyCompany: () => api.get('/companies/my'),
  createCompany: (data) => api.post('/companies', data),
  updateCompany: (data) => api.put('/companies/my', data),
  getCompany: (id) => api.get(`/companies/${id}`),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadCV: (formData) => api.post('/users/upload-cv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Saved Jobs API
export const savedJobsAPI = {
  getSavedJobs: () => api.get('/saved-jobs'),
  toggleSave: (jobId) => api.post(`/saved-jobs/${jobId}`),
  getSaveStatus: (jobId) => api.get(`/saved-jobs/${jobId}/status`),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getJobs: (params) => api.get('/admin/jobs', { params }),
  updateJobStatus: (id, status) => api.patch(`/admin/jobs/${id}/status`, { status }),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
};

export default api;
