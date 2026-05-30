import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const electionAPI = {
  getAll: () => api.get('/elections'),
  getActive: () => api.get('/elections/active'),
  create: (data) => api.post('/elections', data),
  update: (id, data) => api.put(`/elections/${id}`, data),
  delete: (id) => api.delete(`/elections/${id}`),
  updateStatus: (id, status) => api.patch(`/elections/${id}/status`, { status }),
};

export const candidateAPI = {
  getByElection: (id) => api.get(`/candidates/election/${id}`),
  getByPosition: (electionId, position) => api.get(`/candidates/election/${electionId}/position/${position}`),
  create: (data) => api.post('/candidates', data),
  update: (id, data) => api.put(`/candidates/${id}`, data),
  delete: (id) => api.delete(`/candidates/${id}`),
};

export const voteAPI = {
  cast: (data) => api.post('/votes', data),
  getHistory: () => api.get('/votes/history'),
  getStatus: (electionId) => api.get(`/votes/status/${electionId}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getVoters: () => api.get('/admin/voters'),
  approveVoter: (id) => api.patch(`/admin/voters/${id}/approve`),
  rejectVoter: (id) => api.delete(`/admin/voters/${id}/reject`),
  getAuditLogs: () => api.get('/admin/audit-logs'),
  createAdmin: (data) => api.post('/admin/create-admin', data),
};

export const resultAPI = {
  getResults: (electionId) => api.get(`/results/${electionId}`),
  exportPDF: (electionId) => api.get(`/results/${electionId}/pdf`, { responseType: 'blob' }),
  exportExcel: (electionId) => api.get(`/results/${electionId}/excel`, { responseType: 'blob' }),
};

export default api;
