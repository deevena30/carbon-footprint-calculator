// Configuration for API URLs
const config = {
  // Development
  development: {
    apiUrl: 'http://localhost:5000'
  },
  // Production - Update this with your Railway URL
  production: {
    apiUrl: 'https://your-railway-backend-url.railway.app'
  }
};

// Get current environment
const environment = import.meta.env.MODE || 'development';

// Export the appropriate config
export const API_BASE_URL = config[environment].apiUrl;
