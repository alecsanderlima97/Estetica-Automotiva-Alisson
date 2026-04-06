import React from 'react';
import { X, Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const ClienteHistoricoModal = ({ isOpen, onClose, cliente, agendamentos }) => {
  if (!isOpen || !cliente) return null;

  const historico = agendamentos
    .filter(a => a.cliente === cliente.nome)
    .sort((a, b) => {
      const dataA = new Date(a.dataStr.split('/').reverse().join('-') + 'T' + a.horario);
      const dataB = new Date(b.dataStr.split('/').reverse().join('-') + 'T' + b.horario);
      return dataB - dataA;
    });

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '32px', maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ color: 'var(--text-light)', margin: 0 }}>Histórico de Procedimentos</h2>
            <p style={{ color: 'var(--primary-color)', margin: '4px 0 0 0', fontWeight: '500' }}>{cliente.nome}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {historico.length > 0 ? historico.map((a, index) => (
            <div key={a.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '16px', 
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: '12px', 
              border: '1px solid rgba(255,255,255,0.05)',
              position: 'relative'
            }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: a.status === 'Cancelado' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(163, 184, 142, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginRight: '16px',
                color: a.status === 'Cancelado' ? '#dc2626' : 'var(--primary-color)'
              }}>
                <Calendar size={20} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 'bold', color: 'white', fontSize: '15px' }}>{a.servico}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{a.dataStr} • {a.horario}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: 'bold' }}>{a.veiculo || 'Veículo não informado'}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <div style={{ fontSize: '13px', color: '#666' }}>Valor: R$ {a.valor?.toLocaleString('pt-BR')}</div>
                  <div className={`status ${a.status === 'Confirmado' || a.status === 'Concluído' ? 'concluido' : a.status === 'Cancelado' ? 'cancelado' : 'agendado'}`} style={{ fontSize: '10px' }}>
                    {a.status}
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
              Nenhum procedimento anterior registrado.
            </div>
          )}
        </div>

        <button 
          onClick={onClose}
          style={{ width: '100%', marginTop: '32px', padding: '14px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Fechar Histórico
        </button>
      </div>
    </div>
  );
};

export default ClienteHistoricoModal;
