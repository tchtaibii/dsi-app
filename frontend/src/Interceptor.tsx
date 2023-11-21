import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const api = axios.create({
    baseURL: `http://10.16.180.24:8000`,
    withCredentials: true,
});

api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error: any) => Promise.reject(error)
);

api.interceptors.response.use(
    (response: any) => response,
    async (error: AxiosError) => {
        if (error.response && error.response.status === 401 && error.response.data.message === 'Token has expired') {
            try {
                const refreshResponse = await api.get('/auth/token/refresh/');
                const newAccessToken = refreshResponse.data.access; // Assuming the response contains a new access token
                localStorage.setItem('access_token', newAccessToken);

                // Retry the original request with the new access token
                const originalRequest = error.config;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Error during token refresh:', refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
