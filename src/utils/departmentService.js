import axios from 'axios';

const API_URL = 'http://localhost:5000/api/departments';

// Get all departments
export const getDepartments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

// Get department by ID
export const getDepartmentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching department with ID ${id}:`, error);
    throw error;
  }
};

// Create new department
export const createDepartment = async (departmentData) => {
  try {
    const response = await axios.post(API_URL, departmentData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

// Update department
export const updateDepartment = async (id, departmentData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, departmentData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating department with ID ${id}:`, error);
    throw error;
  }
};

// Delete department
export const deleteDepartment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting department with ID ${id}:`, error);
    throw error;
  }
}; 