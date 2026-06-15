import axios from 'axios';

// ======================================
// API BASE URL
// ======================================

const api = axios.create({
  baseURL: 'http://localhost:9090/api',
});

// ======================================
// REQUEST INTERCEPTOR
// ======================================

api.interceptors.request.use((config) => {

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (userId) {
    config.headers['X-User-Id'] = userId;
  }

  return config;
});

// ======================================
// RESPONSE INTERCEPTOR
// ======================================

api.interceptors.response.use(

  (response) => response,

  (error) => {

    console.error('API ERROR:', error);

    if (error.response?.status === 401) {

      localStorage.clear();

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;

// ======================================
// WORKFLOW API
// ======================================

export const workflowApi = {

  // GET ALL WORKFLOWS
  list: () =>
    api.get('/workflows'),

  // GET WORKFLOW BY ID
  getById: (id) =>
    api.get(`/workflows/${id}`),

  // CREATE WORKFLOW
  create: (data) =>
    api.post('/workflows', data),

  // WORKFLOW HISTORY
  history: (id) =>
    api.get(`/workflows/${id}/history`),

  // DASHBOARD
  dashboard: () =>
    api.get('/workflows/dashboard'),

  // SEARCH
  search: (q) =>
    api.get(`/workflows/search?q=${q}`),

  // APPROVE
  approve: (id) =>
    api.put(`/workflows/${id}/approve`),

  // REJECT
  reject: (id) =>
    api.put(`/workflows/${id}/reject`),

  // MANAGER APPROVE
  managerApprove: (id) =>
    api.put(`/workflows/${id}/manager-approve`),

  // MANAGER QUEUE
  managerQueue: () =>
    api.get('/workflows/manager'),

  // ADMIN QUEUE
  adminQueue: () =>
    api.get('/workflows/admin'),
};

// ======================================
// APPROVAL API
// ======================================

export const approvalApi = {

  approve: (id) =>
    api.put(`/workflows/${id}/approve`),

  reject: (id) =>
    api.put(`/workflows/${id}/reject`),

  decide: (id, data) => {

    if (data?.decision === 'APPROVED') {
      return api.put(`/workflows/${id}/approve`);
    }

    return api.put(`/workflows/${id}/reject`);
  },
};

// ======================================
// SEARCH API
// ======================================

export const searchApi = {

  quick: (q) =>
    api.get(`/workflows/smart-search?q=${q}`),

};
// ======================================
// AUTH API
// ======================================

export const authApi = {

  login: async (email, password) => {

    const response = await api.post('/auth/login', {
      email,
      password,
    });

    return response;
  },

  register: async (name, email, password) => {

    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    });

    return response;
  },
};