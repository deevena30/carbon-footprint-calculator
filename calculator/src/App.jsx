import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import StartingPage from './StartingPage';
import ResultPage from './Resultpage';
import EnergyPage from './EnergyPage';
import FoodPage from './FoodPage';
import TransportPage from './TransportPage';
import WaterPage from './WaterPage';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({});

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('carbonFootprintData');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  const handleNext = (data) => {
    const newFormData = { ...formData, ...data };
    setFormData(newFormData);
    // Save to localStorage
    localStorage.setItem('carbonFootprintData', JSON.stringify(newFormData));
  };

  const handleReset = () => {
    setFormData({});
    localStorage.removeItem('carbonFootprintData');
  };

  // Custom wrapper for StartingPage to add navigation
  function StartingPageWithNav() {
    const navigate = useNavigate();
    return <StartingPage onStart={() => navigate('/energy')} onReset={handleReset} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartingPageWithNav />} />
        <Route path="/energy" element={<EnergyPage onNext={handleNext} formData={formData} />} />
        <Route path="/food" element={<FoodPage onNext={handleNext} formData={formData} />} />
        <Route path="/transport" element={<TransportPage onNext={handleNext} formData={formData} />} />
        <Route path="/water" element={<WaterPage onNext={handleNext} formData={formData} />} />
        <Route path="/results" element={<ResultPage formData={formData} onReset={handleReset} />} />
      </Routes>
    </Router>
  );
}

export default App;
