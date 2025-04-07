// API configuration
const API_BASE_URL = import.meta.env.PROD
  ? 'http://vk4k4s04wcocgc8kkwo84k00.88.198.171.23.sslip.io/api'
  : 'http://localhost:5000/api';

export default {
  API_BASE_URL
}; 