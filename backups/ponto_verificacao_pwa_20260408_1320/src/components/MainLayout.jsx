import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Calculator from './Calculator';
import Footer from './Footer';

const MainLayout = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-container">
      {/* Botão Hambúrguer Mobile */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ width: '24px', height: '2px', background: 'currentColor' }}></div>
          <div style={{ width: '24px', height: '2px', background: 'currentColor' }}></div>
          <div style={{ width: '24px', height: '2px', background: 'currentColor' }}></div>
        </div>
      </button>

      {/* Overlay para fechar ao clicar fora */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`} 
        onClick={closeSidebar}
      ></div>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar}
        onToggleCalculator={() => setShowCalculator(!showCalculator)} 
      />
      
      <div className="content-wrapper">
        <Header />
        <main className="main-content">
          <Outlet />
        </main>
        <Footer />
      </div>

      {showCalculator && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          animation: 'slideUp 0.3s ease-out'
        }}>
          <Calculator onClose={() => setShowCalculator(false)} />
        </div>
      )}

      <style>
        {`
          @keyframes slideUp {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default MainLayout;
