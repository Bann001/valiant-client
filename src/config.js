const API_BASE_URL = window.env?.API_URL || 'http://localhost:5000/api';

const config = {
  API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export default config; 