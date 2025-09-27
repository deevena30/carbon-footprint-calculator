// Configuration for API URLs
const config = {
  // Development
  development: {
    apiUrl: 'http://localhost:5000'
  },
  // Production - Update this with your Railway URL
  production: {
     apiUrl: import.meta.env.VITE_API_URL || 'https://carbon-footprint-calculatorabcd.onrender.com'
  }
};

// Get current environment
// In Vercel/Netlify deployments, NODE_ENV is typically 'production'
const environment = import.meta.env.MODE || import.meta.env.NODE_ENV || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? 'production' : 'development');

console.log('Environment detected:', environment);
console.log('MODE:', import.meta.env.MODE);
console.log('NODE_ENV:', import.meta.env.NODE_ENV);
console.log('Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);


// Export the appropriate config
export const API_BASE_URL = config[environment].apiUrl;

// Always show the final API URL for debugging
console.log('Final API_BASE_URL:', API_BASE_URL);
console.log('Config used:', config[environment]);
