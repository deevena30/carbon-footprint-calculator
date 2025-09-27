import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { API_BASE_URL } from '../config';
import logo from '../assets/sus-logo.png';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user came from registration page or token expired
  useEffect(() => {
    if (location.state?.fromRegistration) {
      setSuccessMessage('Account created successfully! Please login with your credentials.');
    } else if (location.state?.tokenExpired) {
      setError('Your session has expired. Please login again.');
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user starts typing
    if (error) {
      setError('');
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call backend API
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email, // Using email as username for login
          password: formData.password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.msg || 'Invalid email or password. Please check your credentials.');
        setIsLoading(false);
        return;
      }
      // Store JWT token and user info
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Trigger custom event for same-tab localStorage updates
      window.dispatchEvent(new Event('localStorageChanged'));
      
      console.log('💾 Token and user stored, navigating to dashboard');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Sustainability Cell Logo" style={{ width: '120px', marginBottom: '20px' }} />
      <div className="sustainability-header">
        <h1>Sustainability Cell</h1>
        <p>IIT Bombay</p>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          
          <p>Sign in to your account to continue</p>
        </div>

{error && (
  <div role="alert" aria-live="assertive" className="error-message">
    {error}
  </div>
)}

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                className="login-input"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                className="login-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="link">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 