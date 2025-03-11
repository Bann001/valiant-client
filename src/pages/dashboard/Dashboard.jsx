import { useState, useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import {
  People as PeopleIcon,
  AttachMoney as PayrollIcon,
  EventNote as AttendanceIcon,
  Work as PositionsIcon
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import DashboardCard from '../../components/dashboard/DashboardCard';
import Loading from '../../components/layout/Loading';
import { getDashboardStats } from '../../utils/dashboardService';
import './Dashboard.css';

// Uncomment when connecting to the backend API
// import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    payroll: 'Up to date',
    attendance: '95%',
    positions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Dashboard">
      <Box className="dashboard-container">
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Dashboard Overview
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {loading ? (
          <Loading message="Loading dashboard data..." />
        ) : (
          <Grid container spacing={3}>
            {/* Employees Card */}
            <Grid item xs={12} sm={6} md={4}>
              <DashboardCard
                title="Employees"
                value={stats.employees}
                icon={<PeopleIcon fontSize="inherit" />}
                color="#4361ee"
              />
            </Grid>

            {/* Payroll Status Card */}
            <Grid item xs={12} sm={6} md={4}>
              <DashboardCard
                title="Payroll Status"
                value={stats.payroll}
                icon={<PayrollIcon fontSize="inherit" />}
                color="#2ec4b6"
              />
            </Grid>

            {/* Attendance Stats Card */}
            <Grid item xs={12} sm={6} md={4}>
              <DashboardCard
                title="Attendance Stats"
                value={stats.attendance}
                icon={<AttendanceIcon fontSize="inherit" />}
                color="#ff9f1c"
              />
            </Grid>

            {/* Positions Card */}
            <Grid item xs={12} sm={6} md={4}>
              <DashboardCard
                title="Positions"
                value={stats.positions}
                icon={<PositionsIcon fontSize="inherit" />}
                color="#e71d36"
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default Dashboard; 