// Configuration for API URLs
const config = {
  // Development
  development: {
    apiUrl: 'http://localhost:5000'
  },
  // Production - Update this with your Railway URL
  production: {
     apiUrl: import.meta.env.VITE_API_URL || 'https://your-render-app.onrender.com'
  }
};

// Get current environment
const environment = import.meta.env.MODE || 'development';

// Debug logging (only in development)
if (environment === 'development') {
  console.log('Environment:', environment);
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('Config:', config[environment]);
}

// Export the appropriate config
export const API_BASE_URL = config[environment].apiUrl;

// Additional debug logging (only in development)
if (environment === 'development') {
  console.log('Final API_BASE_URL:', API_BASE_URL);
}
