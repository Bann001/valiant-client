import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Login user
export const login = async (email, password) => {
  try {
    console.log('Attempting login with:', { email, password });
    console.log('Login URL:', `${API_URL}/login`);
    
    const response = await axios.post(`${API_URL}/login`, { email, password });
    console.log('Login response:', response.data);
    
    if (response.data.success) {
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: `${API_URL}/login`
    });
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') ? true : false;
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