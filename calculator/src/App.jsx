import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Questionnaire from './components/Questionnaire';
import Dashboard from './components/Dashboard';
import ResultPage from './Resultpage';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Monitor localStorage for unexpected changes
  useEffect(() => {
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    const originalClear = localStorage.clear;
    
    localStorage.setItem = function(key, value) {
      console.log('📝 localStorage.setItem:', key, value ? value.substring(0, 50) + '...' : 'null');
      return originalSetItem.apply(this, arguments);
    };
    
    localStorage.removeItem = function(key) {
      console.log('🗑️ localStorage.removeItem:', key);
      return originalRemoveItem.apply(this, arguments);
    };
    
    localStorage.clear = function() {
      console.log('🧹 localStorage.clear() called');
      return originalClear.apply(this, arguments);
    };
    
    return () => {
      localStorage.setItem = originalSetItem;
      localStorage.removeItem = originalRemoveItem;
      localStorage.clear = originalClear;
    };
  }, []);

  // SINGLE SOURCE OF TRUTH for authentication
  useEffect(() => {
    console.log('🔄 App.jsx initial auth check');
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      // More robust validation
      const tokenValid = token && token.length > 10; // Basic token validation
      const userValid = user && user !== 'null' && user !== 'undefined';
      
      console.log('Auth check:', { 
        tokenExists: !!token, 
        userExists: !!user,
        tokenValid,
        userValid
      });
      
      return !!(tokenValid && userValid);
    };
    
    const authValid = checkAuth();
    console.log(authValid ? '✅ Setting authenticated to true' : '❌ Setting authenticated to false');
    setIsAuthenticated(authValid);
    setIsLoading(false);
  }, []);

  // REMOVE the periodic auth check - it's causing the issue
  // REMOVE the storage change listener - it's causing the issue

  // Protected Route component with better logging
  const ProtectedRoute = ({ children }) => {
    console.log('🔒 ProtectedRoute check:', { 
      path: window.location.pathname,
      isLoading, 
      isAuthenticated 
    });
    
    if (isLoading) {
      console.log('⏳ Still loading authentication state...');
      return <div className="loading">Loading...</div>;
    }
    
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login');
      return <Navigate to="/login" replace />;
    }
    
    console.log('✅ Authenticated, rendering protected content');
    return children;
  };

  // Public Route component (redirects to dashboard if already authenticated)
  const PublicRoute = ({ children }) => {
    console.log('🔓 PublicRoute check:', { 
      path: window.location.pathname,
      isLoading, 
      isAuthenticated 
    });
    
    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }
    
    if (isAuthenticated) {
      console.log('✅ Already authenticated, redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }
    
    console.log('🔓 Rendering public route');
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login setIsAuthenticated={setIsAuthenticated} />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register setIsAuthenticated={setIsAuthenticated} />
              </PublicRoute>
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/questionnaire" 
            element={
              <ProtectedRoute>
                <Questionnaire />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard setIsAuthenticated={setIsAuthenticated} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;