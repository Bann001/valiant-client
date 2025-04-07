import axios from 'axios';
import config from '../config';

// Configure axios defaults
axios.defaults.baseURL = config.API_BASE_URL;
axios.defaults.withCredentials = config.withCredentials;
axios.defaults.headers.common = {
  ...axios.defaults.headers.common,
  ...config.headers
};

// Login user
export const login = async (email, password) => {
  try {
    console.log('Attempting login...');
    const response = await axios.post('/auth/login', {
      email,
      password
    });
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Set token in axios defaults for subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get auth header
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
}; 