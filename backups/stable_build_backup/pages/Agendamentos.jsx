import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, MessageCircle, Instagram, CheckCircle, XCircle, Clock, Edit2, DollarSign, Send, Trash2, AlertCircle, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import AgendamentoFormModal from '../components/AgendamentoFormModal';

// Componente de Calendário Premium Customizado
const CalendarModal = ({ isOpen, onClose, onSelectDate, initialDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(initialDate));
  
  if (!isOpen) return null;

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const days = [];
  const totalDays = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  // Adiciona espaços vazios para o início do mês
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Adiciona os dias do mês
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const changeMonth = (offset) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentMonth(newDate);
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentMonth.getMonth() === today.getMonth() && 
           currentMonth.getFullYear() === today.getFullYear();
  };

  const isSelected = (day) => {
    return day === initialDate.getDate() && 
           currentMonth.getMonth() === initialDate.getMonth() && 
           currentMonth.getFullYear() === initialDate.getFullYear();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(10px)' }}>
      <div style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '30px', width: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: 'white', fontSize: '20px' }}>Selecionar Data</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}><X size={24} /></button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => changeMonth(-1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}><ChevronLeft size={20} /></button>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
            {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase())}
          </span>
          <button onClick={() => changeMonth(1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}><ChevronRight size={20} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
            <div key={d} style={{ color: '#555', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>{d}</div>
          ))}
          {days.map((day, i) => (
            <div 
              key={i} 
              onClick={() => day && onSelectDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
              style={{
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: day ? 'pointer' : 'default',
                borderRadius: '12px',
                fontSize: '14px',
                backgroundColor: isSelected(day) ? 'var(--primary-color)' : (isToday(day) ? 'rgba(var(--primary-rgb), 0.2)' : 'transparent'),
                color: isSelected(day) ? 'white' : (day ? 'white' : 'transparent'),
                border: isToday(day) && !isSelected(day) ? '1px solid var(--primary-color)' : 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => day && !isSelected(day) && (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
              onMouseLeave={(e) => day && !isSelected(day) && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Agendamentos = () => {
  const { agendamentos, addAgendamento, updateAgendamento, updateAgendamentoStatus, deleteAgendamento, clientes, servicos } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [agendamentoParaEditar, setAgendamentoParaEditar] = useState(null);
  const [filtroData, setFiltroData] = useState(new Date().toLocaleDateString('pt-BR'));
  const [dataVista, setDataVista] = useState(new Date());

  const handleSalvarAgendamento = (dados) => {
    if (agendamentoParaEditar) {
      updateAgendamento(agendamentoParaEditar.id, dados);
    } else {
      addAgendamento(dados);
    }
    setIsModalOpen(false);
    setAgendamentoParaEditar(null);
  };

  const setEditando = (agendamento) => {
    setAgendamentoParaEditar(agendamento);
    setIsModalOpen(true);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Confirmado': return 'status concluido';
      case 'Cancelado': return 'status cancelado';
      default: return 'status agendado';
    }
  };

  const abrirWhatsAppLembrete = (agendamento) => {
    const valorSinal = (agendamento.valor * 0.3).toFixed(2).replace('.', ',');
    const msg = `Olá ${agendamento.cliente}! ✨\n\nPassando para confirmar seu atendimento às ${agendamento.horario} do dia ${agendamento.dataStr}.\n\nPara garantir sua vaga, solicitamos o pagamento do sinal de 30% (R$ ${valorSinal}).\n\n🔑 *Chave PIX (Melissa):* 15996775714\n\n*(Caso já tenha realizado o pagamento do sinal, por favor desconsidere esta mensagem)*.\n\nPode enviar o comprovante por aqui mesmo? Aguardamos você! 💖`;
    window.open(`https://wa.me/${agendamento.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const navegarDias = (sentido) => {
    const novaData = new Date(dataVista);
    novaData.setDate(novaData.getDate() + (sentido === 'proximo' ? 3 : -3));
    setDataVista(novaData);
  };

  const handleSelectDate = (date) => {
    setDataVista(date);
    setFiltroData(date.toLocaleDateString('pt-BR'));
    setIsCalendarOpen(false);
  };

  // Gerador de Dias para a Régua (agora com 15 dias)
  const getDiasRegua = () => {
    const dias = [];
    for (let i = -7; i <= 7; i++) {
      const d = new Date(dataVista);
      d.setDate(d.getDate() + i);
      dias.push({
        label: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
        dia: d.getDate(),
        full: d.toLocaleDateString('pt-BR'),
        mes: d.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()
      });
    }
    return dias;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Agenda de Atendimentos</h1>
          <p style={{ color: '#aaa', marginTop: '8px' }}>Organize seus horários e comunique-se com as clientes</p>
        </div>
        <button className="action-btn" onClick={() => { setAgendamentoParaEditar(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Novo Agendamento
        </button>
      </div>

      {/* Calendário Personalizado */}
      <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarIcon size={20} color="var(--primary-color)" />
            <h3 style={{ margin: 0, color: 'var(--text-light)', fontSize: '16px' }}>
              {dataVista.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase())}
            </h3>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{filtroData}</span>
            <button 
              onClick={() => setIsCalendarOpen(true)}
              title="Ver calendário completo"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-light)',
                padding: '8px 16px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <Maximize2 size={14} /> Calendário
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={() => navegarDias('anterior')}
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: 'none', 
              color: 'white', 
              padding: '12px', 
              borderRadius: '14px', 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <ChevronLeft size={24} />
          </button>

          <div style={{ display: 'flex', gap: '12px', flex: 1, overflowX: 'auto', padding: '10px 0', scrollbarWidth: 'none' }}>
            {getDiasRegua().map((d, i) => (
              <div 
                key={i}
                onClick={() => { setFiltroData(d.full); setDataVista(new Date(d.full.split('/').reverse().join('-') + 'T12:00:00')); }}
                style={{
                  minWidth: '65px',
                  padding: '14px 10px',
                  borderRadius: '16px',
                  backgroundColor: filtroData === d.full ? 'var(--primary-color)' : 'rgba(255,255,255,0.02)',
                  border: '1px solid',
                  borderColor: filtroData === d.full ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: filtroData === d.full ? 'white' : '#777',
                  transform: filtroData === d.full ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: filtroData === d.full ? '0 10px 15px -3px rgba(var(--primary-rgb), 0.3)' : 'none'
                }}
              >
                <div style={{ fontSize: '9px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'bold', opacity: 0.8 }}>{d.label}</div>
                <div style={{ fontSize: '20px', fontWeight: '800', lineHeight: 1 }}>{d.dia}</div>
                <div style={{ fontSize: '8px', marginTop: '4px', fontWeight: 'bold', opacity: filtroData === d.full ? 0.8 : 0.4 }}>{d.mes}</div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navegarDias('proximo')}
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: 'none', 
              color: 'white', 
              padding: '12px', 
              borderRadius: '14px', 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        {/* Horários Disponíveis */}
        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
          <h4 style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} /> Disponibilidade (07h - 19h)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}>
            {Array.from({ length: 13 }, (_, i) => {
              const hora = `${(7 + i).toString().padStart(2, '0')}:00`;
              const agendado = agendamentos.find(a => a.dataStr === filtroData && a.horario === hora);
              return (
                <div 
                  key={hora}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    textAlign: 'center',
                    background: agendado ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: agendado ? '#ef4444' : '#10b981',
                    border: '1px solid',
                    borderColor: agendado ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    fontWeight: 'bold'
                  }}
                >
                  {hora}
                  <div style={{ fontSize: '9px', fontWeight: 'normal', opacity: 0.8 }}>
                    {agendado ? 'Ocupado' : 'Livre'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Horário</th>
              <th>Cliente</th>
              <th>Serviço</th>
              <th style={{ textAlign: 'right' }}>Valor Total</th>
              <th>Status</th>
              <th>Sinal (30%)</th>
              <th style={{ textAlign: 'center' }}>Contatos</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos
              .filter(a => a.dataStr === filtroData)
              .sort((a,b) => a.horario.localeCompare(b.horario))
              .map((agendamento) => (
              <tr key={agendamento.id}>
                <td style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} /> {agendamento.horario}
                  </div>
                </td>
                <td style={{ fontWeight: '500', color: 'var(--text-light)' }}>{agendamento.cliente}</td>
                <td>{agendamento.servico}</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--text-light)' }}>
                  R$ {agendamento.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td>
                  <span className={getStatusClass(agendamento.status)}>{agendamento.status}</span>
                </td>
                <td>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    color: agendamento.pagoSinal ? '#10b981' : '#f43f5e', 
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {agendamento.pagoSinal ? <CheckCircle size={14} /> : <Clock size={14} />}
                    R$ {(agendamento.valor * 0.3).toFixed(2).replace('.', ',')}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button 
                      onClick={() => abrirWhatsAppLembrete(agendamento)}
                      title="Enviar Lembrete 3h antes"
                      style={{ background: 'rgba(37, 211, 102, 0.1)', border: 'none', color: '#25D366', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}>
                      <Send size={16} />
                    </button>
                    {agendamento.instagram && (
                      <button 
                         onClick={() => window.open(`https://instagram.com/${agendamento.instagram}`, '_blank')}
                         style={{ background: 'rgba(225, 48, 108, 0.1)', border: 'none', color: '#E1306C', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}>
                        <Instagram size={16} />
                      </button>
                    )}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => setEditando(agendamento)} title="Editar" style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => updateAgendamentoStatus(agendamento.id, 'Confirmado')} title="Confirmar Presença" style={{ background: 'transparent', border: 'none', color: '#16a34a', cursor: 'pointer' }}>
                      <CheckCircle size={18} />
                    </button>
                    <button onClick={() => {
                      if(window.confirm('Deseja excluir este agendamento?')) {
                        deleteAgendamento(agendamento.id);
                      }
                    }} title="Excluir" style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                    <button onClick={() => updateAgendamentoStatus(agendamento.id, 'Cancelado')} title="Cancelar/Faltou" style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {/* Aviso de Conflitos */}
            {(() => {
              const agendados = agendamentos.filter(a => a.dataStr === filtroData);
              const horariosCount = agendados.reduce((acc, curr) => {
                acc[curr.horario] = (acc[curr.horario] || 0) + 1;
                return acc;
              }, {});
              const conflitos = Object.keys(horariosCount).filter(h => horariosCount[h] > 1);
              
              if (conflitos.length > 0) {
                return (
                  <tr>
                    <td colSpan="7" style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', textAlign: 'center', fontSize: '13px', fontWeight: 'bold' }}>
                      ⚠️ Atenção: Você tem {conflitos.length} conflito(s) de horário hoje ({conflitos.join(', ')}).
                    </td>
                  </tr>
                );
              }
            })()}
            {agendamentos.filter(a => a.dataStr === filtroData).length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  Nenhum atendimento para esta data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AgendamentoFormModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setAgendamentoParaEditar(null); }}
        onSalvar={handleSalvarAgendamento}
        agendamentoParaEditar={agendamentoParaEditar}
        clientes={clientes}
        servicos={servicos}
        agendamentos={agendamentos}
      />

      <CalendarModal 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
        onSelectDate={handleSelectDate}
        initialDate={dataVista}
      />
    </div>
  );
};

export default Agendamentos;
