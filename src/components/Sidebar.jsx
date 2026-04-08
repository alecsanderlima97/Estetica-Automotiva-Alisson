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
  Calculator as CalcIcon,
  LogOut
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
      <div className="brand-title" style={{ marginBottom: '30px' }}>
        <img 
          src="/pwa-512.png" 
          alt="Alisson Estética Automotiva" 
          style={{ width: '100%', maxWidth: '200px', height: 'auto', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.3)' }}
        />
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
          <span>Veículos & Clientes</span>
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

        <button 
          onClick={() => {
            const confirmBackup = window.confirm("Deseja realizar um backup de segurança (clientes, agenda, estoque, financeiro) antes de sair?");
            if (confirmBackup) {
              exportData();
              // Pequeno delay para garantir que o download inicie antes de deslogar
              setTimeout(() => {
                localStorage.removeItem('alissonUser');
                window.location.reload();
              }, 1000);
            } else {
              localStorage.removeItem('alissonUser');
              window.location.reload();
            }
          }}
          className="nav-item" 
          style={{ background: 'rgba(255, 59, 59, 0.05)', border: 'none', cursor: 'pointer', width: '100%', justifyContent: 'flex-start', color: '#ff4d4d' }}
        >
          <LogOut size={20} />
          <span>Sair do Sistema</span>
        </button>

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#666', padding: '10px 0' }}>
          v1.2.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
