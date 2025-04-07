import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, error } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    keepLoggedIn: false
  });
  const [loginError, setLoginError] = useState(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    
    const success = await login(formData.email, formData.password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setLoginError(error || 'Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="company-info">
          <div className="company-logo">
            <img src="src/assets/valiant.png" alt="Valiant Allied Services Inc." />
          </div>
          <h1>Valiant Allied Services Inc.</h1>
        </div>
      </div>
      <div className="login-right">
        <div className="login-form-container">
          <h2>Log In</h2>
          {loginError && (
            <div className="error-message">
              {loginError}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <div className="input-with-icon">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
                <i className="user-icon">👤</i>
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <i className="password-icon">🔒</i>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="keepLoggedIn"
                  checked={formData.keepLoggedIn}
                  onChange={handleChange}
                />
                <span className="checkbox-text">Keep me logged in</span>
              </label>
              <a href="/forgot-password" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="login-button">
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 