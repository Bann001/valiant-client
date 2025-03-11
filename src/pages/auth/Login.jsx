import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Grid, 
  Checkbox, 
  FormControlLabel, 
  InputAdornment, 
  IconButton 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../utils/useAuth';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box className="login-container">
      <Grid container sx={{ height: '100vh' }}>
        {/* Left Side - Blue Background with Logo */}
        <Grid item xs={12} md={5} className="login-sidebar">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: 4,
              color: 'white'
            }}
          >
            <Box sx={{ mb: 4 }}>
              <img 
                src="/ship-logo.png" 
                alt="Valiant Logo" 
                style={{ width: '120px', height: 'auto' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/120?text=Ship+Logo';
                }}
              />
            </Box>
            <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Valiant Allied Services Inc.
            </Typography>
          </Box>
        </Grid>

        {/* Right Side - Login Form */}
        <Grid item xs={12} md={7} className="login-form-container">
          <Container maxWidth="sm" sx={{ py: 8, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Log In
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Username
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your username or email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span className="input-icon">👤</span>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Password
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span className="input-icon">🔒</span>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      value="remember" 
                      color="primary" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
                  label="Keep me logged in"
                />
                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                  Forgot Password?
                </Typography>
              </Box>

              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 2, 
                  mb: 2, 
                  py: 1.5,
                  backgroundColor: '#4361ee',
                  '&:hover': {
                    backgroundColor: '#3a56d4'
                  }
                }}
              >
                LOGIN
              </Button>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login; 