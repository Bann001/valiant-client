import { useState, useEffect } from 'react';
import { Box, Alert, Snackbar, Grid, Typography, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import DateRangeSelector from '../../components/reports/DateRangeSelector';
import ReportCard from '../../components/reports/ReportCard';
import Loading from '../../components/layout/Loading';
// Import services when needed
// import { 
//   getReportSummary, 
//   generateEmployeeReport, 
//   generatePayrollReport, 
//   generateAttendanceReport, 
//   generateVesselReport,
//   exportReports,
//   importReports
// } from '../../utils/reportService';
import './ReportsPage.css';

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [reportTypes] = useState([
    { id: 'employees', title: 'Employees Report', type: 'employees' },
    { id: 'payroll', title: 'Payroll Report', type: 'payroll' },
    { id: 'attendance', title: 'Attendance Report', type: 'attendance' },
    { id: 'vessels', title: 'Vessels Report', type: 'vessels' }
  ]);

  useEffect(() => {
    fetchReportSummary();
  }, [startDate, endDate]);

  const fetchReportSummary = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, we'll use mock data
      // In a production environment, uncomment the following line
      // const data = await getReportSummary(startDate, endDate);
      
      // Mock data
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching report summary:', error);
      setError('Failed to fetch report summary. Please try again later.');
      setLoading(false);
    }
  };

  const handleDateRangeChange = (formattedRange, start, end) => {
    setDateRange(formattedRange);
    setStartDate(start);
    setEndDate(end);
  };

  const handleExport = async () => {
    try {
      // In a production environment, uncomment the following line
      // await exportReports(startDate, endDate);
      
      console.log('Exporting reports for date range:', dateRange);
      
      setNotification({
        open: true,
        message: 'Reports exported successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error exporting reports:', error);
      setNotification({
        open: true,
        message: 'Failed to export reports',
        severity: 'error'
      });
    }
  };

  const handleImport = async () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.xlsx';
    
    fileInput.onchange = async (e) => {
      if (e.target.files && e.target.files[0]) {
        try {
          const file = e.target.files[0];
          
          // In a production environment, uncomment the following line
          // await importReports(file);
          
          console.log('Importing reports from file:', file.name);
          
          setNotification({
            open: true,
            message: 'Reports imported successfully',
            severity: 'success'
          });
        } catch (error) {
          console.error('Error importing reports:', error);
          setNotification({
            open: true,
            message: 'Failed to import reports',
            severity: 'error'
          });
        }
      }
    };
    
    fileInput.click();
  };

  const handleGenerateReport = async (reportType) => {
    try {
      switch (reportType) {
        case 'employees':
          // In a production environment, uncomment the following line
          // await generateEmployeeReport(startDate, endDate);
          console.log('Generating employee report for date range:', dateRange);
          break;
        case 'payroll':
          // In a production environment, uncomment the following line
          // await generatePayrollReport(startDate, endDate);
          console.log('Generating payroll report for date range:', dateRange);
          break;
        case 'attendance':
          // In a production environment, uncomment the following line
          // await generateAttendanceReport(startDate, endDate);
          console.log('Generating attendance report for date range:', dateRange);
          break;
        case 'vessels':
          // In a production environment, uncomment the following line
          // await generateVesselReport(startDate, endDate);
          console.log('Generating vessel report for date range:', dateRange);
          break;
        default:
          return;
      }
      
      setNotification({
        open: true,
        message: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully`,
        severity: 'success'
      });
    } catch (error) {
      console.error(`Error generating ${reportType} report:`, error);
      setNotification({
        open: true,
        message: `Failed to generate ${reportType} report`,
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const filteredReportTypes = reportTypes.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Reports">
      <Box className="reports-page">
        <DateRangeSelector 
          onDateRangeChange={handleDateRangeChange}
          onExport={handleExport}
          onImport={handleImport}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Reports Summary
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Search here"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 250 }}
            />
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                padding: '0 10px',
                cursor: 'pointer'
              }}
            >
              <FilterIcon sx={{ color: '#4361ee' }} />
              <Typography variant="body2">Filter</Typography>
            </Box>
          </Box>
        </Box>
        
        {loading ? (
          <Loading message="Loading reports..." />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredReportTypes.map((report) => (
              <Grid item xs={12} sm={6} md={4} key={report.id}>
                <ReportCard 
                  type={report.type}
                  title={report.title}
                  onClick={() => handleGenerateReport(report.type)}
                />
              </Grid>
            ))}
          </Grid>
        )}
        
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

export default ReportsPage; 