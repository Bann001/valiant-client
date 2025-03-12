import axios from 'axios';
import config from '../config';

const API_URL = `${config.API_BASE_URL}/dashboard`;

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}; 