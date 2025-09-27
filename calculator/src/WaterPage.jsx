import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';

const GREEN = '#BDD873';
const GREEN_DARK = '#8BC34A';

function StyledSlider({ label, min, max, value, onChange, name, valueLabel }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 0 }}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          name={name}
          onChange={onChange}
          style={{ flex: 1, margin: '0 16px', accentColor: GREEN_DARK }}
        />
      </div>
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 20, marginTop: 4, fontStyle: 'italic' }}>{valueLabel || value}</div>
    </div>
  );
}

function OptionButtonGroup({ label, name, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{label}</div>
      <div className="option-group">
        {options.map(opt => (
          <button
            type="button"
            key={opt.value}
            className={`option-btn${value === opt.value ? ' selected' : ''}`}
            onClick={() => onChange({ target: { name, value: opt.value } })}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function WaterPage({ onNext, formData }) {
  const [form, setForm] = useState({
    showers: formData.showers || 0,
    bathDuration: formData.bathDuration || 1
  });
  const [isResponsible, setIsResponsible] = useState(false);
  const navigate = useNavigate();

  const handleSlider = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: Number(value) });
  };
  const handleOption = e => setForm({ ...form, [e.target.name]: Number(e.target.value) });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isResponsible) {
      alert('Please confirm your responsibility statement before proceeding.');
      return;
    }
    if (onNext) onNext(form);
    navigate('/results');
  };

  const handleBack = () => {
    navigate('/transport');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="bg-overlay">
        <img src={logo} alt="Logo" className="logo-small" />
        <h2 style={{ fontSize: 36, fontWeight: 700, marginTop: 24, marginBottom: 32, textAlign: 'center' }}>Water</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <div style={{ width: '100%', maxWidth: 600 }}>
            <OptionButtonGroup label="Showers/Week" name="showers" value={form.showers} onChange={handleOption} options={[{label:'0',value:0},{label:'1–5',value:3},{label:'6–10',value:8},{label:'11+',value:13}]} />
            <StyledSlider label="Bath Duration (minutes)" min={1} max={45} value={form.bathDuration} onChange={handleSlider} name="bathDuration" valueLabel={form.bathDuration + ' min'} />
          </div>
          
          {/* Responsibility Statement */}
          <div style={{ 
            width: '100%', 
            maxWidth: 600, 
            marginTop: 32,
            padding: '20px',
            background: 'rgba(139, 195, 74, 0.05)',
            border: '2px solid rgba(139, 195, 74, 0.2)',
            borderRadius: 16,
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <input
                type="checkbox"
                id="responsibility"
                checked={isResponsible}
                onChange={(e) => setIsResponsible(e.target.checked)}
                style={{
                  width: 20,
                  height: 20,
                  marginTop: 2,
                  accentColor: GREEN_DARK,
                  cursor: 'pointer'
                }}
                required
              />
              <label 
                htmlFor="responsibility"
                style={{
                  fontSize: 15,
                  color: '#333',
                  lineHeight: 1.5,
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                As a responsible citizen, I acknowledge my responsibility towards our planet and confirm that all the information I have provided in this calculator is accurate to the best of my knowledge. I understand the importance of environmental awareness and commit to making sustainable choices.
              </label>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 16, marginTop: 32, width: '100%', maxWidth: 600 }}>
            <button
              type="button"
              onClick={handleBack}
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
                flex: 1,
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#333'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#666'; }}
            >
              Back
            </button>
            <button
              type="submit"
              style={{
                background: isResponsible ? 'linear-gradient(90deg, #8BC34A 0%, #4CAF50 100%)' : '#ccc',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: 18,
                boxShadow: isResponsible ? '0 4px 16px rgba(139,195,74,0.15)' : 'none',
                padding: '12px 24px',
                borderRadius: 999,
                letterSpacing: 1,
                cursor: isResponsible ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
                flex: 1,
              }}
            >
              See Results
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 