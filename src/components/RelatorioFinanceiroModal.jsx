import React from 'react';
import { X, Printer, ArrowUpRight, ArrowDownRight, DollarSign, Calendar } from 'lucide-react';

const RelatorioFinanceiroModal = ({ isOpen, onClose, lancamentos, resumo, periodo }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
      padding: '20px'
    }}>
      <div className="card" style={{ 
        width: '100%', maxWidth: '900px', maxHeight: '90vh', 
        overflowY: 'auto', background: '#fff', color: '#333',
        padding: '0', position: 'relative'
      }}>
        {/* Header - Não sai na impressão opcionalmente, mas aqui vamos deixar bonito */}
        <div style={{ 
          padding: '20px 40px', background: '#111', color: 'white', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 10
        }} className="no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Printer size={24} color="var(--primary-color)" />
            <h2 style={{ margin: 0, fontFamily: 'Oswald', fontSize: '20px', letterSpacing: '1px' }}>RELATÓRIO DE FLUXO FINANCEIRO</h2>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handlePrint} className="action-btn" style={{ padding: '8px 20px' }}>
              IMPRIMIR / PDF
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
              <X size={28} />
            </button>
          </div>
        </div>

        {/* Conteúdo do Relatório (O que será impresso) */}
        <div style={{ padding: '60px 50px' }} id="printable-relatorio">
          <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#111', fontFamily: 'Oswald' }}>ESTÉTICA AUTOMOTIVA</h1>
            <p style={{ margin: 0, color: '#666', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Relatório Financeiro Detalhado - {periodo}</p>
            <p style={{ margin: '5px 0 0 0', color: '#999', fontSize: '12px' }}>Gerado em: {new Date().toLocaleString('pt-BR')}</p>
          </div>

          <h3 style={{ borderLeft: '4px solid #111', paddingLeft: '15px', marginBottom: '20px', fontSize: '18px', fontFamily: 'Oswald' }}>HISTÓRICO DE LANÇAMENTOS</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#777' }}>DATA</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#777' }}>DESCRIÇÃO</th>
                <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#777' }}>TIPO</th>
                <th style={{ textAlign: 'right', padding: '12px', fontSize: '12px', color: '#777' }}>VALOR</th>
              </tr>
            </thead>
            <tbody>
              {lancamentos.map((l, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #efefef' }}>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{new Date(l.data + 'T12:00:00').toLocaleDateString('pt-BR')}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>
                    <div style={{ fontWeight: '600' }}>{l.descricao}</div>
                    {l.origem === 'agenda' && <span style={{ fontSize: '10px', color: '#999' }}>Vindo da agenda</span>}
                  </td>
                  <td style={{ padding: '12px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', color: l.tipo === 'receita' ? '#10b981' : '#f43f5e' }}>
                    {l.tipo}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', color: l.tipo === 'receita' ? '#10b981' : '#f43f5e' }}>
                    {l.tipo === 'receita' ? '+' : '-'} R$ {l.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Resumo Financeiro Final */}
          <div className="summary-box" style={{ background: '#111', color: 'white', padding: '40px', borderRadius: '12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Total Receitas</p>
              <h4 style={{ margin: 0, fontSize: '22px', color: '#10b981' }}>R$ {resumo.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
            </div>
            <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Total Despesas</p>
              <h4 style={{ margin: 0, fontSize: '22px', color: '#f43f5e' }}>R$ {resumo.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h4>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Saldo Líquido</p>
              <h4 style={{ margin: 0, fontSize: '24px', color: resumo.saldo >= 0 ? 'var(--primary-color)' : '#f43f5e', fontWeight: 'bold' }}>
                R$ {resumo.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h4>
            </div>
          </div>

          <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '12px', color: '#999', textAlign: 'center' }}>
            Este documento é um registro interno da Estética Automotiva.
          </div>
        </div>

        <style>
          {`
            @media print {
              body, html { 
                background: white !important; 
                margin: 0 !important; 
                padding: 0 !important;
                height: auto !important;
                overflow: visible !important;
              }
              .no-print, header, nav, aside, .sidebar { 
                display: none !important; 
              }
              #printable-relatorio { 
                display: block !important;
                position: relative !important;
                width: 100% !important;
                padding: 20px !important;
                margin: 0 !important;
                box-shadow: none !important;
                border: none !important;
                background: white !important;
                color: black !important;
                visibility: visible !important;
              }
              body * {
                visibility: hidden;
              }
              #printable-relatorio, #printable-relatorio * {
                visibility: visible !important;
              }
              
              /* Ajuste do resumo para impressão */
              .summary-box {
                background: #f8f9fa !important;
                color: black !important;
                border: 1px solid #ddd !important;
                padding: 20px !important;
              }
              .summary-box div {
                border-right: 1px solid #ddd !important;
              }
              .summary-box p {
                color: #555 !important;
                font-weight: bold !important;
              }
              .summary-box h4 {
                font-size: 20px !important;
              }

              /* Garante que o modal não tenha scroll ou fundos escuros */
              .card { background: white !important; color: black !important; border: none !important; }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default RelatorioFinanceiroModal;
