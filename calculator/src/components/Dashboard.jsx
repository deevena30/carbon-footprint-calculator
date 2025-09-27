import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaLeaf, 
  FaChartLine, 
  FaLightbulb, 
  FaRecycle, 
  FaCar, 
  FaHome,
  FaUtensils,
  FaShoppingCart,
  FaSignOutAlt,
  FaUser,
  FaEdit,
  FaTrophy,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTree,
  FaWater,
  FaWind,
  FaSun,
  FaBolt,
  FaTrash
} from 'react-icons/fa';
import { API_BASE_URL } from '../config';
import './Dashboard.css';

const Dashboard = () => {
  console.log('=== DASHBOARD COMPONENT RENDER START ===');
  console.log('Dashboard component starting to render');
  console.log('Current URL:', window.location.href);
  console.log('localStorage token exists:', !!localStorage.getItem('token'));
  console.log('localStorage user exists:', !!localStorage.getItem('user'));
  
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [carbonData, setCarbonData] = useState(null);
  const [recentScores, setRecentScores] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const initializeDashboard = async () => {
    console.log('=== INITIALIZE DASHBOARD START ===');
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('Token check result:', {
        tokenExists: !!token,
        userDataExists: !!userData,
        tokenLength: token ? token.length : 0
      });
      
      if (!token || !userData) {
        console.log('❌ No token or user data found, redirecting to login');
        console.log('Token:', token ? 'EXISTS' : 'MISSING');
        console.log('User data:', userData ? 'EXISTS' : 'MISSING');
        navigate('/login');
        return;
      }

      console.log('✅ Both token and user data found, proceeding...');
      const parsedUser = JSON.parse(userData);
      console.log('User data parsed:', parsedUser);
      setUser(parsedUser);
      
      console.log('About to call fetchDashboardData...');
      await fetchDashboardData();
      console.log('fetchDashboardData completed');
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        setError('Failed to initialize dashboard');
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  const fetchDashboardData = async () => {
    console.log('Response status:', response.status);
    console.log('Response JSON:', data);

    console.log('=== FETCH DASHBOARD DATA START ===');
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'Present (' + token.length + ' chars)' : 'Missing');
      
      // Debug: Check token expiration (temporarily disabled for debugging)
      if (token) {
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            const isExpired = payload.exp && payload.exp < currentTime;
            console.log('Token payload:', payload);
            console.log('Token expires at:', new Date(payload.exp * 1000));
            console.log('Current time:', new Date());
            console.log('Token expired:', isExpired);
            
            // Temporarily disable auto-removal of expired tokens for debugging
            // if (isExpired) {
            //   console.log('Token is expired, removing and redirecting to login');
            //   localStorage.removeItem('token');
            //   localStorage.removeItem('user');
            //   navigate('/login', { state: { tokenExpired: true } });
            //   return;
            // }
          }
        } catch (e) {
          console.error('Error parsing token:', e);
        }
      }
      
      if (!token) {
        console.log('No token found, redirecting to login');
        setError('You must be logged in to view the dashboard.');
        navigate('/login');
        setIsLoading(false);
        // return;
      }
      
      console.log('Fetching dashboard data...');
      console.log('Token being sent:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
      console.log('Full token length:', token ? token.length : 0);
      console.log('API URL:', `${API_BASE_URL}/api/dashboard`);
      
      // Test the token format
      console.log('Authorization header will be:', `Bearer ${token}`);
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      console.log('Headers being sent:', headers);
      
      const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      // Additional logging for debugging 422 errors
      if (response.status === 422) {
        console.error('422 ERROR DETAILS:');
        console.error('- Status:', response.status);
        console.error('- Status Text:', response.statusText);
        console.error('- Response Data:', JSON.stringify(data, null, 2));
        console.error('- Request Headers:', headers);
        console.error('- Token being used:', token ? token.substring(0, 50) + '...' : 'NO TOKEN');
      }
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 422) {
          // Token invalid - clear storage and redirect to login
          console.log('Token invalid (status ' + response.status + '), clearing storage and redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Force a clean redirect without state to prevent loops
          window.location.href = '/login';
          return;
        } else if (response.status === 404) {
          // New user - no data yet
          console.log('No data found for user, showing new user experience');
          setCarbonData(null);
          setRecentScores([]);
        } else {
          setError(data.msg || 'Failed to load carbon footprint data');
        }
        setIsLoading(false);
        return;
      }
      
      setCarbonData(data.dashboard);
      // Backend now handles excluding current score and duplicates
      setRecentScores(data.recentScores || []);
      
      // Fetch top users and notifications
      await fetchTopUsers();
      await fetchNotifications();
    } catch (error) {
      console.error('Error fetching carbon data:', error);
      // If backend is not running, show new user experience
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.log('Backend not running, showing new user experience');
        setCarbonData(null);
        setRecentScores([]);
      } else {
        setError('Failed to load carbon footprint data. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      console.log('Fetching top users...');
      const response = await fetch(`${API_BASE_URL}/api/top-users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      console.log('Top users response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Top users data:', data);
        setTopUsers(data.topUsers || []);
      } else if (response.status === 401 || response.status === 422) {
        // Token expired or invalid
        console.log('Token expired during top users fetch, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { state: { tokenExpired: true } });
      } else {
        console.error('Failed to fetch top users:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching top users:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      console.log('Fetching notifications...');
      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      console.log('Notifications response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Notifications data:', data);
        setNotifications(data.notifications || []);
      } else if (response.status === 401 || response.status === 422) {
        // Token expired or invalid
        console.log('Token expired during notifications fetch, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { state: { tokenExpired: true } });
      } else {
        console.error('Failed to fetch notifications:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Trigger storage event to update authentication state
    window.dispatchEvent(new Event('storage'));
    
    navigate('/login');
  };

  const handleCalculateScore = () => {
    navigate('/questionnaire');
  };

  const handleViewResults = () => {
    navigate('/results');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/delete-account`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          alert('Account deleted successfully');
          handleLogout();
        } else {
          alert('Failed to delete account');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981'; // Green for high scores
    if (score >= 5) return '#f59e0b'; // Orange for moderate scores
    return '#ef4444'; // Red for low scores
  };

  const getScoreIcon = (score) => {
    if (score >= 8) return <FaTrophy className="score-icon excellent" />;
    if (score >= 5) return <FaCheckCircle className="score-icon good" />;
    return <FaExclamationTriangle className="score-icon poor" />;
  };

  const getScoreText = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 5) return 'Moderate';
    return 'Needs Improvement';
  };

  const environmentalFacts = [
    {
      icon: <FaTree />,
      title: "Tree Planting Impact",
      fact: "A single tree can absorb up to 48 pounds of CO2 per year and release enough oxygen for 2 people."
    },
    {
      icon: <FaWater />,
      title: "Water Conservation",
      fact: "A 5-minute shower uses about 25-50 gallons of water, while a bath can use up to 70 gallons."
    },
    {
      icon: <FaWind />,
      title: "Renewable Energy",
      fact: "Wind energy could provide 20% of the world's electricity by 2030, reducing CO2 emissions by 3.3 billion tons."
    },
    {
      icon: <FaSun />,
      title: "Solar Power",
      fact: "The sun provides enough energy in one hour to meet the world's energy needs for an entire year."
    }
  ];

  // Simple test to ensure component renders
  console.log('Dashboard component rendering, state:', { isLoading, error, carbonData, user, topUsers });

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your carbon footprint data...</p>
        </div>
      </div>
    );
  }

  // New user - no data yet
  if (!carbonData && !error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="user-info">
              <FaUser className="user-icon" />
              <div>
                <h1>Welcome, {user?.username || user?.email || 'User'}!</h1>
                <p>Start your sustainability journey today</p>
              </div>
            </div>
            <div className="header-actions">
              <button className="calculate-score-btn" onClick={handleCalculateScore}>
                <FaLeaf /> Calculate Your Carbon Score
              </button>
              <button className="logout-button" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>Begin Your Sustainability Journey</h2>
            <p>Calculate your carbon footprint and discover personalized recommendations to reduce your environmental impact.</p>
            <button className="primary-action-btn" onClick={handleCalculateScore}>
              <FaLeaf /> Start Assessment
            </button>
          </div>

          <div className="environmental-facts">
            <h2>Environmental Facts</h2>
            <div className="facts-grid">
              {environmentalFacts && environmentalFacts.map((fact, index) => (
                <div key={index} className="fact-card">
                  <div className="fact-icon">{fact.icon}</div>
                  <h3>{fact.title}</h3>
                  <p>{fact.fact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchDashboardData}>Try Again</button>
        </div>
      </div>
    );
  }

  // If we get here, we should have data
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <FaUser className="user-icon" />
            <div>
              <h1>Welcome back, {user?.username || user?.email || 'User'}!</h1>
              <p>Here's your carbon footprint overview</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="edit-button" onClick={handleCalculateScore}>
              <FaEdit /> Update Assessment
            </button>
            <button className="view-results-button" onClick={handleViewResults}>
              <FaChartLine /> View Results
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
            <button className="delete-account-button" onClick={handleDeleteAccount}>
              <FaTrash /> Delete Account
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-metrics">
          <div className="metric-card score-card">
            <div className="metric-icon">
              {getScoreIcon(carbonData?.greenScore || 0)}
            </div>
            <div className="metric-content">
              <h3>Carbon Score</h3>
              <div 
                className="metric-value score-value"
                style={{ color: getScoreColor(carbonData?.greenScore || 0) }}
              >
                {carbonData?.greenScore || 0}/10
              </div>
              <p>{getScoreText(carbonData?.greenScore || 0)}</p>
            </div>
          </div>
        </div>





        {/* Top Users Leaderboard */}
        <div className="top-users-section">
          <h2>🏆 Top 10 Users Leaderboard</h2>
          {topUsers && topUsers.length > 0 ? (
            <div className="leaderboard">
              {topUsers.map((leaderboardUser, index) => (
                <div key={index} className={`leaderboard-item ${leaderboardUser.username === (user?.username || user?.email) ? 'current-user' : ''}`}>
                  <div className="rank">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </div>
                  <div className="user-info">
                    <span className="username">{leaderboardUser.username}</span>
                    {leaderboardUser.username === (user?.username || user?.email) && <span className="current-user-badge">You</span>}
                  </div>
                  <div className="score" style={{ color: getScoreColor(leaderboardUser.greenScore) }}>
                    {leaderboardUser.greenScore}/10
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-top-users">
              <p>No users have completed assessments yet. Be the first to calculate your carbon footprint!</p>
            </div>
          )}
        </div>
        

        {/* Recent Scores Section */}
        {recentScores && recentScores.length > 0 && (
          <div className="recent-scores-section">
            <h2>Previous Scores ({recentScores.length})</h2>
            <div className="recent-scores-grid">
              {recentScores.map((score, index) => (
                <div key={index} className="recent-score-card">
                  <div className="score-date">{new Date(score.date).toLocaleDateString()} {new Date(score.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  <div className="score-value" style={{ color: getScoreColor(score.greenScore) }}>
                    {score.greenScore}/10
                  </div>
                  <div className="score-breakdown">
                    <span>C: {score.carbonScore}</span>
                    <span>W: {score.waterScore}</span>
                    <span>W: {score.wasteScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
                {/* Notifications Section */}
                {notifications && notifications.length > 0 && (
          <div className="notifications-section">
            <h2>🔔 Notifications ({notifications.length})</h2>
            <div className="notifications-list">
              {notifications.map((notification, index) => (
                <div key={index} className={`notification-card ${notification.priority}`}>
                  <div className="notification-header">
                    <h3>{notification.title}</h3>
                    <span className={`priority-badge ${notification.priority}`}>
                      {notification.priority}
                    </span>
                  </div>
                  <p>{notification.message}</p>
                  <div className="notification-actions">
                    <button 
                      className="notification-action-btn"
                      onClick={() => {
                        if (notification.action === 'Take Assessment' || notification.action === 'Start Assessment') {
                          handleCalculateScore();
                        } else if (notification.action === 'View Progress') {
                          handleViewResults();
                        }
                      }}
                    >
                      {notification.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="category-breakdown">
            <h2>Emissions by Category</h2>
            <div className="category-list">
              <div className="category-item">
                <div className="category-info">
                  <div className="category-icon">
                    <FaBolt />
                  </div>
                  <div className="category-details">
                    <span className="category-name">Electricity</span>
                    <span className="category-value">{carbonData?.electricity || 0} kWh/day</span>
                  </div>
                </div>
                <div className="category-percentage">
                  {carbonData?.electricity ? ((carbonData.electricity / (carbonData.totalCarbon || 1)) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="category-item">
                <div className="category-info">
                  <div className="category-icon">
                    <FaCar />
                  </div>
                  <div className="category-details">
                    <span className="category-name">Transportation</span>
                    <span className="category-value">{carbonData?.outings || 0} kg CO₂/day</span>
                  </div>
                </div>
                <div className="category-percentage">
                  {carbonData?.outings ? ((carbonData.outings / (carbonData.totalCarbon || 1)) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="category-item">
                <div className="category-info">
                  <div className="category-icon">
                    <FaUtensils />
                  </div>
                  <div className="category-details">
                    <span className="category-name">Food</span>
                    <span className="category-value">{carbonData?.scope3 || 0} kg CO₂/day</span>
                  </div>
                </div>
                <div className="category-percentage">
                  {carbonData?.scope3 ? ((carbonData.scope3 / (carbonData.totalCarbon || 1)) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="category-item">
                <div className="category-info">
                  <div className="category-icon">
                    <FaWater />
                  </div>
                  <div className="category-details">
                    <span className="category-name">Water</span>
                    <span className="category-value">{carbonData?.water || 0} L/day</span>
                  </div>
                </div>
                <div className="category-percentage">
                  {carbonData?.water ? ((carbonData.water / 200) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </div>

          <div className="recommendations">
            <h2>Personalized Recommendations</h2>
            <div className="recommendations-list">
              {carbonData?.recommendations?.map((rec, index) => (
                <div key={index} className="recommendation-card">
                  <div className="recommendation-header">
                    <div className="recommendation-category">{rec.category}</div>
                    <div className="impact-badge high">
                      High Impact
                    </div>
                  </div>
                  <h3>{rec.title}</h3>
                  <p>{rec.description}</p>
                </div>
              )) || (
                <div className="no-recommendations">
                  <p>Complete your assessment to get personalized recommendations!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 