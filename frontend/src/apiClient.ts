import axios from 'axios';

// Base client setup
const baseUrl = import.meta.env.VITE_API_BASE_URL || `${window.origin}/api`;

const apiClient = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Refresh Token Logic
let refreshingToken = false;
let failedQueue: {
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh-token') &&
            window.location.pathname !== '/login'
        ) {
            if (refreshingToken) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => apiClient(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            refreshingToken = true;

            return new Promise((resolve, reject) => {
                apiClient
                    .post('/auth/refresh-token')
                    .then(() => {
                        processQueue(null);
                        resolve(apiClient(originalRequest));
                    })
                    .catch((err) => {
                        processQueue(err);
                        if (window.location.pathname !== '/login') {
                            window.location.href = '/login';
                        }
                        reject(err);
                    })
                    .finally(() => {
                        refreshingToken = false;
                    });
            });
        }

        if (error.response) {
            console.error(
                'API Error:',
                error.response.status,
                error.response.data
            );
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
