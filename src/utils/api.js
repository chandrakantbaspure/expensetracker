import axios from 'axios';
import { storage } from './storage';
import { showError } from './notifications';
import router from '@/router';
import store from '@/store';

const api = axios.create({
  baseURL: 'http://localhost:8082/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = storage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await store.dispatch('auth/logout');
      await router.push('/login');
      await showError('Session Expired', 'Please log in again');
    }
    return Promise.reject(error);
  }
);

export default api;