import { Link, useLocation } from 'react-router-dom';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography,
  IconButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as EmployeesIcon,
  EventNote as AttendanceIcon,
  AttachMoney as PayrollIcon,
  Description as ReportsIcon,
  DirectionsBoat as VesselsIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import './Sidebar.css';

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();
  
  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/dashboard' 
    },
    { 
      text: 'Employees', 
      icon: <EmployeesIcon />, 
      path: '/employees' 
    },
    { 
      text: 'Attendance', 
      icon: <AttendanceIcon />, 
      path: '/attendance' 
    },
    { 
      text: 'Payroll', 
      icon: <PayrollIcon />, 
      path: '/payroll' 
    },
    { 
      text: 'Reports', 
      icon: <ReportsIcon />, 
      path: '/reports' 
    },
    { 
      text: 'Vessels', 
      icon: <VesselsIcon />, 
      path: '/vessels' 
    }
  ];

  return (
    <Box 
      className={`sidebar ${collapsed ? 'collapsed' : ''}`}
      sx={{ 
        bgcolor: '#4361ee',
        color: 'white',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        width: collapsed ? '60px' : '240px',
        transition: 'width 0.3s ease',
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)'
      }}
    >
      <Box 
        className="sidebar-header"
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {!collapsed && (
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              color: 'white',
              fontSize: '1rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            Valiant Allied Services
          </Typography>
        )}
        <IconButton 
          onClick={toggleSidebar} 
          sx={{ 
            color: 'white',
            display: { xs: 'none', sm: 'flex' }
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <List sx={{ width: '100%', pt: 2, overflowY: 'auto' }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            component={Link} 
            to={item.path} 
            key={item.text}
            className={location.pathname === item.path ? 'active' : ''}
            sx={{ 
              pl: collapsed ? 2 : 3,
              pr: 2,
              py: 1.5,
              mb: 0.5,
              color: 'white',
              '&.active': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                borderRight: '4px solid white'
              },
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: collapsed ? 'auto' : 40 }}>
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  sx: { 
                    color: 'white',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                  } 
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar; 