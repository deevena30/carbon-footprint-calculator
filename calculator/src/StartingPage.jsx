import React from 'react';
import logo from './assets/logo.png';

export default function StartingPage({ onStart }) {
  return (
    <div className="starting-page bg-cover bg-center h-screen overflow-hidden flex flex-col justify-center items-center px-4 py-6 font-poppins">
      <div className="bg-overlay" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        {/* Top: Logo */}
        <div>
          <img src={logo} alt="Logo" style={{ width: 180, height: 180, borderRadius: 0, boxShadow: 'none', background: 'none' }} />
        </div>
        {/* Info box + Headings */}
        <div className="flex flex-col items-center space-y-6" style={{ width: '100%' }}>
          {/* Info box */}
          <div
            style={{ color: '#222', marginBottom: 24, fontSize: 22, fontWeight: 500, textAlign: 'center' }}
            className="lg:text-[22px] md:text-[20px] text-[18px]"
          >
            Our world is in crisis – from climate change to the pollution in our oceans and devastation of our forests.<br/>
            It’s up to all of us to fix it. Take your first step with our campus-based environmental footprint calculator.
          </div>
          {/* Headings */}
          <div className="text-center">
            <p style={{ fontSize: 32, fontWeight: 700, color: '#222' }} className="font-bold font-raleway">What is your</p>
            <h1 className="text-[40px] md:text-[56px] lg:text-[72px] font-bold text-black font-raleway leading-tight">
              Environmental <br /> Footprint?
            </h1>
          </div>
        </div>
        {/* Button: Moved up, more stylish */}
        <button
          style={{
            background: 'linear-gradient(90deg, #8BC34A 0%, #4CAF50 100%)',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            fontSize: 26,
            boxShadow: '0 6px 24px rgba(76,175,80,0.18)',
            padding: '22px 64px',
            borderRadius: 999,
            letterSpacing: 1,
            marginTop: 16,
            marginBottom: 0,
            cursor: 'pointer',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          className="font-poppins get-started-btn"
          onClick={onStart}
          onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(76,175,80,0.22)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(76,175,80,0.18)'; }}
        >
          Get started
        </button>
      </div>
    </div>
  );
}
