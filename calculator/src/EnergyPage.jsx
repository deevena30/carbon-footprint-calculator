import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';

const HOSTEL_MIN = 1;
const HOSTEL_MAX = 21;
const HOSTELS_PER_PAGE = 7; // Increased from 5 to show more hostels at once
const GREEN = '#BDD873';
const GREEN_DARK = '#8BC34A';

function HostelSelector({ value, onChange }) {
  const [start, setStart] = useState(1);
  
  // Responsive hostel display - more on desktop, fewer on mobile
  const isMobile = window.innerWidth <= 700;
  const hostelsPerPage = isMobile ? 5 : HOSTELS_PER_PAGE;
  
  const end = Math.min(start + hostelsPerPage - 1, HOSTEL_MAX);
  const canPrev = start > HOSTEL_MIN;
  const canNext = end < HOSTEL_MAX;
  const hostels = [];
  for (let i = start; i <= end; i++) hostels.push(i);
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, justifyContent: 'center' }}>
      <button type="button" onClick={() => setStart(Math.max(HOSTEL_MIN, start - hostelsPerPage))} disabled={!canPrev} style={{ background: 'none', border: 'none', fontSize: 28, color: canPrev ? GREEN_DARK : '#ccc', cursor: canPrev ? 'pointer' : 'default' }}>&lt;</button>
      {hostels.map(num => (
        <button
          key={num}
          type="button"
          onClick={() => onChange(num)}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: value === num ? GREEN : '#e6e6e6',
            color: value === num ? '#222' : '#666',
            fontWeight: 700,
            fontSize: 20,
            border: 'none',
            margin: '0 2px',
            boxShadow: value === num ? '0 2px 8px rgba(139,195,74,0.15)' : 'none',
            cursor: 'pointer',
            transition: 'background 0.15s, color 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          {num}
        </button>
      ))}
      <button type="button" onClick={() => setStart(Math.min(HOSTEL_MAX - hostelsPerPage + 1, start + hostelsPerPage))} disabled={!canNext} style={{ background: 'none', border: 'none', fontSize: 28, color: canNext ? GREEN_DARK : '#ccc', cursor: canNext ? 'pointer' : 'default' }}>&gt;</button>
    </div>
  );
}

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
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 20, marginTop: 4, fontStyle: 'italic' }}>{valueLabel || (value + ' hours')}</div>
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

export default function EnergyPage({ onNext, formData }) {
  const [form, setForm] = useState({
    hostelNo: formData.hostelNo || 1,
    credits: formData.credits || 0,
    timeLabs: formData.timeLabs || 0,
    timeLibrary: formData.timeLibrary || 0,
    timeGymkhana: formData.timeGymkhana || 0
  });
  const navigate = useNavigate();

  const handleSlider = e => setForm({ ...form, [e.target.name]: Number(e.target.value) });
  const handleHostel = num => setForm({ ...form, hostelNo: num });
  const handleOption = e => setForm({ ...form, [e.target.name]: Number(e.target.value) });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) onNext(form);
    navigate('/food');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <img src={logo} alt="Logo" className="logo-small" />
      <div className="bg-overlay">
        <h2 style={{ fontSize: 36, fontWeight: 700, marginTop: 24, marginBottom: 32, textAlign: 'center' }}>Energy</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>In which hostel do you live?</div>
          <HostelSelector value={form.hostelNo} onChange={handleHostel} />
          <StyledSlider label="Credits taken" min={0} max={54} value={form.credits} onChange={handleSlider} name="credits" valueLabel={form.credits + ' credits'} />
          <OptionButtonGroup label="Time in Labs (hours/week)" name="timeLabs" value={form.timeLabs} onChange={handleOption} options={[{label:'0',value:0},{label:'1–5',value:3},{label:'6–10',value:8},{label:'11+',value:13}]} />
          <OptionButtonGroup label="Time in Library (hours/week)" name="timeLibrary" value={form.timeLibrary} onChange={handleOption} options={[{label:'0',value:0},{label:'1–5',value:3},{label:'6–10',value:8},{label:'11+',value:13}]} />
          <OptionButtonGroup label="Time in Gymkhana (hours/week)" name="timeGymkhana" value={form.timeGymkhana} onChange={handleOption} options={[{label:'0',value:0},{label:'1–5',value:3},{label:'6–10',value:8},{label:'11+',value:13}]} />
          <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
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
                flex: 1,
              }}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 