import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaCar, 
  FaPlane, 
  FaBus, 
  FaBicycle, 
  FaWalking,
  FaUtensils,
  FaShoppingCart,
  FaLightbulb,
  FaThermometerHalf,
  FaWater,
  FaRecycle,
  FaArrowLeft,
  FaArrowRight,
  FaLeaf,
  FaTint,
  FaTrophy
} from 'react-icons/fa';
import './Questionnaire.css';

const Questionnaire = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Energy/College Questions
    hostelNo: 1,
    credits: 0,
    timeLabs: 0,
    timeLibrary: 0,
    timeGymkhana: 0,
    
    // Food Questions
    dietType: 'Vegan',
    foodOrders: 0,
    
    // Transport Questions
    outingsMonth: 0,
    eatOutMonth: 0,
    partyingMonth: 0,
    shoppingMonth: 0,
    outingType: 'South Bombay+Cab+meal',
    autoRides: 0,
    ecommerce: 0,
    
    // Water Questions
    showers: 0,
    bathDuration: 1,
    
    // Responsibility checkbox
    isResponsible: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      title: 'Energy & College Life',
      fields: ['hostelNo', 'credits', 'timeLabs', 'timeLibrary', 'timeGymkhana']
    },
    {
      title: 'Food & Diet',
      fields: ['dietType', 'foodOrders']
    },
    {
      title: 'Transport & Outings',
      fields: ['outingType', 'outingsMonth', 'eatOutMonth', 'partyingMonth', 'shoppingMonth', 'autoRides', 'ecommerce']
    },
    {
      title: 'Water Usage',
      fields: ['showers', 'bathDuration']
    },
    {
      title: 'Confirmation',
      fields: ['isResponsible']
    }
  ];

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem('questionnaireData');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  const validateStep = (stepIndex) => {
    const currentStepFields = steps[stepIndex].fields;
    const newErrors = {};

    currentStepFields.forEach(field => {
      const value = formData[field];
      
      if (field === 'dietType' && !value) {
        newErrors[field] = 'Please select your diet type';
      }
      
      if (field === 'outingType' && !value) {
        newErrors[field] = 'Please select your usual outing type';
      }
      
      if (field === 'isResponsible' && !value) {
        newErrors[field] = 'Please confirm your responsibility statement';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value);
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Save to localStorage
      localStorage.setItem('questionnaireData', JSON.stringify(formData));
      
      // Simulate API call for now (since backend is not ready)
      // TODO: Replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // For now, simulate successful submission
      console.log('Questionnaire data submitted:', formData);
      
      // Navigate to results page
      navigate('/results', { state: { formData } });
      
    } catch (error) {
      console.error('Questionnaire submission error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Hostel selector component
  const HostelSelector = ({ value, onChange }) => {
    const [start, setStart] = useState(1);
    const HOSTEL_MAX = 21;
    const HOSTELS_PER_PAGE = 7;
    
    const end = Math.min(start + HOSTELS_PER_PAGE - 1, HOSTEL_MAX);
    const canPrev = start > 1;
    const canNext = end < HOSTEL_MAX;
    const hostels = [];
    for (let i = start; i <= end; i++) hostels.push(i);
    
    return (
      <div className="hostel-selector">
        <button 
          type="button" 
          onClick={() => setStart(Math.max(1, start - HOSTELS_PER_PAGE))} 
          disabled={!canPrev}
          className="hostel-nav-btn"
        >
          &lt;
        </button>
        {hostels.map(num => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`hostel-btn ${value === num ? 'selected' : ''}`}
          >
            {num}
          </button>
        ))}
        <button 
          type="button" 
          onClick={() => setStart(Math.min(HOSTEL_MAX - HOSTELS_PER_PAGE + 1, start + HOSTELS_PER_PAGE))} 
          disabled={!canNext}
          className="hostel-nav-btn"
        >
          &gt;
        </button>
      </div>
    );
  };

  // Styled slider component
  const StyledSlider = ({ label, min, max, value, onChange, name, valueLabel }) => {
    return (
      <div className="styled-slider">
        <label>{label}</label>
        <div className="slider-container">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            name={name}
            onChange={onChange}
            className="range-slider"
          />
        </div>
        <div className="slider-value">{valueLabel || value}</div>
      </div>
    );
  };

  // Option button group component
  const OptionButtonGroup = ({ label, name, value, onChange, options }) => {
    return (
      <div className="option-group-container">
        <label>{label}</label>
        <div className="option-group">
          {options.map(opt => (
            <button
              type="button"
              key={opt.value}
              className={`option-btn ${value === opt.value ? 'selected' : ''}`}
              onClick={() => onChange({ target: { name, value: opt.value } })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="step-content">
            <div className="form-group">
              <label>In which hostel do you live?</label>
              <HostelSelector 
                value={formData.hostelNo} 
                onChange={(num) => setFormData(prev => ({ ...prev, hostelNo: num }))} 
              />
            </div>
            <StyledSlider 
              label="Credits taken" 
              min={0} 
              max={54} 
              value={formData.credits} 
              onChange={handleInputChange} 
              name="credits" 
              valueLabel={formData.credits + ' credits'} 
            />
            <OptionButtonGroup 
              label="Time in Labs (hours/week)" 
              name="timeLabs" 
              value={formData.timeLabs} 
              onChange={handleInputChange} 
              options={[
                {label:'0',value:0},
                {label:'1–5',value:3},
                {label:'6–10',value:8},
                {label:'11+',value:13}
              ]} 
            />
            <OptionButtonGroup 
              label="Time in Library (hours/week)" 
              name="timeLibrary" 
              value={formData.timeLibrary} 
              onChange={handleInputChange} 
              options={[
                {label:'0',value:0},
                {label:'1–5',value:3},
                {label:'6–10',value:8},
                {label:'11+',value:13}
              ]} 
            />
            <OptionButtonGroup 
              label="Time in Gymkhana (hours/week)" 
              name="timeGymkhana" 
              value={formData.timeGymkhana} 
              onChange={handleInputChange} 
              options={[
                {label:'0',value:0},
                {label:'1–5',value:3},
                {label:'6–10',value:8},
                {label:'11+',value:13}
              ]} 
            />
          </div>
        );

      case 1:
        return (
          <div className="step-content">
            <div className="form-group">
              <label>Daily Diet</label>
              <select
                name="dietType"
                value={formData.dietType}
                onChange={handleInputChange}
                className={errors.dietType ? 'input-error' : ''}
              >
                <option value="Vegan">Vegan</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Pescatarian">Pescatarian</option>
                <option value="Eggetarian">Eggetarian</option>
                <option value="White Meat Diet">White Meat Diet</option>
                <option value="Red Meat Diet">Red Meat Diet</option>
              </select>
              {errors.dietType && <span className="error-text">{errors.dietType}</span>}
            </div>
            <StyledSlider 
              label="Food Orders/Week" 
              min={0} 
              max={21} 
              value={formData.foodOrders} 
              onChange={handleInputChange} 
              name="foodOrders" 
              valueLabel={formData.foodOrders + ' orders'} 
            />
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="form-group">
              <label>Usual Outing Type</label>
              <select
                name="outingType"
                value={formData.outingType}
                onChange={handleInputChange}
                className={errors.outingType ? 'input-error' : ''}
              >
                <option value="South Bombay+Cab+meal">South Bombay+Cab+meal</option>
                <option value="South Bombay+local+meal">South Bombay+local+meal</option>
                <option value="South Bombay+local+cab+meal">South Bombay+local+cab+meal</option>
                <option value="South Bombay+cab+clubbing">South Bombay+cab+clubbing</option>
                <option value="Around Powai+cab+meal">Around Powai+cab+meal</option>
                <option value="Around Powai+rickshaw+meal">Around Powai+rickshaw+meal</option>
                <option value="Shopping in a mall+rickshaw">Shopping in a mall+rickshaw</option>
                <option value="Around Powai+rickshaw+movie">Around Powai+rickshaw+movie</option>
                <option value="Around Powai+cab+clubbing">Around Powai+cab+clubbing</option>
                <option value="Temples in Mumbai+local">Temples in Mumbai+local</option>
                <option value="Trek+local">Trek+local</option>
                <option value="Trek+local+cab">Trek+local+cab</option>
                <option value="Sea-ferry+local">Sea-ferry+local</option>
              </select>
              {errors.outingType && <span className="error-text">{errors.outingType}</span>}
            </div>
            <OptionButtonGroup 
              label="Outings/Month" 
              name="outingsMonth" 
              value={formData.outingsMonth} 
              onChange={handleInputChange} 
              options={[
                {label:'0',value:0},
                {label:'1–3',value:2},
                {label:'4–6',value:5},
                {label:'7+',value:8}
              ]} 
            />
            <OptionButtonGroup 
              label="Eating Out/Month" 
              name="eatOutMonth" 
              value={formData.eatOutMonth} 
              onChange={handleInputChange} 
              options={[
                {label:'0',value:0},
                {label:'1–3',value:2},
                {label:'4–6',value:5},
                {label:'7+',value:8}
              ]} 
            />
            <OptionButtonGroup 
              label="Partying/Clubbing/Month" 
              name="partyingMonth" 
              value={formData.partyingMonth} 
              onChange={handleInputChange} 
              options={[
                {label:'0',value:0},
                {label:'1–3',value:2},
                {label:'4–6',value:5},
                {label:'7+',value:8}
              ]} 
            />
            <OptionButtonGroup 
              label="Shopping Trips/Month" 
              name="shoppingMonth" 
              value={formData.shoppingMonth} 
              onChange={handleInputChange} 
              options={[
                {label:'0',value:0},
                {label:'1–3',value:2},
                {label:'4–6',value:5},
                {label:'7+',value:8}
              ]} 
            />
            <OptionButtonGroup 
              label="Auto Rickshaw Rides/Day" 
              name="autoRides" 
              value={formData.autoRides} 
              onChange={handleInputChange} 
              options={[
                {label:'0',value:0},
                {label:'1–3',value:2},
                {label:'4–6',value:5},
                {label:'7+',value:8}
              ]} 
            />
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <OptionButtonGroup 
              label="Showers/Week" 
              name="showers" 
              value={formData.showers} 
              onChange={handleInputChange} 
              options={[
                {label:'0',value:0},
                {label:'1–5',value:3},
                {label:'6–10',value:8},
                {label:'11+',value:13}
              ]} 
            />
            <StyledSlider 
              label="Bath Duration (minutes)" 
              min={1} 
              max={45} 
              value={formData.bathDuration} 
              onChange={handleInputChange} 
              name="bathDuration" 
              valueLabel={formData.bathDuration + ' min'} 
            />
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <div className="responsibility-section">
              <div className="responsibility-checkbox">
                <input
                  type="checkbox"
                  id="isResponsible"
                  name="isResponsible"
                  checked={formData.isResponsible}
                  onChange={handleInputChange}
                  className={errors.isResponsible ? 'input-error' : ''}
                />
                <label htmlFor="isResponsible">
                  As a responsible citizen, I acknowledge my responsibility towards our planet and confirm that all the information I have provided in this calculator is accurate to the best of my knowledge. I understand the importance of environmental awareness and commit to making sustainable choices.
                </label>
              </div>
              {errors.isResponsible && <span className="error-text">{errors.isResponsible}</span>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-card">
        <div className="questionnaire-header">
          <h1>Carbon Footprint Assessment</h1>
          <p>Help us understand your lifestyle to calculate your carbon footprint</p>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        <div className="step-indicator">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <h2>{steps[currentStep].title}</h2>
        </div>

        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}

        <div className="questionnaire-content">
          {renderStepContent()}
        </div>

        <div className="questionnaire-footer">
          <button
            type="button"
            className="nav-button prev-button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <FaArrowLeft /> Previous
          </button>
          
          <button
            type="button"
            className="nav-button next-button"
            onClick={handleNext}
            disabled={isLoading}
          >
            {currentStep === steps.length - 1 ? (
              isLoading ? 'Submitting...' : 'See Results'
            ) : (
              <>
                Next <FaArrowRight />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire; 