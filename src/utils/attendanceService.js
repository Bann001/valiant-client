import axios from 'axios';

const API_URL = 'http://localhost:5000/api/attendance';

// Get attendance records by date range and vessel
export const getAttendanceByDateRange = async (startDate, endDate, vessel = '') => {
  try {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
    
    if (vessel) {
      params.vessel = vessel;
    }
    
    const response = await axios.get(API_URL, { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    throw error;
  }
};

// Update attendance record
export const updateAttendance = async (employeeId, date, attendanceData) => {
  try {
    const response = await axios.put(`${API_URL}/${employeeId}`, {
      date,
      ...attendanceData
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating attendance record:', error);
    throw error;
  }
};

// Save bulk attendance records
export const saveBulkAttendance = async (attendanceRecords) => {
  try {
    const response = await axios.post(`${API_URL}/bulk`, {
      records: attendanceRecords
    });
    return response.data;
  } catch (error) {
    console.error('Error saving attendance records:', error);
    throw error;
  }
};

// Export attendance records
export const exportAttendance = async (startDate, endDate, vessel = '', format = 'csv') => {
  try {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      format
    };
    
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
    link.setAttribute('download', `attendance_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error('Error exporting attendance records:', error);
    throw error;
  }
}; 