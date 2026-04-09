import React from 'react';
import { useData } from '../context/DataContext';
import { MessageCircle, Bell, CheckCircle2 } from 'lucide-react';

const AutomationReminders = () => {
  const { agendamentos, updateLembreteStatus, userProfile } = useData();

  const parseDate = (dateStr, timeStr) => {
    if (!dateStr) return new Date();
    const [d, m, y] = dateStr.split('/');
    const [h, min] = (timeStr || '09:00').split(':');
    return new Date(y, m - 1, d, h, min);
  };

  const agora = new Date();
  
  // Filtros de Lembretes
  const lembretes24h = agendamentos.filter(a => {
    if (a.status === 'Cancelado' || a.lembrete24h) return false;
    const dataAgn = parseDate(a.dataStr, a.horario);
    const diffHours = (dataAgn - agora) / (1000 * 60 * 60);
    // Entre 18h e 30h de antecedência (ideal para avisar no dia anterior)
    return diffHours > 0 && diffHours <= 30 && diffHours >= 18;
  });

  const lembretes2h = agendamentos.filter(a => {
    if (a.status === 'Cancelado' || a.lembrete2h) return false;
    const dataAgn = parseDate(a.dataStr, a.horario);
    const diffHours = (dataAgn - agora) / (1000 * 60 * 60);
    // Entre 0.5h e 3h de antecedência (ideal para o lembrete de última hora)
    return diffHours > 0 && diffHours <= 3.5;
  });

  const enviarWhatsApp = (agendamento, tipo) => {
    const tel = agendamento.telefone?.replace(/\D/g, '') || '';
    const saudacao = agora.getHours() < 12 ? 'Bom dia' : agora.getHours() < 18 ? 'Boa tarde' : 'Boa noite';
    
    let mensagem = '';
    if (tipo === 'lembrete24h') {
      mensagem = `Olá, ${agendamento.cliente}! ${saudacao}. 🚗%0A%0AEstou passando para confirmar seu agendamento de *${agendamento.servico}* para amanhã, dia *${agendamento.dataStr}* às *${agendamento.horario}*.%0A%0APodemos confirmar?`;
    } else {
      mensagem = `Olá, ${agendamento.cliente}! ${saudacao}. 🚗%0A%0ASeu agendamento de *${agendamento.servico}* é daqui a pouco, às *${agendamento.horario}*. Já estamos preparando tudo para receber seu veículo!%0A%0AAté breve!`;
    }

    window.open(`https://wa.me/${tel}?text=${mensagem}`, '_blank');
    updateLembreteStatus(agendamento.id, tipo);
  };

  if (lembretes24h.length === 0 && lembretes2h.length === 0) return null;

  return (
    <div className="card" style={{ 
      background: 'linear-gradient(145deg, rgba(92, 114, 73, 0.15) 0%, rgba(34, 43, 25, 0.4) 100%)',
      border: '1px solid var(--primary-color)',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Bell size={20} color="var(--primary-color)" />
        <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--primary-color)' }}>Automação de Lembretes</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Lembretes de 24h */}
        {lembretes24h.map(a => (
          <div key={`${a.id}-24h`} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '12px', 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '10px', background: 'var(--primary-color)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>24 HORAS</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{a.cliente}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                Amanhã às {a.horario} - {a.servico}
              </div>
            </div>
            <button 
              onClick={() => enviarWhatsApp(a, 'lembrete24h')}
              className="action-btn"
              style={{ padding: '8px 12px', fontSize: '12px', gap: '6px' }}
            >
              <MessageCircle size={16} /> Enviar Lembrete
            </button>
          </div>
        ))}

        {/* Lembretes de 2h */}
        {lembretes2h.map(a => (
          <div key={`${a.id}-2h`} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '12px', 
            background: 'rgba(255,158,11,0.05)', 
            borderRadius: '12px',
            border: '1px solid rgba(255,158,11,0.1)'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '10px', background: '#f59e0b', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>2 HORAS</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{a.cliente}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                Hoje às {a.horario} - {a.servico}
              </div>
            </div>
            <button 
              onClick={() => enviarWhatsApp(a, 'lembrete2h')}
              className="action-btn"
              style={{ padding: '8px 12px', fontSize: '12px', gap: '6px', background: '#f59e0b' }}
            >
              <MessageCircle size={16} /> Enviar Agora
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutomationReminders;
