import React from 'react';
import { X, Printer, Car, User, Clock, CheckCircle, Shield, AlertCircle, Phone, MapPin } from 'lucide-react';

const ImpressaoOSModal = ({ isOpen, onClose, agendamento, cliente }) => {
  if (!isOpen || !agendamento) return null;

  const handlePrint = () => {
    window.print();
  };

  const valorTotal = agendamento.valor || 0;
  const valorSinal = valorTotal * 0.3;
  const valorRestante = valorTotal - (agendamento.pagoSinal ? valorSinal : 0);

  return (
    <div className="no-print" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '15px' }}>
        <button onClick={handlePrint} className="action-btn" style={{ background: '#25D366' }}>
          <Printer size={18} /> IMPRIMIR / PDF
        </button>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}>
          <X size={24} />
        </button>
      </div>

      <div id="printable-os" style={{
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '800px',
        height: '90vh',
        overflowY: 'auto',
        borderRadius: '8px',
        padding: '40px',
        color: '#000',
        fontFamily: 'Inter, sans-serif'
      }}>
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
              #root, .no-print, header, nav, aside { 
                display: none !important; 
              }
              #printable-os { 
                display: block !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                box-shadow: none !important;
                border: none !important;
                height: auto !important;
                overflow: visible !important;
                visibility: visible !important;
              }
              * { visibility: hidden; }
              #printable-os, #printable-os * { visibility: visible; }
            }
          `}
        </style>

        {/* Cabeçalho */}
        <div style={{ borderBottom: '3px solid #000', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '900', letterSpacing: '-1px' }}>ALISSON ESTÉTICA AUTOMOTIVA</h1>
            <p style={{ margin: '5px 0', fontSize: '13px', color: '#555', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={14} /> Rua das Garagens, 123 - Centro | <Phone size={14} /> (15) 99677-5714
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', background: '#000', color: '#fff', padding: '5px 15px', borderRadius: '4px' }}>ORDEM DE SERVIÇO #{agendamento.id.toString().padStart(4, '0')}</div>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#555' }}>Emissão: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
          </div>
        </div>

        {/* Dados do Cliente */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '6px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '12px', textTransform: 'uppercase', color: '#888' }}>Proprietário</h3>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{cliente?.nome || agendamento.cliente}</div>
            <div style={{ fontSize: '14px', color: '#555', marginTop: '5px' }}>DOC: {cliente?.cpf || '---'}</div>
            <div style={{ fontSize: '14px', color: '#555' }}>TEL: {cliente?.telefone || agendamento.telefone}</div>
          </div>

          <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '6px', background: '#f9f9f9' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '12px', textTransform: 'uppercase', color: '#888' }}>Veículo</h3>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{cliente?.veiculo?.marca} {cliente?.veiculo?.modelo}</div>
            <div style={{ fontSize: '14px', color: '#555', marginTop: '5px' }}>PLACA: <span style={{ fontWeight: 'bold', color: '#000' }}>{cliente?.veiculo?.placa || '---'}</span></div>
            <div style={{ fontSize: '14px', color: '#555' }}>COR: {cliente?.veiculo?.cor || '---'} | ANO: {cliente?.veiculo?.ano || '---'}</div>
          </div>
        </div>

        {/* Detalhamento do Serviço */}
        <div style={{ marginBottom: '30px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #000' }}>
                <th style={{ textAlign: 'left', padding: '10px', fontSize: '12px' }}>DESCRIÇÃO DO SERVIÇO / PROCEDIMENTO</th>
                <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px' }}>DATA/HORA ENTRADA</th>
                <th style={{ textAlign: 'right', padding: '10px', fontSize: '12px' }}>VALOR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '15px 10px', borderBottom: '1px solid #eee' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{agendamento.servico}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Detalhamento técnico (Estética Automotiva)</div>
                </td>
                <td style={{ padding: '15px 10px', borderBottom: '1px solid #eee', textAlign: 'right', fontSize: '14px' }}>
                  {agendamento.dataStr} às {agendamento.horario}
                </td>
                <td style={{ padding: '15px 10px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 'bold' }}>
                  R$ {(valorTotal - (parseFloat(agendamento.valorAdicional) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
              {parseFloat(agendamento.valorAdicional) > 0 && (
                <tr style={{ background: '#fafafa' }}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee', fontStyle: 'italic', color: '#555' }}>
                     (+) Taxa Adicional / Custos Flexíveis
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}></td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 'bold' }}>
                    R$ {parseFloat(agendamento.valorAdicional).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Checklist de Avarias */}
        {cliente?.veiculo?.avarias && (
          <div style={{ marginBottom: '30px', padding: '20px', background: '#fff9f0', border: '1px solid #ffeeba', borderRadius: '6px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '12px', textTransform: 'uppercase', color: '#856404', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <AlertCircle size={14} /> Relatório de Avarias Pré-Existentes
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#856404', lineHeight: '1.5' }}>{cliente.veiculo.avarias}</p>
          </div>
        )}

        {/* Resumo Financeiro */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
          <div style={{ width: '250px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
              <span style={{ color: '#888', fontSize: '13px' }}>Subtotal:</span>
              <span>R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: '#25D366' }}>
              <span style={{ fontSize: '13px' }}>Sinal Pago (30%):</span>
              <span>- R$ {(agendamento.pagoSinal ? valorSinal : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderTop: '2px solid #000', marginTop: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>TOTAL A PAGAR:</span>
              <span style={{ fontWeight: '900', fontSize: '20px' }}>R$ {valorRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Assinaturas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginTop: 'Auto', paddingTop: '50px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #000', paddingTop: '10px', fontSize: '12px', fontWeight: 'bold' }}>RESPONSÁVEL TÉCNICO</div>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>ALISSON ESTÉTICA AUTOMOTIVA</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #000', paddingTop: '10px', fontSize: '12px', fontWeight: 'bold' }}>ASSINATURA DO CLIENTE</div>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>ESTOU DE ACORDO COM OS SERVIÇOS PRESTADOS</div>
          </div>
        </div>

        {/* Rodapé Interno */}
        <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #eee', textAlign: 'center', fontSize: '10px', color: '#aaa', lineHeight: '1.5' }}>
          Documento gerado eletronicamente pelo Sistema de Gestão Detailing PRO.<br />
          A Alisson Estética Automotiva reserva-se ao direito de guarda do veículo por até 24h após a conclusão do serviço.
        </div>
      </div>
    </div>
  );
};

export default ImpressaoOSModal;
