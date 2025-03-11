/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FileUpload as ImportIcon,
  FileDownload as ExportIcon,
  Receipt as VoucherIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// Import XLSX dynamically to avoid build errors
const XLSX = import('xlsx').then(module => module.default);

import Layout from '../../components/layout/Layout';
import Loading from '../../components/layout/Loading';
import { getVessels } from '../../utils/vesselService';
import { 
  getPayrolls, 
  getPayrollsByVessel, 
  createBulkPayrolls, 
  generateVoucher 
} from '../../utils/payrollService';

const PayrollPage = () => {
  const [vessels, setVessels] = useState([]);
  const [selectedVessel, setSelectedVessel] = useState('');
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch vessels on component mount
  useEffect(() => {
    const fetchVessels = async () => {
      try {
        const data = await getVessels();
        setVessels(data);
      } catch (err) {
        console.error('Error fetching vessels:', err);
        setError('Failed to fetch vessels');
      }
    };

    fetchVessels();
  }, []);

  // Fetch payrolls when vessel selection changes
  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data;
        if (selectedVessel) {
          data = await getPayrollsByVessel(selectedVessel, {
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString()
          });
        } else {
          data = await getPayrolls({
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString()
          });
        }
        
        setPayrolls(data);
      } catch (err) {
        console.error('Error fetching payroll data:', err);
        setError('Failed to fetch payroll data');
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, [selectedVessel, startDate, endDate]);

  const handleVesselChange = (event) => {
    setSelectedVessel(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleImportClick = () => {
    setImportDialogOpen(true);
  };

  const handleFileChange = (event) => {
    setImportFile(event.target.files[0]);
  };

  const handleImportSubmit = async () => {
    if (!importFile) {
      setNotification({
        open: true,
        message: 'Please select a file to import',
        severity: 'error'
      });
      return;
    }

    setImportLoading(true);
    
    try {
      // Read the Excel file
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const xlsxModule = await XLSX;
          const workbook = xlsxModule.read(data, { type: 'array' });
          
          // Get the first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          
          // Convert to JSON
          const jsonData = xlsxModule.utils.sheet_to_json(worksheet);
          
          // Process the data
          const payrollData = jsonData.map(row => ({
            employeeId: row.EmployeeID || row.employeeId,
            vesselId: row.VesselID || row.vesselId,
            payPeriod: {
              startDate: new Date(row.StartDate || row.startDate),
              endDate: new Date(row.EndDate || row.endDate)
            },
            regularHours: Number(row.RegularHours || row.regularHours || 0),
            overtimeHours: Number(row.OvertimeHours || row.overtimeHours || 0),
            nightDifferentialHours: Number(row.NightDifferentialHours || row.nightDifferentialHours || 0),
            sundayHours: Number(row.SundayHours || row.sundayHours || 0),
            sundayOvertimeHours: Number(row.SundayOvertimeHours || row.sundayOvertimeHours || 0),
            rate: Number(row.Rate || row.rate || 0)
          }));
          
          // Send to server
          const result = await createBulkPayrolls(payrollData);
          
          setNotification({
            open: true,
            message: `Successfully imported ${result.count} payroll records`,
            severity: 'success'
          });
          
          // Refresh payroll data
          if (selectedVessel) {
            const data = await getPayrollsByVessel(selectedVessel);
            setPayrolls(data);
          } else {
            const data = await getPayrolls();
            setPayrolls(data);
          }
        } catch (error) {
          console.error('Error processing Excel file:', error);
          setNotification({
            open: true,
            message: 'Error processing Excel file',
            severity: 'error'
          });
        } finally {
          setImportLoading(false);
          setImportDialogOpen(false);
          setImportFile(null);
        }
      };
      
      reader.readAsArrayBuffer(importFile);
    } catch (error) {
      console.error('Error importing payroll data:', error);
      setNotification({
        open: true,
        message: 'Error importing payroll data',
        severity: 'error'
      });
      setImportLoading(false);
      setImportDialogOpen(false);
    }
  };

  const handleGenerateVoucher = async () => {
    try {
      // Get selected payroll IDs
      const selectedPayrollIds = payrolls
        .filter(payroll => payroll._id)
        .map(payroll => payroll._id);
      
      if (selectedPayrollIds.length === 0) {
        setNotification({
          open: true,
          message: 'No payrolls selected',
          severity: 'error'
        });
        return;
      }
      
      await generateVoucher(selectedPayrollIds);
      
      setNotification({
        open: true,
        message: 'Voucher generated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating voucher:', error);
      setNotification({
        open: true,
        message: 'Error generating voucher',
        severity: 'error'
      });
    }
  };

  const handleExport = async () => {
    try {
      const xlsxModule = await XLSX;
      
      // Convert payrolls to Excel format
      const worksheet = xlsxModule.utils.json_to_sheet(
        payrolls.map(payroll => ({
          'Employee ID': payroll.employee?.employeeId || '',
          'Employee Name': payroll.employee ? `${payroll.employee.firstName} ${payroll.employee.lastName}` : '',
          'Position': payroll.employee?.position || '',
          'Vessel': payroll.vessel?.vesselName || '',
          'Rate': payroll.rate || 0,
          'Regular Hours': payroll.regularHours || 0,
          'Overtime Hours': payroll.overtimeHours || 0,
          'Night Differential Hours': payroll.nightDifferentialHours || 0,
          'Sunday Hours': payroll.sundayHours || 0,
          'Sunday Overtime Hours': payroll.sundayOvertimeHours || 0,
          'Gross Pay': payroll.grossPay || 0,
          'Net Pay': payroll.netPay || 0
        }))
      );
      
      // Create workbook and add worksheet
      const workbook = xlsxModule.utils.book_new();
      xlsxModule.utils.book_append_sheet(workbook, worksheet, 'Payroll');
      
      // Generate Excel file
      xlsxModule.writeFile(workbook, 'payroll_export.xlsx');
      
      setNotification({
        open: true,
        message: 'Payroll data exported successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error exporting payroll data:', error);
      setNotification({
        open: true,
        message: 'Error exporting payroll data',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Filter payrolls based on search term
  const filteredPayrolls = payrolls.filter(payroll => {
    const employeeName = payroll.employee ? 
      `${payroll.employee.firstName} ${payroll.employee.lastName}`.toLowerCase() : '';
    const employeeId = payroll.employee?.employeeId?.toLowerCase() || '';
    const position = payroll.employee?.position?.toLowerCase() || '';
    
    return (
      employeeName.includes(searchTerm.toLowerCase()) ||
      employeeId.includes(searchTerm.toLowerCase()) ||
      position.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Layout title="Payroll">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Manage Payroll
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<ImportIcon />}
              onClick={handleImportClick}
            >
              Import
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<VoucherIcon />}
              onClick={handleGenerateVoucher}
            >
              Generate Voucher
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="vessel-select-label">Vessel</InputLabel>
            <Select
              labelId="vessel-select-label"
              id="vessel-select"
              value={selectedVessel}
              label="Vessel"
              onChange={handleVesselChange}
            >
              <MenuItem value="">All Vessels</MenuItem>
              {vessels.map((vessel) => (
                <MenuItem key={vessel._id} value={vessel._id}>
                  {vessel.vesselName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>

          <TextField
            placeholder="Search employees..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
          >
            Filter
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Loading message="Loading payroll data..." />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Rate</TableCell>
                  <TableCell>FR 100%</TableCell>
                  <TableCell>OT 125%</TableCell>
                  <TableCell>ND 10%</TableCell>
                  <TableCell>SUN 130%</TableCell>
                  <TableCell>SUN OT 130%</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayrolls.map((payroll, index) => (
                  <TableRow key={payroll._id || index}>
                    <TableCell>{payroll.employee?.employeeId || ''}</TableCell>
                    <TableCell>
                      {payroll.employee ? `${payroll.employee.firstName} ${payroll.employee.lastName}` : ''}
                    </TableCell>
                    <TableCell>{payroll.employee?.position || ''}</TableCell>
                    <TableCell>₱{payroll.rate?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{payroll.regularHours || 0}</TableCell>
                    <TableCell>{payroll.overtimeHours || 0}</TableCell>
                    <TableCell>{payroll.nightDifferentialHours || 0}</TableCell>
                    <TableCell>{payroll.sundayHours || 0}</TableCell>
                    <TableCell>{payroll.sundayOvertimeHours || 0}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPayrolls.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No payroll data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Import Dialog */}
        <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)}>
          <DialogTitle>Import Payroll Data</DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" gutterBottom>
                Upload an Excel file with payroll data. The file should have the following columns:
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>EmployeeID</li>
                <li>VesselID</li>
                <li>StartDate</li>
                <li>EndDate</li>
                <li>RegularHours</li>
                <li>OvertimeHours</li>
                <li>NightDifferentialHours</li>
                <li>SundayHours</li>
                <li>SundayOvertimeHours</li>
                <li>Rate</li>
              </Typography>
              <Box sx={{ mt: 2 }}>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="import-file-input"
                />
                <label htmlFor="import-file-input">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<ImportIcon />}
                  >
                    Select File
                  </Button>
                </label>
                {importFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected file: {importFile.name}
                  </Typography>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleImportSubmit}
              variant="contained"
              color="primary"
              disabled={!importFile || importLoading}
              startIcon={importLoading ? <CircularProgress size={20} /> : null}
            >
              {importLoading ? 'Importing...' : 'Import'}
            </Button>
          </DialogActions>
        </Dialog>

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

export default PayrollPage; 