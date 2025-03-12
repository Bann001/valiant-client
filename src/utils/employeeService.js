import axios from 'axios';
import config from '../config';

const API_URL = `${config.API_BASE_URL}/employees`;

// Get all employees
export const getEmployees = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// Get employee by ID
export const getEmployeeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching employee with ID ${id}:`, error);
    throw error;
  }
};

// Create new employee
export const createEmployee = async (employeeData) => {
  try {
    let data;
    let headers;

    if (employeeData.profileImage instanceof File) {
      // If there's a profile image, use FormData
      data = new FormData();
      Object.keys(employeeData).forEach(key => {
        if (key === 'profileImage') {
          data.append('profileImage', employeeData.profileImage);
        } else if (typeof employeeData[key] === 'object' && employeeData[key] !== null) {
          data.append(key, JSON.stringify(employeeData[key]));
        } else {
          data.append(key, employeeData[key]);
        }
      });
      headers = {
        'Content-Type': 'multipart/form-data'
      };
    } else {
      // If no profile image, send as JSON
      data = employeeData;
      headers = {
        'Content-Type': 'application/json'
      };
    }

    const response = await axios.post(API_URL, data, { headers });
    return response.data.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

// Update employee
export const updateEmployee = async (id, employeeData) => {
  try {
    let data;
    let headers;

    if (employeeData.profileImage instanceof File) {
      // If there's a profile image, use FormData
      data = new FormData();
      Object.keys(employeeData).forEach(key => {
        if (key === 'profileImage') {
          data.append('profileImage', employeeData.profileImage);
        } else if (typeof employeeData[key] === 'object' && employeeData[key] !== null) {
          data.append(key, JSON.stringify(employeeData[key]));
        } else {
          data.append(key, employeeData[key]);
        }
      });
      headers = {
        'Content-Type': 'multipart/form-data'
      };
    } else {
      // If no profile image, send as JSON
      data = employeeData;
      headers = {
        'Content-Type': 'application/json'
      };
    }

    const response = await axios.put(`${API_URL}/${id}`, data, { headers });
    return response.data.data;
  } catch (error) {
    console.error(`Error updating employee with ID ${id}:`, error);
    throw error;
  }
};

// Delete employee
export const deleteEmployee = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting employee with ID ${id}:`, error);
    throw error;
  }
}; 