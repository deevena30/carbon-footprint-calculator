import React from 'react';
import logo from './assets/logo.png';
import { FaLeaf, FaTint, FaRecycle, FaTrophy, FaBolt, FaCloud, FaWalking, FaWater, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
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
    }}>
      {children}
    </img>
  );
}

function normalize(value, min, max, newMin, newMax) {
  const clamped = Math.max(min, Math.min(max, value));
  return ((clamped - min) / (max - min)) * (newMax - newMin) + newMin;
}

function scoreFromValue(value, min, max) {
  // Higher value = lower score, so invert
  const normalized = (value - min) / (max - min);
  const score = 10 - normalized * 9; // 10 (best) to 1 (worst)
  return Math.max(1, Math.min(10, score.toFixed(2)));
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
      'Egetarian': 158.812,
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
  const totalwatertodrink = 35;
  const flowrate  = 6;
  const actualshoweron = 0.7;
  const totalwatertoshower = flowrate * nBathDuration * actualshoweron * nShowers;
  const noofflush = 7;
  const wateramount = 40;
  const totalwatertoflush = noofflush * wateramount;
  const veganWater = 1000, vegetarianWater = 1200, pescatarianWater = 1300, egetarianWater = 1400, whiteMeatDietWater = 1500, redMeatDietWater = 1600;
  const totalwatertoeat = 7 * (
    dietType === "Vegan" ? veganWater : 
    dietType === "Vegetarian" ? vegetarianWater :
    dietType === "Pescatarian" ? pescatarianWater : 
    dietType === "Egetarian" ? egetarianWater : 
    dietType === "White Meat Diet" ? whiteMeatDietWater : 
    dietType === "Red Meat Diet" ? redMeatDietWater : 
    0
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
      dietType === "Egetarian" ? egetarian :
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
    dietType === "Egetarian" ? egetarian :
    dietType === "White Meat Diet" ? whiteMeatDiet :
    dietType === "Red Meat Diet" ? redMeatDiet :
    0
  )).toFixed(2);
  const outings = Number(outingEmissions);
  const totalCarbon = (s + outingEmissions + (0 + (
    dietType === "Vegan" ? vegan :
    dietType === "Vegetarian" ? vegetarian :
    dietType === "Pescatarian" ? pescatarian :
    dietType === "Egetarian" ? egetarian :
    dietType === "White Meat Diet" ? whiteMeatDiet :
    dietType === "Red Meat Diet" ? redMeatDiet :
    0
  )) + 470);

  // Normalization for water and waste using observed ranges
  // Water: 6000-20000 L/day -> 200-700 L/day
  // Waste: 100-600 kg/day -> 1-10 kg/day
  const rawWater = waterusage;
  const rawWaste = wasteg;
  const water = normalize(rawWater, 6000, 20000, 200, 700).toFixed(2);
  const waste = normalize(rawWaste, 100, 600, 1, 10).toFixed(2);

  // Scores (higher is better)
  const carbonScore = scoreFromValue(totalCarbon, 500, 1500);
  const waterScore = scoreFromValue(rawWater, 6000, 20000);
  const wasteScore = scoreFromValue(rawWaste, 100, 600);
  const greenScore = ((parseFloat(carbonScore) + parseFloat(waterScore) + parseFloat(wasteScore)) / 3).toFixed(2);

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

function ResultPage({ formData }) {
  const results = calculateResults(formData);
  const navigate = useNavigate();
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <img src={logo} alt="Logo" className="logo-small" style={{ borderRadius: 0, background: 'none', boxShadow: 'none', position: 'absolute', top: 24, left: 24, width: 64 }} />
      <div className="bg-overlay" style={{ maxWidth: 800, margin: '48px auto', padding: '48px 32px', borderRadius: 32, background: 'rgba(255,255,255,0.97)', boxShadow: '0 8px 32px rgba(139,195,74,0.10)' }}>
        {/* Green Score Highlight */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: GREEN_DARK, marginBottom: 8 }}>Your Green Score</div>
          <div style={{
            background: 'linear-gradient(90deg, #8BC34A 0%, #4CAF50 100%)',
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
            <span style={{ zIndex: 1 }}>{results.greenScore}</span>
          </div>
        </div>
        {/* Subscores */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 36, flexWrap: 'wrap' }}>
          <ScorePill label="Carbon Score" value={results.carbonScore} color="#E8F5E9" icon={<FaLeaf color="#388E3C" />} />
          <ScorePill label="Water Score" value={results.waterScore} color="#E3F2FD" icon={<FaTint color="#039BE5" />} />
          <ScorePill label="Waste Score" value={results.wasteScore} color="#FFFDE7" icon={<FaRecycle color="#FBC02D" />} />
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
                <tr><td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}><FaBolt color="#8BC34A" />Electricity Used</td><td style={{ padding: '10px 16px' }}>{results.electricity} kWh/day</td></tr>
                <tr><td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}><FaCloud color="#607D8B" />Scope-2 Emissions</td><td style={{ padding: '10px 16px' }}>{results.scope2} kgCO₂e/day</td></tr>
                <tr><td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}><FaCloud color="#90A4AE" />Scope-3 Emissions</td><td style={{ padding: '10px 16px' }}>{results.scope3} kgCO₂e/day</td></tr>
                <tr><td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}><FaWalking color="#4CAF50" />Outing Emissions</td><td style={{ padding: '10px 16px' }}>{results.outings} kgCO₂e/day</td></tr>
                <tr><td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}><FaLeaf color="#388E3C" />Total Carbon Footprint</td><td style={{ padding: '10px 16px' }}>{results.totalCarbon} kgCO₂e/day</td></tr>
                <tr><td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}><FaWater color="#039BE5" />Water Usage</td><td style={{ padding: '10px 16px' }}>{results.water} L/day</td></tr>
                <tr><td style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}><FaTrash color="#FBC02D" />Waste Generation</td><td style={{ padding: '10px 16px' }}>{results.waste} kg/day</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ fontSize: 16, color: '#666', marginTop: 24, textAlign: 'center' }}>
          <b>What does this mean?</b> The Green Score is an average of your Carbon, Water, and Waste scores. Higher is better! Each score is based on your daily habits and resource usage.
        </div>
        {/* Calculate Again Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(90deg, #8BC34A 0%, #4CAF50 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              fontSize: 22,
              boxShadow: '0 4px 16px rgba(139,195,74,0.15)',
              padding: '16px 0',
              borderRadius: 999,
              letterSpacing: 1,
              width: 300,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Calculate Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
