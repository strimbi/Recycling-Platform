import axios from 'axios';
import { getToken, clearAuth } from './auth/auth';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export const api = axios.create({
  baseURL,
});

// attach token automatically
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// optional: auto logout on 401
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err?.response?.status === 401) {
            clearAuth();
        }
        return Promise.reject(err);
    }
);

// Attach token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rp_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A tiny helper to normalize backend errors
export function getApiErrorMessage(err) {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err.response?.data) {
    if (typeof err.response.data === 'string') return err.response.data;
    if (err.response.data.message) return err.response.data.message;
  }
  return err.message ?? 'Request failed';
}
