import { useState, useEffect } from 'react';
import { Box, Alert, Snackbar } from '@mui/material';
import Layout from '../../components/layout/Layout';
import DateRangeSelector from '../../components/attendance/DateRangeSelector';
import AttendanceTable from '../../components/attendance/AttendanceTable';
import AttendanceEditDialog from '../../components/attendance/AttendanceEditDialog';
import Loading from '../../components/layout/Loading';
// Import services when needed
// import { 
//   getAttendanceByDateRange, 
//   updateAttendance, 
//   saveBulkAttendance, 
//   exportAttendance 
// } from '../../utils/attendanceService';
// import { format } from 'date-fns';
import './AttendancePage.css';

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [vessel, setVessel] = useState('');
  const [editRecord, setEditRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchAttendanceData();
  }, [startDate, endDate, vessel]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, we'll use mock data
      // In a production environment, uncomment the following line
      // const data = await getAttendanceByDateRange(startDate, endDate, vessel);
      
      // Mock data
      const mockData = [
        {
          employeeId: '000100',
          employeeName: 'Emilia De Rothschild',
          position: 'Admin',
          day: true,
          night: false,
          otDay: false,
          otNight: false,
          np: false
        },
        {
          employeeId: '000200',
          employeeName: 'Aisha Garcia',
          position: 'Fighter',
          day: true,
          night: true,
          otDay: false,
          otNight: false,
          np: false
        },
        {
          employeeId: '000300',
          employeeName: 'Akio Morishimoto',
          position: 'Support',
          day: true,
          night: true,
          otDay: true,
          otNight: true,
          np: false
        }
      ];
      
      setTimeout(() => {
        setAttendanceData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError('Failed to fetch attendance data. Please try again later.');
      setLoading(false);
    }
  };

  const handleDateRangeChange = (formattedRange, start, end) => {
    setDateRange(formattedRange);
    setStartDate(start);
    setEndDate(end);
  };

  const handleVesselChange = (selectedVessel) => {
    setVessel(selectedVessel);
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
      // In a production environment, uncomment the following line
      // await updateAttendance(updatedRecord.employeeId, startDate, updatedRecord);
      
      // For demo purposes, we'll just update the state
      const updatedData = attendanceData.map(record => 
        record.employeeId === updatedRecord.employeeId ? updatedRecord : record
      );
      
      setAttendanceData(updatedData);
      
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
        <DateRangeSelector 
          onDateRangeChange={handleDateRangeChange} 
          onVesselChange={handleVesselChange}
        />
        
        {loading ? (
          <Loading message="Loading attendance data..." />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <AttendanceTable 
            attendanceData={attendanceData} 
            dateRange={dateRange}
            onEdit={handleEdit}
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