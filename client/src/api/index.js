import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const fetchTemplate = (id) => API.get(`/template/${id}`);
export const saveTemplate = (id, data) => API.put(`/template/${id}`, data);