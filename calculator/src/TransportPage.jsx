import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';

const GREEN = '#BDD873';
const GREEN_DARK = '#8BC34A';

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

export default function TransportPage({ onNext }) {
  const [form, setForm] = useState({
    outingsMonth: 0,
    eatOutMonth: 0,
    partyingMonth: 0,
    shoppingMonth: 0,
    outingType: '',
    autoRides: 0,
    ecommerce: 0
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: ['outingsMonth','eatOutMonth','partyingMonth','shoppingMonth','autoRides','ecommerce'].includes(name) ? Number(value) : value });
  };
  const handleOption = e => setForm({ ...form, [e.target.name]: Number(e.target.value) });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) onNext(form);
    navigate('/water');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <img src={logo} alt="Logo" className="logo-small" style={{ borderRadius: 0, background: 'none', boxShadow: 'none' }} />
      <div className="bg-overlay" style={{ maxWidth: 800, margin: '48px auto', padding: '48px 32px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginTop: 24, marginBottom: 32, textAlign: 'center' }}>Transport</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8, alignSelf: 'center', textAlign: 'center' }}>Usual Outing Type</div>
          <select
            name="outingType"
            required
            value={form.outingType}
            onChange={handleChange}
            style={{
              width: '100%',
              maxWidth: 500,
              padding: '18px 24px',
              fontSize: 20,
              borderRadius: 24,
              border: `2px solid ${GREEN_DARK}`,
              background: '#f8fff8',
              color: form.outingType ? '#222' : '#888',
              fontWeight: 600,
              marginBottom: 32,
              outline: 'none',
              appearance: 'none',
              boxShadow: '0 2px 8px rgba(139,195,74,0.08)',
              cursor: 'pointer',
              transition: 'border 0.2s',
              alignSelf: 'center',
              display: 'block',
            }}
          >
            <option value="" disabled>Select outing type</option>
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
          <div style={{ width: '100%', maxWidth: 500 }}>
            <OptionButtonGroup label="Outings/Month" name="outingsMonth" value={form.outingsMonth} onChange={handleOption} options={[{label:'0',value:0},{label:'1–3',value:2},{label:'4–6',value:5},{label:'7+',value:8}]} />
            <OptionButtonGroup label="Eating Out/Month" name="eatOutMonth" value={form.eatOutMonth} onChange={handleOption} options={[{label:'0',value:0},{label:'1–3',value:2},{label:'4–6',value:5},{label:'7+',value:8}]} />
            <OptionButtonGroup label="Partying/Clubbing/Month" name="partyingMonth" value={form.partyingMonth} onChange={handleOption} options={[{label:'0',value:0},{label:'1–3',value:2},{label:'4–6',value:5},{label:'7+',value:8}]} />
            <OptionButtonGroup label="Shopping Trips/Month" name="shoppingMonth" value={form.shoppingMonth} onChange={handleOption} options={[{label:'0',value:0},{label:'1–3',value:2},{label:'4–6',value:5},{label:'7+',value:8}]} />
            <OptionButtonGroup label="Auto Rickshaw Rides/Day" name="autoRides" value={form.autoRides} onChange={handleOption} options={[{label:'0',value:0},{label:'1–3',value:2},{label:'4–6',value:5},{label:'7+',value:8}]} />
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
            Next
          </button>
        </form>
      </div>
    </div>
  );
} 