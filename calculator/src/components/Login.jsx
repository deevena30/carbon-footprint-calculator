// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link, useLocation } from 'react-router-dom';
// import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
// import { API_BASE_URL } from '../config';
// import logo from '../assets/sus-logo.png';
// import './Login.css';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Check if user came from registration page or token expired
//   useEffect(() => {
//     if (location.state?.fromRegistration) {
//       setSuccessMessage('Account created successfully! Please login with your credentials.');
//     } else if (location.state?.tokenExpired) {
//       setError('Your session has expired. Please login again.');
//     }
//   }, [location]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear messages when user starts typing
//     if (error) {
//       setError('');
//     }
//     if (successMessage) {
//       setSuccessMessage('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     try {
//       // Call backend API
//       const response = await fetch(`${API_BASE_URL}/api/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           username: formData.email, // Using email as username for login
//           password: formData.password
//         })
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         setError(data.msg || 'Invalid email or password. Please check your credentials.');
//         setIsLoading(false);
//         return;
//       }
//       // Store JWT token and user info
//       localStorage.setItem('token', data.access_token);
//       localStorage.setItem('user', JSON.stringify(data.user));
      
//       // Trigger custom event for same-tab localStorage updates
//       window.dispatchEvent(new Event('localStorageChanged'));
      
//       console.log('💾 Token and user stored, navigating to dashboard');
//       navigate('/dashboard');
//     } catch (error) {
//       console.error('Login error:', error);
//       setError('An error occurred during login. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <img src={logo} alt="Sustainability Cell Logo" style={{ width: '120px', marginBottom: '20px' }} />
//       <div className="sustainability-header">
//         <h1>Sustainability Cell</h1>
//         <p>IIT Bombay</p>
//       </div>
      
//       <div className="login-card">
//         <div className="login-header">
          
//           <p>Sign in to your account to continue</p>
//         </div>

// {error && (
//   <div role="alert" aria-live="assertive" className="error-message">
//     {error}
//   </div>
// )}

//         {successMessage && (
//           <div className="success-message">
//             {successMessage}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="login-form">
//           <div className="input-group">
//             <div className="input-wrapper">
//               <FaEnvelope className="input-icon" />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 placeholder="Email"
//                 required
//                 className="login-input"
//               />
//             </div>
//           </div>

//           <div className="input-group">
//             <div className="input-wrapper">
//               <FaLock className="input-icon" />
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 placeholder="Password"
//                 required
//                 className="login-input"
//               />
//               <button
//                 type="button"
//                 className="password-toggle"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="login-button"
//             disabled={isLoading}
//           >
//             {isLoading ? 'Signing In...' : 'Sign In'}
//           </button>
//         </form>

//         <div className="login-footer">
//           <p>
//             Don't have an account?{' '}
//             <Link to="/register" className="link">
//               Create one here
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login; 
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
    console.log('🔄 Login component mounted');
    console.log('📍 Current location state:', location.state);
    console.log('🔍 Current localStorage state:', {
      hasToken: !!localStorage.getItem('token'),
      hasUser: !!localStorage.getItem('user'),
      tokenValue: localStorage.getItem('token'),
      userValue: localStorage.getItem('user')
    });
    
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
    console.log('🔐 LOGIN ATTEMPT STARTED');
    console.log('📤 Form data:', { email: formData.email, password: '[REDACTED]' });
    console.log('🌐 API URL:', `${API_BASE_URL}/api/login`);
    
    setIsLoading(true);
    setError('');

    try {
      // Call backend API
      console.log('📡 Making API call to login endpoint...');
      const requestBody = {
        username: formData.email, // Using email as username for login
        password: formData.password
      };
      console.log('📤 Request body:', { ...requestBody, password: '[REDACTED]' });

      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      console.log('📥 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      const data = await response.json();
      console.log('📋 Response data:', {
        ...data,
        access_token: data.access_token ? `${data.access_token.substring(0, 20)}...` : 'MISSING',
        user: data.user ? 'Present' : 'MISSING'
      });
      
      if (!response.ok) {
        console.log('❌ Login failed:', data.msg || 'Unknown error');
        setError(data.msg || 'Invalid email or password. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      // Debug: Check what we're about to store
      console.log('💾 About to store in localStorage:');
      console.log('- Token exists:', !!data.access_token);
      console.log('- Token type:', typeof data.access_token);
      console.log('- Token preview:', data.access_token ? data.access_token.substring(0, 50) + '...' : 'NONE');
      console.log('- User exists:', !!data.user);
      console.log('- User data:', data.user);

      // Store JWT token and user info
      console.log('💾 Storing token in localStorage...');
      localStorage.setItem('token', data.access_token);
      console.log('💾 Storing user in localStorage...');
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Verify storage immediately after setting
      console.log('✅ Verification - localStorage after storing:');
      console.log('- Token retrieved:', localStorage.getItem('token'));
      console.log('- User retrieved:', localStorage.getItem('user'));
      console.log('- Token matches?', localStorage.getItem('token') === data.access_token);
      console.log('- User matches?', localStorage.getItem('user') === JSON.stringify(data.user));
      
      // Trigger custom event for same-tab localStorage updates
      console.log('📢 Dispatching localStorage change event...');
      window.dispatchEvent(new Event('localStorageChanged'));
      
      console.log('🧭 Navigating to dashboard...');
      
      // Add a small delay to ensure localStorage is fully set before navigation
      setTimeout(() => {
        console.log('🚀 Final verification before navigation:');
        console.log('- Token still there?', !!localStorage.getItem('token'));
        console.log('- User still there?', !!localStorage.getItem('user'));
        navigate('/dashboard');
      }, 100);
      
    } catch (error) {
      console.error('💥 LOGIN ERROR:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
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