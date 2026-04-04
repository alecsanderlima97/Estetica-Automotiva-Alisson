import React from 'react';

const PlaceholderPage = ({ title }) => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="card">
        <p style={{ color: '#666' }}>Este módulo está em desenvolvimento. A estrutura principal está conectada, e logo receberá os formulários e tabelas reais.</p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
