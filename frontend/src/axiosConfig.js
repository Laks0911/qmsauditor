import axios from 'axios';

// Configure axios to include JWT token in all requests
const setupAxios = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ Token added to request header");
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle 401 responses (expired token)
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error("❌ 401 Unauthorized - token expired or invalid");
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxios;
