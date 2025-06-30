import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import StartingPage from './StartingPage';
import ResultPage from './Resultpage';
import EnergyPage from './EnergyPage';
import FoodPage from './FoodPage';
import TransportPage from './TransportPage';
import WaterPage from './WaterPage';
import { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({});

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Custom wrapper for StartingPage to add navigation
  function StartingPageWithNav() {
    const navigate = useNavigate();
    return <StartingPage onStart={() => navigate('/energy')} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartingPageWithNav />} />
        <Route path="/energy" element={<EnergyPage onNext={handleNext} />} />
        <Route path="/food" element={<FoodPage onNext={handleNext} />} />
        <Route path="/transport" element={<TransportPage onNext={handleNext} />} />
        <Route path="/water" element={<WaterPage onNext={handleNext} />} />
        <Route path="/results" element={<ResultPage formData={formData} />} />
      </Routes>
    </Router>
  );
}

export default App;
