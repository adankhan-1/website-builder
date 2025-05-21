import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
  });

// Auth
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

// Templates
export const fetchAllTemplates = () => API.get('/template');
export const fetchTemplate = (id) => API.get(`/template/${id}`);
export const saveTemplate = (id, data) => API.put(`/template/${id}`, data);
export const deleteTemplate = (id) => API.delete(`/template/${id}`);

// Projects
export const saveProject = (data) => API.post('/project', data);