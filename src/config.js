// Get API URL from environment or use default
const API_BASE_URL = window.env?.API_URL || 'http://localhost:5000/api';

const config = {
  API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Log the API URL being used
console.log('Using API URL:', API_BASE_URL);

export default config; 