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

export default function WaterPage({ onNext }) {
  const [form, setForm] = useState({
    showers: 0,
    bathDuration: 1
  });
  const navigate = useNavigate();

  const handleSlider = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: Number(value) });
  };
  const handleOption = e => setForm({ ...form, [e.target.name]: Number(e.target.value) });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) onNext(form);
    navigate('/results');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <img src={logo} alt="Logo" className="logo-small" style={{ borderRadius: 0, background: 'none', boxShadow: 'none' }} />
      <div className="bg-overlay" style={{ maxWidth: 800, margin: '48px auto', padding: '48px 32px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginTop: 24, marginBottom: 32, textAlign: 'center' }}>Water</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <div style={{ width: '100%', maxWidth: 500 }}>
            <OptionButtonGroup label="Showers/Week" name="showers" value={form.showers} onChange={handleOption} options={[{label:'0',value:0},{label:'1–5',value:3},{label:'6–10',value:8},{label:'11+',value:13}]} />
            <StyledSlider label="Bath Duration (minutes)" min={1} max={45} value={form.bathDuration} onChange={handleSlider} name="bathDuration" valueLabel={form.bathDuration + ' min'} />
          </div>
          <button
            type="submit"
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
              marginTop: 32,
              width: 300,
              cursor: 'pointer',
              transition: 'background 0.2s',
              alignSelf: 'center',
            }}
          >
            See Results
          </button>
        </form>
      </div>
    </div>
  );
} 