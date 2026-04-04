import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Agendamentos from './pages/Agendamentos';
import Clientes from './pages/Clientes';
import Catalogo from './pages/Catalogo';
import Estoque from './pages/Estoque';
import Financeiro from './pages/Financeiro';
import Login from './pages/Login';
import BackgroundEffects from './components/BackgroundEffects';
import Settings from './pages/Settings';
import { WeatherProvider } from './context/WeatherContext';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('valenUser');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Erro ao carregar usuário", e);
      return null;
    }
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('valenUser', JSON.stringify(userData));
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <WeatherProvider>
      <DataProvider>
      <BackgroundEffects />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="agenda" element={<Agendamentos />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="catalogo" element={<Catalogo />} />
            <Route path="estoque" element={<Estoque />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="configuracoes" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </DataProvider>
    </WeatherProvider>
  );
}

export default App;
