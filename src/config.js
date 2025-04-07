// API configuration
const API_BASE_URL = import.meta.env.PROD
  ? 'http://vk4k4s04wcocgc8kkwo84k00.88.198.171.23.sslip.io/api'
  : 'http://localhost:5000/api';

// Export configuration
export default {
  API_BASE_URL,
  withCredentials: true, // Enable credentials for all requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}; 