import React, { createContext, useContext, useState, useEffect } from 'react';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState({ temp: '--', condition: 'sol' });

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        const temp = Math.round(data.current_weather.temperature);
        const code = data.current_weather.weathercode;
        
        let condition = 'sol';
        if ([1, 2, 3].includes(code)) condition = 'nublado';
        else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) condition = 'chuva';
        else if ([71, 73, 75, 77, 85, 86].includes(code)) condition = 'neve';
        
        setWeather({ temp, condition });
      } catch (e) {
        console.error("Erro ao buscar clima", e);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(-23.5505, -46.6333) // Default SP
      );
    }
  }, []);

  return (
    <WeatherContext.Provider value={weather}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);
