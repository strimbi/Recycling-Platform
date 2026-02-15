import axios from 'axios';
import { getToken, clearAuth } from './auth/auth';

export const api = axios.create({
    baseURL: 'http://localhost:8080',
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
