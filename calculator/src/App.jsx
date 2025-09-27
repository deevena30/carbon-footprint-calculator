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

  useEffect(() => {
    console.log('🔄 App.jsx initial auth check');
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('Initial auth check:', { tokenExists: !!token, userExists: !!user });
    
    if (token && user) {
      console.log('✅ Setting authenticated to true');
      setIsAuthenticated(true);
    } else {
      console.log('❌ Setting authenticated to false');
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
    console.log('Auth loading complete');
  }, []);
  
  // Add periodic auth check to catch any missed updates
  useEffect(() => {
    const intervalCheck = setInterval(() => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const shouldBeAuthenticated = !!(token && user);
      
      if (shouldBeAuthenticated !== isAuthenticated) {
        console.log('🕰️ Periodic auth check - updating state:', { 
          was: isAuthenticated, 
          shouldBe: shouldBeAuthenticated 
        });
        setIsAuthenticated(shouldBeAuthenticated);
      }
    }, 1000); // Check every second
    
    return () => clearInterval(intervalCheck);
  }, [isAuthenticated]);

  // Update authentication state when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('🔄 Storage change detected in App.jsx');
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      console.log('Auth state check:', { tokenExists: !!token, userExists: !!user });
      setIsAuthenticated(!!(token && user));
    };

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom storage events from the same tab
    window.addEventListener('localStorageChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChanged', handleStorageChange);
    };
  }, []);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    console.log('🔒 ProtectedRoute check:', { isLoading, isAuthenticated });
    
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
    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }
    
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
    
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
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
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
                <Dashboard />
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
