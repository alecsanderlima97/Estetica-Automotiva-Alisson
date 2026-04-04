import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';

const BackgroundEffects = () => {
  const { temp, condition } = useWeather();

  return (
    <div className="bg-decor" style={{ zIndex: -1 }}>
      <div className="pulsing-logo" style={{ pointerEvents: 'none' }}>
        <span style={{ color: 'rgba(0, 123, 255, 0.1)', fontWeight: '900' }}>O</span>
        <span style={{ color: 'rgba(255,255,255,0.02)' }}>rquestra</span>
        <span style={{ color: 'rgba(255,255,255,0.03)' }}>cs</span>
      </div>
      
      {/* Pétalas de Sakura Animadas */}
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="sakura" 
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 6 + 3}px`,
            animationDuration: `${Math.random() * 12 + 8}s, ${Math.random() * 4 + 2}s`,
            animationDelay: `${Math.random() * 15}s`,
            opacity: Math.random() * 0.3 + 0.2,
            pointerEvents: 'none'
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundEffects;
