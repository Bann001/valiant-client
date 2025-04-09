import { useState, useEffect } from 'react';
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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedVessel, setSelectedVessel] = useState('all');
  const [editRecord, setEditRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const vessels = ['Vessel 1', 'Vessel 2', 'Vessel 3']; // Replace with actual vessel data

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const data = await getAttendanceByDateRange(startDate, endDate, selectedVessel);
      setAttendanceData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setError('Failed to load attendance data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [startDate, endDate, selectedVessel]);

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
      await updateAttendance(updatedRecord.employeeId, startDate, updatedRecord);
      
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
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
          </LocalizationProvider>
        </Box>
        
        {loading ? (
          <Loading message="Loading attendance data..." />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <AttendanceTable 
            attendanceData={attendanceData} 
            dateRange={`${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`}
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