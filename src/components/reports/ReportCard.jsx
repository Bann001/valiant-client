import { Box, Typography, Paper } from '@mui/material';
import { 
  People as EmployeesIcon,
  AttachMoney as PayrollIcon,
  EventNote as AttendanceIcon,
  DirectionsBoat as VesselsIcon
} from '@mui/icons-material';
import './ReportCard.css';

const getIcon = (type) => {
  switch (type) {
    case 'employees':
      return <EmployeesIcon fontSize="large" />;
    case 'payroll':
      return <PayrollIcon fontSize="large" />;
    case 'attendance':
      return <AttendanceIcon fontSize="large" />;
    case 'vessels':
      return <VesselsIcon fontSize="large" />;
    default:
      return <EmployeesIcon fontSize="large" />;
  }
};

const ReportCard = ({ type, title, onClick }) => {
  return (
    <Paper 
      elevation={0}
      className="report-card"
      onClick={onClick}
      sx={{ 
        p: 3, 
        borderRadius: 2,
        bgcolor: 'rgba(67, 97, 238, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box 
          sx={{ 
            color: '#4361ee',
            mb: 2
          }}
        >
          {getIcon(type)}
        </Box>
        <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
          {title}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ReportCard; 