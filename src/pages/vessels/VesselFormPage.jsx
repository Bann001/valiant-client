import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Alert, Snackbar } from '@mui/material';
import Layout from '../../components/layout/Layout';
import VesselForm from '../../components/vessels/VesselForm';
import Loading from '../../components/layout/Loading';
// Import services when needed
// import { getVesselById, createVessel, updateVessel } from '../../utils/vesselService';
import './VesselFormPage.css';

const VesselFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vessel, setVessel] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (id) {
      fetchVessel(id);
    }
  }, [id]);

  const fetchVessel = async (vesselId) => {
    try {
      setLoading(true);
      
      // For demo purposes, we'll use mock data
      // In a production environment, uncomment the following line
      // const data = await getVesselById(vesselId);
      
      // Mock data
      const mockVessel = {
        vesselId: vesselId,
        vesselName: 'Valiant',
        imo: '123',
        deliveryDate: '2022-06-18',
        registrationDate: '2022-06-19',
        employees: [
          { id: '1', name: 'Emilia De Rothschild', position: 'Admin' },
          { id: '2', name: 'Aisha Garcia', position: 'Fighter' }
        ]
      };
      
      setTimeout(() => {
        setVessel(mockVessel);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching vessel details:', error);
      setError('Failed to fetch vessel details. Please try again later.');
      setLoading(false);
    }
  };

  const handleSubmit = async (formData, addAnother = false) => {
    try {
      setLoading(true);
      
      if (id) {
        // Update existing vessel
        // In a production environment, uncomment the following line
        // await updateVessel(id, formData);
        console.log('Updating vessel:', id, formData);
        
        setNotification({
          open: true,
          message: 'Vessel updated successfully',
          severity: 'success'
        });
      } else {
        // Create new vessel
        // In a production environment, uncomment the following line
        // await createVessel(formData);
        console.log('Creating vessel:', formData);
        
        setNotification({
          open: true,
          message: 'Vessel created successfully',
          severity: 'success'
        });
      }
      
      // Simulate API call delay
      setTimeout(() => {
        setLoading(false);
        
        if (addAnother) {
          // Reset form for adding another vessel
          setVessel(null);
        } else {
          // Redirect to vessel list after successful submission
          navigate('/vessels');
        }
      }, 1000);
    } catch (error) {
      console.error('Error saving vessel:', error);
      setNotification({
        open: true,
        message: `Failed to ${id ? 'update' : 'create'} vessel`,
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/vessels');
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Layout title={id ? 'Edit Vessel' : 'Add Vessel'}>
      <Box className="vessel-form-page">
        {loading && id ? (
          <Loading message="Loading vessel details..." />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <VesselForm 
            vessel={vessel} 
            onSubmit={handleSubmit} 
            onCancel={handleCancel} 
          />
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

export default VesselFormPage; 