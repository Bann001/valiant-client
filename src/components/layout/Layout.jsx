import { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ children, title }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Box className="layout-container">
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <Box 
        className="layout-content"
        sx={{ 
          marginLeft: { xs: 0, sm: sidebarCollapsed ? '60px' : '240px' },
          transition: 'margin-left 0.3s ease',
          width: { xs: '100%', sm: `calc(100% - ${sidebarCollapsed ? '60px' : '240px'})` }
        }}
      >
        <Header title={title} toggleSidebar={toggleSidebar} />
        <Box 
          component="main" 
          className="main-content"
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mt: 8,
            minHeight: 'calc(100vh - 64px)'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 