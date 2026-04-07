import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

let refreshingToken = false;

apiClient.interceptors.response.use(
    async (response) => {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }

        if (response.status === 401 && !refreshingToken) {
            // Try to refresh the token
            refreshingToken = true;
            return apiClient.post('/auth/refresh').then((refreshResponse) => {
                refreshingToken = false;

                if (refreshResponse.status === 200) {
                    // Retry the original request
                    const originalRequest = response.config;
                    return apiClient(originalRequest);
                } else {
                    // If refresh fails, reject with the original error
                    console.error('Token refresh failed:', refreshResponse);
                    window.location.href = '/login';
                    return Promise.reject(response);
                }
            });
        }

        return response;
    },
    (error) => {
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
