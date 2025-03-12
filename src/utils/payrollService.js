import axios from 'axios';
import { getAuthHeader } from './authService';
import config from '../config';

const API_URL = `${config.API_BASE_URL}/payroll`;

// Get all payrolls
export const getPayrolls = async (filters = {}) => {
  try {
    const { vesselId, startDate, endDate } = filters;
    let url = API_URL;
    
    // Add query parameters if provided
    const params = new URLSearchParams();
    if (vesselId) params.append('vesselId', vesselId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await axios.get(url, getAuthHeader());
    return response.data.data;
  } catch (error) {
    console.error('Error fetching payrolls:', error.response || error);
    throw error;
  }
};

// Get payrolls by vessel
export const getPayrollsByVessel = async (vesselId, filters = {}) => {
  try {
    const { startDate, endDate } = filters;
    let url = `${API_URL}/vessel/${vesselId}`;
    
    // Add query parameters if provided
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await axios.get(url, getAuthHeader());
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching payrolls for vessel ${vesselId}:`, error.response || error);
    throw error;
  }
};

// Create payroll
export const createPayroll = async (payrollData) => {
  try {
    const response = await axios.post(API_URL, payrollData, getAuthHeader());
    return response.data.data;
  } catch (error) {
    console.error('Error creating payroll:', error.response || error);
    throw error;
  }
};

// Create multiple payrolls (bulk import)
export const createBulkPayrolls = async (payrolls) => {
  try {
    const response = await axios.post(`${API_URL}/bulk`, { payrolls }, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating bulk payrolls:', error.response || error);
    throw error;
  }
};

// Update payroll
export const updatePayroll = async (id, payrollData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, payrollData, getAuthHeader());
    return response.data.data;
  } catch (error) {
    console.error(`Error updating payroll with ID ${id}:`, error.response || error);
    throw error;
  }
};

// Delete payroll
export const deletePayroll = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error(`Error deleting payroll with ID ${id}:`, error.response || error);
    throw error;
  }
};

// Generate payroll voucher
export const generateVoucher = async (payrollIds) => {
  try {
    const response = await axios.post(`${API_URL}/voucher`, { payrollIds }, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error generating voucher:', error.response || error);
    throw error;
  }
};

// Import payroll data from Excel
export const importPayrollFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_URL}/bulk`, formData, {
      ...getAuthHeader(),
      headers: {
        ...getAuthHeader().headers,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error importing payroll data:', error.response || error);
    throw error;
  }
};

// Export payroll data
export const exportPayroll = async (vessel = '', format = 'csv') => {
  try {
    const params = { format };
    
    if (vessel) {
      params.vessel = vessel;
    }
    
    const response = await axios.get(`${API_URL}/export`, { 
      params,
      responseType: 'blob'
    });
    
    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payroll_export.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error('Error exporting payroll data:', error);
    throw error;
  }
};

// Import payroll data
export const importPayroll = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_URL}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error importing payroll data:', error);
    throw error;
  }
}; 