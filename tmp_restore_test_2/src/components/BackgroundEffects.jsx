import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';

const BackgroundEffects = () => {
  const { temp, condition } = useWeather();

  return (
    <div className="bg-decor" style={{ 
      zIndex: -1,
      background: `linear-gradient(rgba(12, 14, 18, 0.85), rgba(12, 14, 18, 0.95)), url('/images/garage-bg.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="pulsing-logo" style={{ pointerEvents: 'none', opacity: 0.1, top: '40%' }}>
        <span style={{ color: 'rgba(59, 130, 246, 0.4)', fontWeight: '900', fontFamily: "'Oswald', sans-serif" }}>ESTÉTICA</span>
      </div>
      
      {/* Olofotes / Spotlights ✨ */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '20%',
        width: '2px',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.2), transparent)',
        boxShadow: '0 0 40px 10px rgba(59, 130, 246, 0.1)',
        transform: 'rotate(-5deg)',
        opacity: 0.6
      }}></div>

      <div style={{
        position: 'absolute',
        top: '0',
        right: '25%',
        width: '3px',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.15), transparent)',
        boxShadow: '0 0 50px 15px rgba(59, 130, 246, 0.08)',
        transform: 'rotate(8deg)',
        opacity: 0.5
      }}></div>

      {/* Brilho de oficina premium */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
        filter: 'blur(60px)',
        transform: 'translateX(-50%)',
        borderRadius: '50%'
      }}></div>
    </div>
  );
};

export default BackgroundEffects;
