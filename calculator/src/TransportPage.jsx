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
            <StyledSlider label="Outings/Month" min={0} max={31} value={form.outingsMonth} onChange={handleChange} name="outingsMonth" valueLabel={form.outingsMonth + ' outings'} />
            <StyledSlider label="Eating Out/Month" min={0} max={31} value={form.eatOutMonth} onChange={handleChange} name="eatOutMonth" valueLabel={form.eatOutMonth + ' times'} />
            <StyledSlider label="Partying/Clubbing/Month" min={0} max={31} value={form.partyingMonth} onChange={handleChange} name="partyingMonth" valueLabel={form.partyingMonth + ' times'} />
            <StyledSlider label="Shopping Trips/Month" min={0} max={31} value={form.shoppingMonth} onChange={handleChange} name="shoppingMonth" valueLabel={form.shoppingMonth + ' trips'} />
            <StyledSlider label="Auto Rickshaw Rides/Day" min={0} max={50} value={form.autoRides} onChange={handleChange} name="autoRides" valueLabel={form.autoRides + ' rides'} />
            <StyledSlider label="E-commerce Orders/Month" min={0} max={100} value={form.ecommerce} onChange={handleChange} name="ecommerce" valueLabel={form.ecommerce + ' orders'} />
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