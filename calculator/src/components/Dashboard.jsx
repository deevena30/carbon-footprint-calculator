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
  FaCheckCircle
} from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [carbonData, setCarbonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
      fetchCarbonData();
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const fetchCarbonData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call for now (since backend is not ready)
      // TODO: Replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // For now, use mock data directly
      setCarbonData(getMockCarbonData());
      
    } catch (error) {
      console.error('Error fetching carbon data:', error);
      setError('Failed to load carbon footprint data');
    } finally {
      setIsLoading(false);
    }
  };

  const getMockCarbonData = () => {
    return {
      totalEmissions: 8.5,
      score: 75,
      categoryBreakdown: {
        energy: 3.2,
        transportation: 2.8,
        food: 1.5,
        waste: 0.5,
        water: 0.3,
        shopping: 0.2
      },
      recommendations: [
        {
          id: 1,
          category: 'Energy',
          title: 'Switch to LED bulbs',
          description: 'Replace incandescent bulbs with LED bulbs to reduce energy consumption by up to 80%.',
          impact: 'High',
          difficulty: 'Easy',
          potentialSavings: 0.8
        },
        {
          id: 2,
          category: 'Transportation',
          title: 'Use public transport more',
          description: 'Take public transportation 2 more days per week to reduce your carbon footprint.',
          impact: 'Medium',
          difficulty: 'Medium',
          potentialSavings: 0.5
        },
        {
          id: 3,
          category: 'Food',
          title: 'Reduce meat consumption',
          description: 'Try meatless Mondays or reduce meat consumption by 25% to lower your food carbon footprint.',
          impact: 'High',
          difficulty: 'Medium',
          potentialSavings: 0.6
        },
        {
          id: 4,
          category: 'Waste',
          title: 'Improve recycling',
          description: 'Increase your recycling rate to 80% and compost organic waste.',
          impact: 'Medium',
          difficulty: 'Easy',
          potentialSavings: 0.3
        }
      ],
      trends: {
        monthly: [8.2, 8.0, 7.8, 7.5, 7.2, 8.5],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      }
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Trigger storage event to update authentication state
    window.dispatchEvent(new Event('storage'));
    
    navigate('/login');
  };

  const handleEditProfile = () => {
    navigate('/questionnaire');
  };

  const handleViewResults = () => {
    navigate('/results');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <FaTrophy className="score-icon excellent" />;
    if (score >= 60) return <FaCheckCircle className="score-icon good" />;
    return <FaExclamationTriangle className="score-icon poor" />;
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

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

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchCarbonData}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <FaUser className="user-icon" />
            <div>
              <h1>Welcome back, {user?.firstName || 'User'}!</h1>
              <p>Here's your carbon footprint overview</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="edit-button" onClick={handleEditProfile}>
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
          <div className="metric-card total-emissions">
            <div className="metric-icon">
              <FaLeaf />
            </div>
            <div className="metric-content">
              <h3>Total Carbon Footprint</h3>
              <div className="metric-value">
                {carbonData?.totalEmissions || 0} <span>tons CO₂/year</span>
              </div>
              <p>Your annual carbon emissions</p>
            </div>
          </div>

          <div className="metric-card score-card">
            <div className="metric-icon">
              {getScoreIcon(carbonData?.score || 0)}
            </div>
            <div className="metric-content">
              <h3>Sustainability Score</h3>
              <div 
                className="metric-value score-value"
                style={{ color: getScoreColor(carbonData?.score || 0) }}
              >
                {carbonData?.score || 0}%
              </div>
              <p>{getScoreText(carbonData?.score || 0)}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="category-breakdown">
            <h2>Emissions by Category</h2>
            <div className="category-list">
              {carbonData?.categoryBreakdown && Object.entries(carbonData.categoryBreakdown).map(([category, value]) => (
                <div key={category} className="category-item">
                  <div className="category-info">
                    <div className="category-icon">
                      {category === 'energy' && <FaLightbulb />}
                      {category === 'transportation' && <FaCar />}
                      {category === 'food' && <FaUtensils />}
                      {category === 'waste' && <FaRecycle />}
                      {category === 'water' && <FaHome />}
                      {category === 'shopping' && <FaShoppingCart />}
                    </div>
                    <div className="category-details">
                      <span className="category-name">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                      <span className="category-value">{value} tons CO₂/year</span>
                    </div>
                  </div>
                  <div className="category-percentage">
                    {((value / carbonData.totalEmissions) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="recommendations">
            <h2>Personalized Recommendations</h2>
            <div className="recommendations-list">
              {carbonData?.recommendations?.map((rec) => (
                <div key={rec.id} className="recommendation-card">
                  <div className="recommendation-header">
                    <div className="recommendation-category">{rec.category}</div>
                    <div className={`impact-badge ${rec.impact.toLowerCase()}`}>
                      {rec.impact} Impact
                    </div>
                  </div>
                  <h3>{rec.title}</h3>
                  <p>{rec.description}</p>
                  <div className="recommendation-footer">
                    <span className="difficulty">Difficulty: {rec.difficulty}</span>
                    <span className="savings">Save {rec.potentialSavings} tons CO₂/year</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="trends-section">
          <h2>Monthly Trends</h2>
          <div className="trends-chart">
            <div className="chart-placeholder">
              <FaChartLine className="chart-icon" />
              <p>Chart visualization will be implemented with backend integration</p>
              <div className="trend-data">
                {carbonData?.trends?.monthly?.map((value, index) => (
                  <div key={index} className="trend-point">
                    <span className="trend-value">{value}</span>
                    <span className="trend-label">{carbonData.trends.labels[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 