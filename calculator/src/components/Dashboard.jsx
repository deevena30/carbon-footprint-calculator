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
  FaBolt
} from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  console.log('Dashboard component starting to render');
  
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [carbonData, setCarbonData] = useState(null);
  const [recentScores, setRecentScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
          console.log('No token or user data found, redirecting to login');
          navigate('/login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        console.log('User data parsed:', parsedUser);
        setUser(parsedUser);
        
        await fetchDashboardData();
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        setError('Failed to initialize dashboard');
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view the dashboard.');
        setIsLoading(false);
        return;
      }
      
      console.log('Fetching dashboard data...');
      const response = await fetch('http://localhost:5000/api/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        if (response.status === 404) {
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
      // Filter out duplicate scores (same greenScore, carbonScore, waterScore, wasteScore)
      const uniqueScores = [];
      const seenScores = new Set();
      
      (data.recentScores || []).forEach(score => {
        const scoreKey = `${score.greenScore}-${score.carbonScore}-${score.waterScore}-${score.wasteScore}`;
        if (!seenScores.has(scoreKey)) {
          seenScores.add(scoreKey);
          uniqueScores.push(score);
        }
      });
      
      setRecentScores(uniqueScores);
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
  console.log('Dashboard component rendering, state:', { isLoading, error, carbonData, user });

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