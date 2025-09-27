import React, { useEffect, useState } from 'react';
import logo from './assets/logo.png';
import { FaLeaf, FaTint, FaRecycle, FaTrophy, FaBolt, FaCloud, FaWalking, FaWater, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
// import Text3 from './assets/Group 1384.png';
// import Earth from './assets/image 3.png';
// import Halfearth from './assets/image 11.png';
// import Star1 from './assets/Star1.png';
// import Star2 from './assets/Star2.png';
// import Star3 from './assets/Star3.png';
// import I1 from './assets/1.png';
// import I2 from './assets/2.png';
// import I3 from './assets/3.png';
// import I4 from './assets/4.png';

function DivBox({ left, top, children }) {
  return (
    <div style={{
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      width: '490px',
      height: '316px',
      backgroundColor: '#BDD873',

    }}>
      {children}
    </div>
  );
}
function AddImg({ imgg, left, top, children }) {
  return (
    <img src={imgg} style={{
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      width: '490px',
      height: '330px',
    }} alt="" />
  );
}

function normalize(value, min, max, newMin, newMax) {
  const clamped = Math.max(min, Math.min(max, value));
  return ((clamped - min) / (max - min)) * (newMax - newMin) + newMin;
}

function scoreFromValue(value, min, max) {
  // Lower usage = higher score (better for environment)
  if (max === min) {
    return 5.0; // Return middle score if min and max are the same
  }
  const normalized = (value - min) / (max - min);
  // Invert the score: lower usage gets higher score
  const score = 1 + (1 - normalized) * 9; // 1 (worst) to 10 (best), inverted
  return Math.max(1, Math.min(10, parseFloat(score.toFixed(2))));
}

function calculateResults(inputs) {
  // Default values if not provided, and coerce to numbers
  const {
    hostelNo = 1,
    credits = 0,
    timeLabs = 0,
    timeLibrary = 0,
    timeGymkhana = 0,
    dietType = 'Vegan',
    foodOrders = 0,
    autoRides = 0,
    outingsMonth = 0,
    eatOutMonth = 0,
    partyingMonth = 0,
    shoppingMonth = 0,
    outingType = 'South Bombay+Cab+meal',
    showers = 0,
    bathDuration = 1,
    ecommerce = 0
  } = inputs || {};

  // Coerce all numeric values to numbers
  const nHostelNo = Number(hostelNo) || 1;
  const nCredits = Number(credits) || 0;
  const nTimeLabs = Number(timeLabs) || 0;
  const nTimeLibrary = Number(timeLibrary) || 0;
  const nTimeGymkhana = Number(timeGymkhana) || 0;
  const nFoodOrders = Number(foodOrders) || 0;
  const nAutoRides = Number(autoRides) || 0;
  const nOutingsMonth = Number(outingsMonth) || 0;
  const nEatOutMonth = Number(eatOutMonth) || 0;
  const nPartyingMonth = Number(partyingMonth) || 0;
  const nShoppingMonth = Number(shoppingMonth) || 0;
  const nShowers = Number(showers) || 0;
  const nBathDuration = Number(bathDuration) || 1;
  const nEcommerce = Number(ecommerce) || 0;

  const PARAMS = {
    carbonPerKWh: 0.82,
    outingEmissionFactors: {
      'South Bombay+Cab+meal': 518.7198,
      'South Bombay+local+meal': 470.637,
      'South Bombay+local+cab+meal': 494.6784,
      'South Bombay+cab+clubbing': 472.537,
      'Around Powai+cab+meal': 477.04804,
      'Around Powai+rickshaw+meal': 475.835336,
      'Shopping in a mall+rickshaw': 443.7465367,
      'Around Powai+rickshaw+movie': 76.8932,
      'Around Powai+cab+clubbing': 198.7483,
      'Temples in Mumbai+local': 34.7653,
      'Trek+local': 27.9573,
      'Trek+local+cab': 48.0828,
      'Sea-ferry+local': 167.63863
    },
    mealEmissionFactors: {
      'Vegan': 158.942,
      'Vegetarian': 112.862,
      'Pescatarian': 470.637,
      'Eggetarian': 158.812,
      'White Meat Diet': 486.237,
      'Red Meat Diet': 494.167
    }
  };

  // Outing emissions
  const outingEmissions = ((PARAMS.outingEmissionFactors[outingType] * nOutingsMonth) + (PARAMS.mealEmissionFactors[dietType] * nEatOutMonth)) / 365 + 1.4;

  // Electricity
  const elec = ((0.25 * nHostelNo) + (nCredits * 0.1) + (nTimeLabs * 0.23) + (nTimeLibrary * 0.37) + (nTimeGymkhana * 0.16));
  const s = ((0.82 * elec) + 0.3);

  // Water usage
  const totalwatertodrink = 3; // 3 liters per day for drinking
  const flowrate = 8; // 8 liters per minute for shower
  const actualshoweron = 0.7;
  const totalwatertoshower = (flowrate * nBathDuration * actualshoweron * nShowers) / 7; // Convert weekly to daily
  const noofflush = 7;
  const wateramount = 6; // 6 liters per flush (more realistic)
  const totalwatertoflush = noofflush * wateramount;
  
  // More realistic water footprint for food production (liters per day)
  const veganWater = 60, vegetarianWater = 70, pescatarianWater = 80, egetarianWater = 75, whiteMeatDietWater = 90, redMeatDietWater = 100;
  const totalwatertoeat = (
    dietType === "Vegan" ? veganWater : 
    dietType === "Vegetarian" ? vegetarianWater :
    dietType === "Pescatarian" ? pescatarianWater : 
    dietType === "Eggetarian" ? egetarianWater : 
    dietType === "White Meat Diet" ? whiteMeatDietWater : 
    dietType === "Red Meat Diet" ? redMeatDietWater : 
    60
  );
  const waterusage = totalwatertodrink + totalwatertoshower + totalwatertoflush + totalwatertoeat;

  // Waste calculation
  const vegan = 158.942;
  const vegetarian = 112.862;
  const pescatarian = 470.637;
  const egetarian = 158.812;
  const whiteMeatDiet = 486.237;
  const redMeatDiet = 494.167;
  const weight_spoon = 0.0025;
  const no_spoon = 2;
  const carton_weight_plastic = 0.02;
  const carton_weight_paper = 0.2;
  const carry_bag_weight = 0.006;
  const good_plastic_weight = 0.35;
  const wasteg = (((((weight_spoon * no_spoon) + carton_weight_plastic + carton_weight_paper + carry_bag_weight) * nFoodOrders) * 52) + ((good_plastic_weight * nEcommerce * 4)*12))/365 + 
    (
      dietType === "Vegan" ? vegan :
      dietType === "Vegetarian" ? vegetarian :
      dietType === "Pescatarian" ? pescatarian :
      dietType === "Eggetarian" ? egetarian :
      dietType === "White Meat Diet" ? whiteMeatDiet :
      dietType === "Red Meat Diet" ? redMeatDiet :
      0
    ) + 0.2;

  // Results before normalization
  const electricity = elec.toFixed(2);
  const scope2 = s.toFixed(2);
  const scope3 = (0 + (
    dietType === "Vegan" ? vegan :
    dietType === "Vegetarian" ? vegetarian :
    dietType === "Pescatarian" ? pescatarian :
    dietType === "Eggetarian" ? egetarian :
    dietType === "White Meat Diet" ? whiteMeatDiet :
    dietType === "Red Meat Diet" ? redMeatDiet :
    0
  )).toFixed(2);
  const outings = Number(outingEmissions);
  const totalCarbon = (s + outingEmissions + (0 + (
    dietType === "Vegan" ? vegan :
    dietType === "Vegetarian" ? vegetarian :
    dietType === "Pescatarian" ? pescatarian :
    dietType === "Eggetarian" ? egetarian :
    dietType === "White Meat Diet" ? whiteMeatDiet :
    dietType === "Red Meat Diet" ? redMeatDiet :
    0
  )) + 470);

  // Normalization for water and waste using observed ranges
  // Water: 25-150 L/day -> 25-150 L/day (no normalization needed, already realistic)
  // Waste: 100-600 kg/day -> 1-10 kg/day
  const rawWater = waterusage;
  const rawWaste = wasteg;
  const water = rawWater.toFixed(2); // No normalization needed, already in reasonable range
  const waste = normalize(rawWaste, 100, 600, 1, 10).toFixed(2);

  // Scores (higher is better)
  const carbonScore = scoreFromValue(totalCarbon, 500, 1500);
  const waterScore = scoreFromValue(rawWater, 50, 600); // Updated range for water score calculation
  const wasteScore = scoreFromValue(rawWaste, 100, 600);
  
  // Ensure all scores are valid numbers before calculating green score
  const carbonScoreNum = parseFloat(carbonScore) || 5.0;
  const waterScoreNum = parseFloat(waterScore) || 5.0;
  const wasteScoreNum = parseFloat(wasteScore) || 5.0;
  
  const greenScore = ((carbonScoreNum + waterScoreNum + wasteScoreNum) / 3).toFixed(2);

  return {
    electricity,
    scope2,
    scope3,
    outings: outings.toFixed(2),
    totalCarbon: totalCarbon.toFixed(2),
    water,
    waste,
    carbonScore,
    waterScore,
    wasteScore,
    greenScore
  };
}

function generateRecommendations(formData, results) {
  const recommendations = [];
  const greenScore = parseFloat(results.greenScore);
  
  // Energy recommendations (College-focused)
  if (formData.timeLabs > 8) {
    recommendations.push({
      category: "Energy", 
      icon: "🔬",
      title: "Lab Sustainability Practices",
      description: "Turn off lab equipment when not in use, coordinate with lab partners to share resources, and report any energy waste to lab supervisors."
    });
  }
  
  if (formData.timeLibrary > 8) {
    recommendations.push({
      category: "Energy",
      icon: "📚",
      title: "Study Space Efficiency",
      description: "Use natural lighting when possible, turn off lights in empty study rooms, and consider studying in groups to reduce overall energy usage."
    });
  }
  
  // Food recommendations (College-focused)
  if (formData.foodOrders > 10) {
    recommendations.push({
      category: "Food",
      icon: "🍽️",
      title: "Hostel Mess & Campus Dining",
      description: "Make better use of your hostel mess facilities. They're often more economical and generate less packaging waste than food delivery."
    });
  }
  
  // Transport recommendations (College-focused)
  if (formData.outingsMonth > 5) {
    recommendations.push({
      category: "Transport",
      icon: "🚗",
      title: "Campus Outing Optimization",
      description: "Plan your outings with friends to share cabs, use campus shuttle services when available, and combine multiple errands into single trips."
    });
  }
  
  if (formData.autoRides > 2) {
    recommendations.push({
      category: "Transport",
      icon: "🛺",
      title: "Campus Transportation",
      description: "Use campus shuttle services, walk between nearby buildings, or cycle around campus."
    });
  }
  
  if (formData.ecommerce > 2) {
    recommendations.push({
      category: "Transport",
      icon: "📦",
      title: "Smart Shopping Habits",
      description: "Coordinate online orders with roommates to reduce delivery trips."
    });
  }
  
  // Water recommendations (College-focused)
  if (formData.showers > 8) {
    recommendations.push({
      category: "Water",
      icon: "🚿",
      title: "Hostel Water Conservation",
      description: "Coordinate shower schedules with roommates, report any water leaks to hostel maintenance, and consider using a bucket bath."
    });
  }
  
  if (formData.bathDuration > 20) {
    recommendations.push({
      category: "Water",
      icon: "⏱️",
      title: "Efficient Bathing",
      description: "Set a timer for your showers, use the hostel's water-efficient facilities, and consider bucket baths which use significantly less water."
    });
  }
  
  // Score-based recommendations (College-focused)
  if (greenScore < 5) {
    recommendations.push({
      category: "General",
      icon: "📚",
      title: "Environmental Education",
      description: "Take advantage of environmental courses offered by your college, attend sustainability workshops, and learn about campus green initiatives."
    });
  }
  
  // Always ensure minimum 3 recommendations
  const baseRecommendations = [
    {
      category: "General",
      icon: "💡",
      title: "Energy Awareness",
      description: "Turn off lights and fans when leaving your room, unplug chargers when not in use, and use natural ventilation when possible."
    },
    {
      category: "General", 
      icon: "♻️",
      title: "Waste Management",
      description: "Use the hostel's recycling bins, avoid single-use plastics, and participate in campus waste segregation programs."
    },
    {
      category: "General",
      icon: "🚶",
      title: "Active Transportation",
      description: "Walk or cycle to nearby campus locations, use stairs instead of elevators, and encourage friends to join you for active commuting."
    }
  ];
  
  // If we have less than 3 recommendations, add from base recommendations
  if (recommendations.length < 3) {
    const needed = 3 - recommendations.length;
    recommendations.push(...baseRecommendations.slice(0, needed));
  }
  
  // Limit to maximum 6 recommendations
  return recommendations.slice(0, 6);
}

function RecommendationCard({ recommendation }) {
  return (
    <div style={{
      background: '#f8fff8',
      border: '1px solid rgba(139, 195, 74, 0.2)',
      borderRadius: 16,
      padding: '20px',
      marginBottom: 16,
      boxShadow: '0 2px 8px rgba(139,195,74,0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ fontSize: 24, marginTop: 2 }}>{recommendation.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: 16, 
            fontWeight: 700, 
            color: '#4CAF50', 
            marginBottom: 4 
          }}>
            {recommendation.title}
          </div>
          <div style={{ 
            fontSize: 14, 
            color: '#666', 
            lineHeight: 1.5 
          }}>
            {recommendation.description}
          </div>
        </div>
      </div>
    </div>
  );
}

const GREEN = '#BDD873';
const GREEN_DARK = '#8BC34A';

function ScorePill({ label, value, color, icon }) {
  return (
    <div style={{
      background: color || GREEN,
      color: '#222',
      borderRadius: 32,
      padding: '12px 32px',
      fontWeight: 700,
      fontSize: 22,
      margin: '0 12px',
      boxShadow: '0 2px 8px rgba(139,195,74,0.10)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: 120
    }}>
      <span style={{ fontSize: 28, marginBottom: 2 }}>{icon}</span>
      <span style={{ fontSize: 15, fontWeight: 500, color: '#4CAF50', marginBottom: 2 }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 800 }}>{value}</span>
    </div>
  );
}

function ResultPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calculateAndSetResults = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get form data from localStorage or URL params
        const formData = localStorage.getItem('questionnaireData');
        if (!formData) {
          setError('No questionnaire data found. Please complete the questionnaire first.');
          setLoading(false);
          return;
        }

        const parsedFormData = JSON.parse(formData);
        console.log('Parsed form data:', parsedFormData);
        
        // Ensure all required fields are present
        const sanitizedFormData = {
          hostelNo: parsedFormData.hostelNo || 1,
          credits: parsedFormData.credits || 0,
          timeLabs: parsedFormData.timeLabs || 0,
          timeLibrary: parsedFormData.timeLibrary || 0,
          timeGymkhana: parsedFormData.timeGymkhana || 0,
          dietType: parsedFormData.dietType || 'Vegan',
          foodOrders: parsedFormData.foodOrders || 0,
          autoRides: parsedFormData.autoRides || 0,
          outingsMonth: parsedFormData.outingsMonth || 0,
          eatOutMonth: parsedFormData.eatOutMonth || 0,
          partyingMonth: parsedFormData.partyingMonth || 0,
          shoppingMonth: parsedFormData.shoppingMonth || 0,
          outingType: parsedFormData.outingType || 'South Bombay+Cab+meal',
          showers: parsedFormData.showers || 0,
          bathDuration: parsedFormData.bathDuration || 1,
          ecommerce: parsedFormData.ecommerce || 0
        };
        
        console.log('Sanitized form data:', sanitizedFormData);
        
        // Calculate results using the calculateResults function
        let calculatedResults;
        try {
          calculatedResults = calculateResults(sanitizedFormData);
          console.log('Calculated results:', calculatedResults);
        } catch (calcError) {
          console.error('Error in calculateResults:', calcError);
          setError('Failed to calculate results. Please try again.');
          setLoading(false);
          return;
        }
        
        // Generate recommendations
        let recommendations;
        try {
          recommendations = generateRecommendations(sanitizedFormData, calculatedResults);
          console.log('Generated recommendations:', recommendations);
        } catch (recError) {
          console.error('Error in generateRecommendations:', recError);
          recommendations = [];
        }
        
        // Combine results and recommendations
        const finalResults = {
          ...calculatedResults,
          recommendations: recommendations
        };
        
        console.log('Final results:', finalResults);
        setResults(finalResults);

        // Save results to backend
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const response = await fetch(`${API_BASE_URL}/api/data`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(finalResults)
            });
            
            if (!response.ok) {
              console.error('Failed to save results to backend');
            } else {
              console.log('Results saved to backend successfully');
            }
          }
        } catch (saveError) {
          console.error('Error saving results to backend:', saveError);
        }
        
      } catch (err) {
        console.error('Error calculating results:', err);
        setError('Failed to calculate results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    calculateAndSetResults();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 40, padding: '20px' }}>Loading your results...</div>;
  }
  if (error) {
    return <div style={{ textAlign: 'center', marginTop: 40, color: 'red', padding: '20px' }}>{error}</div>;
  }
  if (!results) {
    return <div style={{ textAlign: 'center', marginTop: 40, padding: '20px' }}>No results found. Please complete the questionnaire first.</div>;
  }

  // Debug print
  // Remove this after confirming data structure
  // <pre>{JSON.stringify(results, null, 2)}</pre>

  const recommendations = results.recommendations || [];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '20px' }}>
      <div className="bg-overlay" style={{ borderRadius: 32, background: 'rgba(255,255,255,0.97)', boxShadow: '0 8px 32px rgba(139,195,74,0.10)', padding: '32px' }}>
        <img src={logo} alt="Logo" className="logo-small" />
        {/* Green Score Highlight */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: GREEN_DARK, marginBottom: 8 }}>Your Carbon Score</div>
          <div style={{
            background: results.greenScore >= 8 ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' : 
                       results.greenScore >= 5 ? 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)' : 
                       'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
            color: '#fff',
            borderRadius: '50%',
            width: 140,
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            fontWeight: 900,
            boxShadow: '0 4px 24px rgba(139,195,74,0.18)',
            marginBottom: 12,
            border: '6px solid #fff',
            position: 'relative',
          }}>
            <span style={{ zIndex: 1 }}>{results.greenScore || '0.0'}</span>
          </div>
          <div style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
            {results.greenScore >= 8 ? 'Excellent! Keep up the great work!' : 
             results.greenScore >= 5 ? 'Moderate. There\'s room for improvement.' : 
             'Needs improvement. Check out the recommendations below.'}
          </div>
        </div>
        {/* Subscores */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 36, flexWrap: 'wrap' }}>
          <ScorePill 
            label="Carbon Score" 
            value={results.carbonScore || '0.0'} 
            color={results.carbonScore >= 8 ? "#dcfce7" : results.carbonScore >= 5 ? "#fef3c7" : "#fee2e2"} 
            icon={<FaLeaf color={results.carbonScore >= 8 ? "#16a34a" : results.carbonScore >= 5 ? "#d97706" : "#dc2626"} />} 
          />
          <ScorePill 
            label="Water Score" 
            value={results.waterScore || '0.0'} 
            color={results.waterScore >= 8 ? "#dbeafe" : results.waterScore >= 5 ? "#fef3c7" : "#fee2e2"} 
            icon={<FaTint color={results.waterScore >= 8 ? "#2563eb" : results.waterScore >= 5 ? "#d97706" : "#dc2626"} />} 
          />
          <ScorePill 
            label="Waste Score" 
            value={results.wasteScore || '0.0'} 
            color={results.wasteScore >= 8 ? "#fef3c7" : results.wasteScore >= 5 ? "#fef3c7" : "#fee2e2"} 
            icon={<FaRecycle color={results.wasteScore >= 8 ? "#f59e0b" : results.wasteScore >= 5 ? "#d97706" : "#dc2626"} />} 
          />
        </div>
        {/* Details Section */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: GREEN_DARK, marginBottom: 12 }}>Breakdown</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 18, background: 'rgba(255,255,255,0.95)', borderRadius: 16, boxShadow: '0 2px 8px rgba(139,195,74,0.06)' }}>
              <tbody>
                <tr style={{ background: '#F5F5F5', color: '#222', fontWeight: 700 }}>
                  <td style={{ padding: '12px 16px', borderRadius: '16px 0 0 0' }}>Metric</td>
                  <td style={{ padding: '12px 16px', borderRadius: '0 16px 0 0' }}>Value</td>
                </tr>
                <tr><td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}><FaBolt color="#8BC34A" />Electricity Used</td><td style={{ padding: '10px 16px' }}>{results.electricity || '0.0'} kWh/day</td></tr>
                <tr><td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}><FaCloud color="#607D8B" />Scope-2 Emissions</td><td style={{ padding: '10px 16px' }}>{results.scope2 || '0.0'} kgCO₂e/day</td></tr>
                <tr><td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}><FaCloud color="#90A4AE" />Scope-3 Emissions</td><td style={{ padding: '10px 16px' }}>{results.scope3 || '0.0'} kgCO₂e/day</td></tr>
                <tr><td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}><FaWalking color="#4CAF50" />Outing Emissions</td><td style={{ padding: '10px 16px' }}>{results.outings || '0.0'} kgCO₂e/day</td></tr>
                <tr><td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}><FaLeaf color="#388E3C" />Total Carbon Footprint</td><td style={{ padding: '10px 16px' }}>{results.totalCarbon || '0.0'} kgCO₂e/day</td></tr>
                <tr><td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}><FaWater color="#039BE5" />Water Usage</td><td style={{ padding: '10px 16px' }}>{results.water || '0.0'} L/day</td></tr>
                <tr><td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}><FaTrash color="#FBC02D" />Waste Generation</td><td style={{ padding: '10px 16px' }}>{results.waste || '0.0'} kg/day</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Recommendations Section */}
        <div style={{ marginTop: 32, marginBottom: 32 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: GREEN_DARK, marginBottom: 12 }}>Personalized Recommendations</div>
          {recommendations && recommendations.length > 0 ? (
            recommendations.map((recommendation, index) => (
              <RecommendationCard key={index} recommendation={recommendation} />
            ))
          ) : (
            <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No recommendations available.</div>
          )}
        </div>
        <div style={{ fontSize: 16, color: '#666', marginTop: 24, textAlign: 'center' }}>
          <b>What does this mean?</b> The Carbon Score is an average of your Carbon, Water, and Waste scores. Higher scores (8-10) indicate excellent environmental practices, moderate scores (5-7) show room for improvement, and lower scores (1-4) suggest significant changes are needed.
        </div>
        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 40 }}>
          <button
            onClick={() => navigate('/questionnaire')}
            style={{
              background: 'linear-gradient(90deg, #8BC34A 0%, #4CAF50 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: 18,
              boxShadow: '0 4px 16px rgba(139,195,74,0.15)',
              padding: '12px 24px',
              borderRadius: 999,
              letterSpacing: 1,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Calculate Again
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'transparent',
              color: '#666',
              border: '2px solid #ddd',
              fontWeight: 600,
              fontSize: 18,
              padding: '12px 24px',
              borderRadius: 999,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
