import axios from 'axios';
import config from '../config';

const API_URL = `${config.API_BASE_URL}/reports`;

// Get report summary
export const getReportSummary = async (startDate, endDate) => {
  try {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
    
    const response = await axios.get(`${API_URL}/summary`, { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching report summary:', error);
    throw error;
  }
};

// Generate employee report
export const generateEmployeeReport = async (startDate, endDate, format = 'pdf') => {
  try {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      format
    };
    
    const response = await axios.get(`${API_URL}/employees`, { 
      params,
      responseType: 'blob'
    });
    
    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `employee_report_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error('Error generating employee report:', error);
    throw error;
  }
};

// Generate payroll report
export const generatePayrollReport = async (startDate, endDate, format = 'pdf') => {
  try {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      format
    };
    
    const response = await axios.get(`${API_URL}/payroll`, { 
      params,
      responseType: 'blob'
    });
    
    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payroll_report_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error('Error generating payroll report:', error);
    throw error;
  }
};

// Generate attendance report
export const generateAttendanceReport = async (startDate, endDate, format = 'pdf') => {
  try {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      format
    };
    
    const response = await axios.get(`${API_URL}/attendance`, { 
      params,
      responseType: 'blob'
    });
    
    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendance_report_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error('Error generating attendance report:', error);
    throw error;
  }
};

// Generate vessel report
export const generateVesselReport = async (startDate, endDate, format = 'pdf') => {
  try {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      format
    };
    
    const response = await axios.get(`${API_URL}/vessels`, { 
      params,
      responseType: 'blob'
    });
    
    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vessel_report_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error('Error generating vessel report:', error);
    throw error;
  }
};

// Export reports
export const exportReports = async (startDate, endDate, format = 'csv') => {
  try {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      format
    };
    
    const response = await axios.get(`${API_URL}/export`, { 
      params,
      responseType: 'blob'
    });
    
    // Create a download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reports_export_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error('Error exporting reports:', error);
    throw error;
  }
};

// Import reports
export const importReports = async (file) => {
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
    console.error('Error importing reports:', error);
    throw error;
  }
}; 