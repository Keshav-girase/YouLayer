import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // all requests will be prefixed with /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors (e.g., for auth errors or logging)
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // You can log or transform global errors here
    return Promise.reject(error);
  }
);

export default axiosInstance;
