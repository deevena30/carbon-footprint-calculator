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
  
  // Monitor localStorage for unexpected changes (DEBUGGING ONLY - REMOVE IN PRODUCTION)
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

  // Initial auth check - only runs once on app load
  useEffect(() => {
    console.log('🔄 App.jsx initial auth check');
    
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('Initial auth check:', { 
        tokenExists: !!token, 
        userExists: !!user,
        tokenLength: token ? token.length : 0
      });
      
      const shouldBeAuthenticated = !!(token && user);
      
      if (shouldBeAuthenticated) {
        console.log('✅ Setting authenticated to true');
        setIsAuthenticated(true);
      } else {
        console.log('❌ Setting authenticated to false');
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
      console.log('Auth loading complete');
    };

    // Small delay to ensure localStorage is ready
    const timeoutId = setTimeout(checkAuthentication, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // REMOVED: Periodic auth check that was causing conflicts

  // Update authentication state when localStorage changes
  useEffect(() => {
    const handleStorageChange = (event) => {
      console.log('🔄 Storage change detected in App.jsx:', event);
      
      // Add a small delay to ensure localStorage is updated
      setTimeout(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        const shouldBeAuthenticated = !!(token && user);
        
        console.log('Auth state check after storage change:', { 
          tokenExists: !!token, 
          userExists: !!user,
          currentAuth: isAuthenticated,
          shouldBeAuth: shouldBeAuthenticated
        });
        
        if (shouldBeAuthenticated !== isAuthenticated) {
          console.log('🔄 Updating auth state:', { 
            from: isAuthenticated, 
            to: shouldBeAuthenticated 
          });
          setIsAuthenticated(shouldBeAuthenticated);
        }
      }, 50);
    };

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom storage events from the same tab
    window.addEventListener('localStorageChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChanged', handleStorageChange);
    };
  }, [isAuthenticated]);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    console.log('🔒 ProtectedRoute check:', { 
      isLoading, 
      isAuthenticated,
      hasToken: !!localStorage.getItem('token'),
      hasUser: !!localStorage.getItem('user')
    });
    
    if (isLoading) {
      console.log('⏳ Still loading authentication state...');
      return (
        <div className="loading">
          <div>Loading...</div>
          <div>Please wait while we verify your authentication...</div>
        </div>
      );
    }
    
    // Double-check localStorage directly as a fallback
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const hasValidAuth = !!(token && user);
    
    if (!isAuthenticated && !hasValidAuth) {
      console.log('❌ Not authenticated, redirecting to login');
      return <Navigate to="/login" replace />;
    }
    
    // If localStorage has auth but state doesn't, update state
    if (!isAuthenticated && hasValidAuth) {
      console.log('🔄 Auth state mismatch, updating...');
      setIsAuthenticated(true);
      return (
        <div className="loading">
          <div>Updating authentication state...</div>
        </div>
      );
    }
    
    console.log('✅ Authenticated, rendering protected content');
    return children;
  };

  // Public Route component (redirects to dashboard if already authenticated)
  const PublicRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div className="loading">
          <div>Loading...</div>
          <div>Checking authentication status...</div>
        </div>
      );
    }
    
    // Double-check localStorage for public routes too
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const hasValidAuth = !!(token && user);
    
    if (isAuthenticated || hasValidAuth) {
      console.log('✅ Already authenticated, redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }
    
    return children;
  };

  console.log('🎯 App.jsx render - Auth state:', { 
    isAuthenticated, 
    isLoading,
    hasToken: !!localStorage.getItem('token'),
    hasUser: !!localStorage.getItem('user')
  });

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