import { useState, useEffect, useCallback } from 'react';
import { Box, Alert, Snackbar, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Layout from '../../components/layout/Layout';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import AttendanceEditDialog from '../../components/attendance/AttendanceEditDialog';
import Loading from '../../components/layout/Loading';
import { getAttendanceByDateRange, updateAttendance } from '../../utils/attendanceService';
import { format } from 'date-fns';
import './AttendancePage.css';

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVessel, setSelectedVessel] = useState('all');
  const [editRecord, setEditRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const vessels = ['Vessel 1', 'Vessel 2', 'Vessel 3']; // Replace with actual vessel data
  const employeeStatuses = ['all', 'Active', 'On Leave', 'Terminated'];

  const fetchAttendanceData = useCallback(async () => {
    try {
      setLoading(true);
      if (!selectedDate) {
        setError('Please select a date');
        return;
      }
      
      const params = {
        date: new Date(selectedDate).toISOString(),
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        vessel: selectedVessel === 'all' ? undefined : selectedVessel
      };
      
      const data = await getAttendanceByDateRange(params.date, params.date, params.vessel, params.status);
      setAttendanceData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setError('Failed to load attendance data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedStatus, selectedVessel]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleVesselChange = (vessel) => {
    setSelectedVessel(vessel);
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditRecord(null);
  };

  const handleSaveAttendance = async (updatedRecord) => {
    try {
      await updateAttendance(updatedRecord.employeeId, selectedDate, updatedRecord);
      
      const updatedData = attendanceData.map(record => 
        record.employeeId === updatedRecord.employeeId ? updatedRecord : record
      );
      
      setAttendanceData(updatedData);
      setDialogOpen(false);
      
      setNotification({
        open: true,
        message: 'Attendance record updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating attendance record:', error);
      setNotification({
        open: true,
        message: 'Failed to update attendance record',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Layout title="Attendance">
      <Box className="attendance-page">
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newValue) => {
                setSelectedDate(newValue || new Date());
              }}
              slotProps={{ textField: { size: "small" } }}
            />
          </LocalizationProvider>
          
          <TextField
            select
            label="Employee Status"
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            {employeeStatuses.map((status) => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status}
              </option>
            ))}
          </TextField>

          <TextField
            select
            label="Vessel"
            value={selectedVessel}
            onChange={(e) => handleVesselChange(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <option value="all">All Vessels</option>
            {vessels.map((vessel) => (
              <option key={vessel} value={vessel}>
                {vessel}
              </option>
            ))}
          </TextField>
        </Box>
        
        {loading ? (
          <Loading message="Loading attendance data..." />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <AttendanceTable 
            attendanceData={attendanceData} 
            dateRange={format(selectedDate, 'dd/MM/yyyy')}
            onEdit={handleEdit}
            vessels={vessels}
            selectedVessel={selectedVessel}
            onVesselChange={handleVesselChange}
          />
        )}
        
        <AttendanceEditDialog 
          open={dialogOpen}
          onClose={handleCloseDialog}
          record={editRecord}
          onSave={handleSaveAttendance}
        />
        
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default AttendancePage; 