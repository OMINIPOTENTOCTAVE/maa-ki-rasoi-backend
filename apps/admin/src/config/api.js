import axios from 'axios';
import * as Sentry from "@sentry/react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// Request Interceptor: Add Token
api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Normalize & Global Error Handling
api.interceptors.response.use((response) => {
    // BUG FIX 2: Schema Normalization (Option A)
    // If backend returns 'metrics' but frontend expects 'stats' on production endpoint
    if (response.config.url.includes('/subscriptions/production/today') && response.data?.metrics) {
        response.data.stats = response.data.metrics;
    }
    return response;
}, (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
        localStorage.removeItem('adminToken');
        // Redirect to login if on protected route
        if (window.location.pathname !== '/admin/login') {
            window.location.href = '/admin/login';
        }
    }

    // Capture in Sentry as HandledException
    Sentry.captureException(error);

    return Promise.reject(error);
});

export default api;
