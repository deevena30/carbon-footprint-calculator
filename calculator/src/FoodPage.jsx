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

export default function FoodPage({ onNext }) {
  const [form, setForm] = useState({
    dietType: '',
    foodOrders: 0
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'foodOrders' ? Number(value) : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) onNext(form);
    navigate('/transport');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <img src={logo} alt="Logo" className="logo-small" style={{ borderRadius: 0, background: 'none', boxShadow: 'none' }} />
      <div className="bg-overlay" style={{ maxWidth: 800, margin: '48px auto', padding: '48px 32px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginTop: 24, marginBottom: 32, textAlign: 'center' }}>Food</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8, alignSelf: 'center', textAlign: 'center' }}>Daily Diet</div>
          <select
            name="dietType"
            required
            value={form.dietType}
            onChange={handleChange}
            style={{
              width: '100%',
              maxWidth: 500,
              padding: '18px 24px',
              fontSize: 20,
              borderRadius: 24,
              border: `2px solid ${GREEN_DARK}`,
              background: '#f8fff8',
              color: form.dietType ? '#222' : '#888',
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
            <option value="" disabled>Select your diet</option>
            <option value="Vegan">Vegan</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Pescatarian">Pescatarian</option>
            <option value="Eggetarian">Eggetarian</option>
            <option value="White Meat Diet">White Meat Diet</option>
            <option value="Red Meat Diet">Red Meat Diet</option>
          </select>
          <div style={{ width: '100%', maxWidth: 500 }}>
            <StyledSlider label="Food Orders/Week" min={0} max={21} value={form.foodOrders} onChange={handleChange} name="foodOrders" valueLabel={form.foodOrders + ' orders'} />
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