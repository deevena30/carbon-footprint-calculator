import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';

const HOSTEL_MIN = 1;
const HOSTEL_MAX = 18;
const HOSTELS_PER_PAGE = 5;
const GREEN = '#BDD873';
const GREEN_DARK = '#8BC34A';

function HostelSelector({ value, onChange }) {
  const [start, setStart] = useState(1);
  const end = Math.min(start + HOSTELS_PER_PAGE - 1, HOSTEL_MAX);
  const canPrev = start > HOSTEL_MIN;
  const canNext = end < HOSTEL_MAX;
  const hostels = [];
  for (let i = start; i <= end; i++) hostels.push(i);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, justifyContent: 'center' }}>
      <button type="button" onClick={() => setStart(Math.max(HOSTEL_MIN, start - HOSTELS_PER_PAGE))} disabled={!canPrev} style={{ background: 'none', border: 'none', fontSize: 28, color: canPrev ? GREEN_DARK : '#ccc', cursor: canPrev ? 'pointer' : 'default' }}>&lt;</button>
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
      <button type="button" onClick={() => setStart(Math.min(HOSTEL_MAX - HOSTELS_PER_PAGE + 1, start + HOSTELS_PER_PAGE))} disabled={!canNext} style={{ background: 'none', border: 'none', fontSize: 28, color: canNext ? GREEN_DARK : '#ccc', cursor: canNext ? 'pointer' : 'default' }}>&gt;</button>
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

export default function EnergyPage({ onNext }) {
  const [form, setForm] = useState({
    hostelNo: 1,
    credits: 0,
    timeLabs: 0,
    timeLibrary: 0,
    timeGymkhana: 0
  });
  const navigate = useNavigate();

  const handleSlider = e => setForm({ ...form, [e.target.name]: Number(e.target.value) });
  const handleHostel = num => setForm({ ...form, hostelNo: num });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) onNext(form);
    navigate('/food');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <img src={logo} alt="Logo" className="logo-small" style={{ borderRadius: 0, background: 'none', boxShadow: 'none' }} />
      <div className="bg-overlay" style={{ maxWidth: 420, margin: '48px auto', padding: '40px 16px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginTop: 24, marginBottom: 32, textAlign: 'center' }}>Energy</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>In which hostel do you live?</div>
          <HostelSelector value={form.hostelNo} onChange={handleHostel} />
          <StyledSlider label="Credits taken" min={0} max={100} value={form.credits} onChange={handleSlider} name="credits" valueLabel={form.credits + ' credits'} />
          <StyledSlider label="Time in Labs (hours/week)" min={0} max={168} value={form.timeLabs} onChange={handleSlider} name="timeLabs" />
          <StyledSlider label="Time in Library (hours/week)" min={0} max={168} value={form.timeLibrary} onChange={handleSlider} name="timeLibrary" />
          <StyledSlider label="Time in Gymkhana (hours/week)" min={0} max={168} value={form.timeGymkhana} onChange={handleSlider} name="timeGymkhana" />
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
              width: '100%',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
} 