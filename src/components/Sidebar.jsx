import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  Car, 
  Droplets, 
  Sparkles, 
  DollarSign, 
  Settings, 
  Calculator as CalcIcon 
} from 'lucide-react';
import { useData } from '../context/DataContext';

const Sidebar = ({ isOpen, onClose, onToggleCalculator }) => {
  const { userProfile } = useData();
  const location = useLocation();

  const handleNavLinkClick = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand-title" style={{ fontFamily: 'Oswald, sans-serif', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'left' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', opacity: 0.9 }}>
          <span style={{ color: '#3b82f6', fontWeight: '900', fontSize: '24px', lineHeight: '1.2' }}>Alisson</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 'bold', fontSize: '14px', marginTop: '-4px' }}>Estética Automotiva</span>
        </div>
        <div style={{ fontSize: '9px', color: '#666', marginTop: '2px', fontWeight: '800', textTransform: 'uppercase', opacity: 0.7 }}>
          Detailing & Performance
        </div>
      </div>
      
      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} onClick={handleNavLinkClick} end>
          <LayoutDashboard size={20} />
          <span>Painel Principal</span>
        </NavLink>

        <NavLink to="/agenda" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} onClick={handleNavLinkClick}>
          <Clock size={20} />
          <span>Agenda de Serviços</span>
        </NavLink>
        
        <NavLink to="/clientes" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} onClick={handleNavLinkClick}>
          <Car size={20} />
          <span>Frota & Clientes</span>
        </NavLink>
        
        <NavLink to="/catalogo" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} onClick={handleNavLinkClick}>
          <Sparkles size={20} />
          <span>Tabela de Estética</span>
        </NavLink>

        <NavLink to="/estoque" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} onClick={handleNavLinkClick}>
          <Droplets size={20} />
          <span>Insumos & Estoque</span>
        </NavLink>

        <NavLink to="/financeiro" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} onClick={handleNavLinkClick}>
          <DollarSign size={20} />
          <span>Fluxo Financeiro</span>
        </NavLink>

      </nav>
      
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          onClick={() => { onToggleCalculator(); handleNavLinkClick(); }}
          className="nav-item" 
          style={{ background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', width: '100%', justifyContent: 'flex-start' }}
        >
          <CalcIcon size={20} color="var(--primary-color)" />
          <span>Calculadora</span>
        </button>

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#666', padding: '10px 0' }}>
          v1.2.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
