import axios from 'axios';
import { getAuthHeader } from './authService';

const API_URL = 'http://localhost:5000/api/vessels';

// Get all vessels
export const getVessels = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log('API Response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error in getVessels:', error.response || error);
    throw error;
  }
};

// Get vessel by ID
export const getVesselById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching vessel with ID ${id}:`, error.response || error);
    throw error;
  }
};

// Create new vessel
export const createVessel = async (vesselData) => {
  try {
    const response = await axios.post(API_URL, vesselData, getAuthHeader());
    return response.data.data;
  } catch (error) {
    console.error('Error creating vessel:', error.response || error);
    throw error;
  }
};

// Update vessel
export const updateVessel = async (id, vesselData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, vesselData, getAuthHeader());
    return response.data.data;
  } catch (error) {
    console.error(`Error updating vessel with ID ${id}:`, error.response || error);
    throw error;
  }
};

// Delete vessel
export const deleteVessel = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error(`Error deleting vessel with ID ${id}:`, error.response || error);
    throw error;
  }
};

// Add employee to vessel
export const addEmployeeToVessel = async (vesselId, employeeId) => {
  try {
    const response = await axios.post(
      `${API_URL}/${vesselId}/employees`,
      { employeeId },
      getAuthHeader()
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error adding employee to vessel:`, error.response || error);
    throw error;
  }
};

// Remove employee from vessel
export const removeEmployeeFromVessel = async (vesselId, employeeId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${vesselId}/employees/${employeeId}`,
      getAuthHeader()
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error removing employee from vessel:`, error.response || error);
    throw error;
  }
}; 