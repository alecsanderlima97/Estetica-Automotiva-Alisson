import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, User, BookOpen, QrCode, Copy, CheckCircle, Fingerprint, AlertCircle } from 'lucide-react';

const AgendamentoFormModal = ({ isOpen, onClose, onSalvar, clientes, servicos, agendamentos, agendamentoParaEditar }) => {
  const [formData, setFormData] = useState({
    clienteId: '',
    servicoId: '',
    tipoProcedimento: 'aplicacao', // 'aplicacao', 'manutencao', 'remocao'
    manutencaoIndex: '',
    data: new Date().toISOString().split('T')[0],
    horario: '09:00',
    status: 'Agendado',
    pagoSinal: false,
    cpfBusca: ''
  });

  const [valorSinal, setValorSinal] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);

  useEffect(() => {
    if (isOpen) {
      if (agendamentoParaEditar) {
        const cliente = clientes.find(c => c.nome === agendamentoParaEditar.cliente);
        const servico = servicos.find(s => s.nome.includes(agendamentoParaEditar.servico.split('(')[0].trim()));
        
        // Tenta detectar o tipo de procedimento pelo nome salvo
        let tipo = 'aplicacao';
        let mIndex = '';
        if (agendamentoParaEditar.servico.includes('Manutenção')) {
          tipo = 'manutencao';
          const manutenciaoTexto = agendamentoParaEditar.servico.match(/Manutenção - (.+)\)/)?.[1];
          mIndex = servico?.manutencoes?.findIndex(m => m.dias === manutenciaoTexto) ?? '';
        } else if (agendamentoParaEditar.servico.includes('Remoção')) {
          tipo = 'remocao';
        }

        setFormData({
          clienteId: cliente?.id || '',
          cpfBusca: cliente?.cpf || '',
          servicoId: servico?.id || '',
          tipoProcedimento: tipo,
          manutencaoIndex: mIndex,
          data: agendamentoParaEditar.dataStr.split('/').reverse().join('-'),
          horario: agendamentoParaEditar.horario,
          status: agendamentoParaEditar.status,
          pagoSinal: agendamentoParaEditar.pagoSinal || false
        });
      } else {
        setFormData({
          clienteId: '',
          servicoId: '',
          tipoProcedimento: 'aplicacao',
          manutencaoIndex: '',
          data: new Date().toISOString().split('T')[0],
          horario: '09:00',
          status: 'Agendado',
          pagoSinal: false,
          cpfBusca: ''
        });
      }
    }
  }, [isOpen, agendamentoParaEditar, clientes, servicos]);

  useEffect(() => {
    const servico = servicos.find(s => s.id.toString() === formData.servicoId.toString());
    if (servico) {
      let valor = servico.preco;
      
      if (formData.tipoProcedimento === 'manutencao' && formData.manutencaoIndex !== '') {
        valor = servico.manutencoes[formData.manutencaoIndex].valor;
      } else if (formData.tipoProcedimento === 'remocao') {
        valor = servico.remocao || 40.00;
      }
      
      setValorTotal(valor);
      setValorSinal(valor * 0.3);
    } else {
      setValorTotal(0);
      setValorSinal(0);
    }
  }, [formData.servicoId, formData.tipoProcedimento, formData.manutencaoIndex, servicos]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: val };
      
      // Resetar sub-opções se mudar o serviço ou tipo
      if (name === 'servicoId') {
        newData.tipoProcedimento = 'aplicacao';
        newData.manutencaoIndex = '';
      }
      if (name === 'tipoProcedimento') {
        newData.manutencaoIndex = '';
      }

      // Automação: Se o sinal for pago, muda o status para "Confirmado"
      if (name === 'pagoSinal' && val === true) {
        newData.status = 'Confirmado';
      } else if (name === 'pagoSinal' && val === false && prev.status === 'Confirmado') {
        newData.status = 'Agendado';
      }
      
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cliente = clientes.find(c => c.id.toString() === formData.clienteId.toString());
    const servico = servicos.find(s => s.id.toString() === formData.servicoId.toString());
    
    let nomeServicoFinal = servico?.nome || '';
    if (formData.tipoProcedimento === 'manutencao') {
      const manut = servico.manutencoes[formData.manutencaoIndex];
      nomeServicoFinal += ` (Manutenção - ${manut.dias})`;
    } else if (formData.tipoProcedimento === 'remocao') {
      nomeServicoFinal += ` (Remoção)`;
    }

    onSalvar({
      ...formData,
      cliente: cliente?.nome || '',
      telefone: cliente?.telefone?.replace(/\D/g, '') || '',
      instagram: cliente?.instagram?.replace('@', '') || '',
      servico: nomeServicoFinal,
      valor: valorTotal,
      dataStr: new Date(formData.data + 'T00:00:00').toLocaleDateString('pt-BR')
    });
  };

  const selectedServico = servicos.find(s => s.id.toString() === formData.servicoId.toString());

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--text-light)', margin: 0 }}>
            {agendamentoParaEditar ? 'Editar Agendamento' : 'Novo Agendamento'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>CPF da Cliente (Busca Rápida)</label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(0,0,0,0.2)', 
                border: '1px solid',
                borderColor: clientes.some(c => c.cpf?.replace(/\D/g, '') === formData.cpfBusca?.replace(/\D/g, '')) ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)', 
                borderRadius: '8px', 
                padding: '10px',
                transition: 'all 0.3s'
              }}>
                <Fingerprint size={18} color={clientes.some(c => c.cpf?.replace(/\D/g, '') === formData.cpfBusca?.replace(/\D/g, '')) ? 'var(--primary-color)' : '#888'} style={{ marginRight: '10px' }} />
                <input 
                  type="text" 
                  placeholder="000.000.000-00"
                  value={formData.cpfBusca || ''}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    const masked = val
                      .replace(/(\d{3})(\d)/, '$1.$2')
                      .replace(/(\d{3})(\d)/, '$1.$2')
                      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                      .slice(0, 14);
                    
                    setFormData(prev => ({ ...prev, cpfBusca: masked }));
                    
                    if (val.length === 11) {
                      const cliente = clientes.find(c => c.cpf?.replace(/\D/g, '') === val);
                      if (cliente) {
                        setFormData(prev => ({ ...prev, clienteId: cliente.id, cpfBusca: masked }));
                      }
                    }
                  }}
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} 
                />
                {clientes.some(c => c.cpf?.replace(/\D/g, '') === formData.cpfBusca?.replace(/\D/g, '')) && (
                  <CheckCircle size={16} color="var(--primary-color)" />
                )}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Selecionar Cliente *</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                <User size={18} color="#888" style={{ marginRight: '10px' }} />
                <select name="clienteId" value={formData.clienteId} onChange={handleChange} required
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none', cursor: 'pointer' }}>
                  <option value="" style={{ background: '#1a1f14' }}>Escolha uma cliente...</option>
                  {clientes.map(c => <option key={c.id} value={c.id} style={{ background: '#1a1f14' }}>{c.nome}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Serviço *</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                <BookOpen size={18} color="#888" style={{ marginRight: '10px' }} />
                <select name="servicoId" value={formData.servicoId} onChange={handleChange} required
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none', cursor: 'pointer' }}>
                  <option value="" style={{ background: '#1a1f14' }}>Escolha o serviço...</option>
                  {servicos.map(s => <option key={s.id} value={s.id} style={{ background: '#1a1f14' }}>{s.nome}</option>)}
                </select>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Data *</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                <Calendar size={18} color="#888" style={{ marginRight: '10px' }} />
                <input type="date" name="data" value={formData.data} onChange={handleChange} required
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} />
              </div>
            </div>
          </div>

          {/* Ramificação de tipos e valores */}
          {selectedServico && (selectedServico.manutencoes?.length > 0 || selectedServico.remocao) && (
            <div style={{ background: 'rgba(var(--primary-rgb), 0.05)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <label style={{ display: 'block', marginBottom: '12px', color: 'var(--primary-color)', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Tipo de Procedimento</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={() => handleChange({ target: { name: 'tipoProcedimento', value: 'aplicacao' } })}
                  style={{ 
                    flex: 1, padding: '10px', borderRadius: '6px', cursor: 'pointer', border: '1px solid',
                    backgroundColor: formData.tipoProcedimento === 'aplicacao' ? 'var(--primary-color)' : 'rgba(0,0,0,0.2)',
                    color: formData.tipoProcedimento === 'aplicacao' ? 'white' : '#888',
                    borderColor: formData.tipoProcedimento === 'aplicacao' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                    fontSize: '13px', transition: 'all 0.2s'
                  }}
                >
                  Aplicação (R$ {selectedServico.preco.toFixed(2)})
                </button>
                {selectedServico.manutencoes?.length > 0 && (
                  <button 
                    type="button"
                    onClick={() => handleChange({ target: { name: 'tipoProcedimento', value: 'manutencao' } })}
                    style={{ 
                      flex: 1, padding: '10px', borderRadius: '6px', cursor: 'pointer', border: '1px solid',
                      backgroundColor: formData.tipoProcedimento === 'manutencao' ? 'var(--primary-color)' : 'rgba(0,0,0,0.2)',
                      color: formData.tipoProcedimento === 'manutencao' ? 'white' : '#888',
                      borderColor: formData.tipoProcedimento === 'manutencao' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                      fontSize: '13px', transition: 'all 0.2s'
                    }}
                  >
                    Manutenção
                  </button>
                )}
                {selectedServico.remocao && (
                  <button 
                    type="button"
                    onClick={() => handleChange({ target: { name: 'tipoProcedimento', value: 'remocao' } })}
                    style={{ 
                      flex: 1, padding: '10px', borderRadius: '6px', cursor: 'pointer', border: '1px solid',
                      backgroundColor: formData.tipoProcedimento === 'remocao' ? 'var(--primary-color)' : 'rgba(0,0,0,0.2)',
                      color: formData.tipoProcedimento === 'remocao' ? 'white' : '#888',
                      borderColor: formData.tipoProcedimento === 'remocao' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                      fontSize: '13px', transition: 'all 0.2s'
                    }}
                  >
                    Remoção (R$ {selectedServico.remocao.toFixed(2)})
                  </button>
                )}
              </div>

              {/* Opções de Manutenção */}
              {formData.tipoProcedimento === 'manutencao' && selectedServico.manutencoes?.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Selecione o Tempo de Manutenção *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                    {selectedServico.manutencoes.map((m, idx) => (
                      <button 
                        key={idx}
                        type="button"
                        onClick={() => handleChange({ target: { name: 'manutencaoIndex', value: idx } })}
                        style={{ 
                          padding: '12px 8px', borderRadius: '6px', cursor: 'pointer', border: '1px solid',
                          backgroundColor: formData.manutencaoIndex === idx ? 'rgba(var(--primary-rgb), 0.2)' : 'rgba(0,0,0,0.1)',
                          color: formData.manutencaoIndex === idx ? 'var(--primary-color)' : '#888',
                          borderColor: formData.manutencaoIndex === idx ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                          fontSize: '12px', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                        }}
                      >
                        <span style={{ fontWeight: 'bold' }}>{m.dias}</span>
                        <span>R$ {m.valor.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Horário *</label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(0,0,0,0.2)', 
                border: '1px solid',
                borderColor: agendamentos?.some(a => a.dataStr === new Date(formData.data + 'T00:00:00').toLocaleDateString('pt-BR') && a.horario === formData.horario && a.id !== agendamentoParaEditar?.id) ? '#ef4444' : 'rgba(255,255,255,0.05)',
                borderRadius: '8px', 
                padding: '10px' 
              }}>
                <Clock size={18} color={agendamentos?.some(a => a.dataStr === new Date(formData.data + 'T00:00:00').toLocaleDateString('pt-BR') && a.horario === formData.horario && a.id !== agendamentoParaEditar?.id) ? '#ef4444' : '#888'} style={{ marginRight: '10px' }} />
                <input type="time" name="horario" value={formData.horario} onChange={handleChange} required
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} />
              </div>
              {agendamentos?.some(a => a.dataStr === new Date(formData.data + 'T00:00:00').toLocaleDateString('pt-BR') && a.horario === formData.horario && a.id !== agendamentoParaEditar?.id) && (
                <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} /> Horário já ocupado!
                </div>
              )}
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
               <div style={{ padding: '10px', color: '#888', fontSize: '14px' }}>
                  Valor Total: <span style={{ color: 'var(--text-light)', fontWeight: 'bold' }}>R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
               </div>
            </div>
          </div>

          {valorSinal > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '14px' }}>Reserva de Vaga (30%)</h4>
                  <p style={{ margin: '4px 0 0 0', color: '#888', fontSize: '12px' }}>A confirmação exige o sinal antecipado.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-light)' }}>R$ {valorSinal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ background: 'white', padding: '8px', borderRadius: '8px' }}>
                  <QrCode size={80} color="black" />
                </div>
                <div style={{ flex: 1 }}>
                  <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ccc', width: '100%', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <Copy size={16} /> Copiar Chave PIX
                  </button>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', cursor: 'pointer', color: formData.pagoSinal ? '#10b981' : '#ccc' }}>
                    <input type="checkbox" name="pagoSinal" checked={formData.pagoSinal} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }} />
                    <span style={{ fontSize: '14px', fontWeight: formData.pagoSinal ? 'bold' : 'normal' }}>
                      {formData.pagoSinal ? 'Sinal Recebido ✓' : 'Sinal já foi pago?'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#ccc', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" className="action-btn">
              <Save size={18} /> {agendamentoParaEditar ? 'Salvar Alterações' : 'Confirmar Agendamento'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AgendamentoFormModal;
