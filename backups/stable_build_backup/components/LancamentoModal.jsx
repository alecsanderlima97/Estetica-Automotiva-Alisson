import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign, Calendar, FileText, MessageSquare } from 'lucide-react';

const LancamentoModal = ({ isOpen, onClose, onSalvar, lancamentoParaEditar }) => {
  const [formData, setFormData] = useState({
    tipo: 'receita',
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    observacoes: ''
  });

  useEffect(() => {
    if (lancamentoParaEditar) {
      const val = lancamentoParaEditar.valor || 0;
      setFormData({
        tipo: lancamentoParaEditar.tipo || 'receita',
        descricao: lancamentoParaEditar.descricao || '',
        valor: val,
        valorExibicao: val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        data: lancamentoParaEditar.data || new Date().toISOString().split('T')[0],
        observacoes: lancamentoParaEditar.observacoes || ''
      });
    } else {
      setFormData({
        tipo: 'receita',
        descricao: '',
        valor: 0,
        valorExibicao: '',
        data: new Date().toISOString().split('T')[0],
        observacoes: ''
      });
    }
  }, [lancamentoParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const { valorExibicao, ...dadosParaSalvar } = formData;
    onSalvar({
      ...dadosParaSalvar,
      valor: parseFloat(formData.valor) || 0
    });
    if (!lancamentoParaEditar) {
      setFormData({
        tipo: 'receita',
        descricao: '',
        valor: 0,
        valorExibicao: '',
        data: new Date().toISOString().split('T')[0],
        observacoes: ''
      });
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--text-light)', margin: 0 }}>
            {lancamentoParaEditar ? 'Editar Lançamento' : 'Novo Lançamento'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px' }}>
            <button 
              type="button"
              onClick={() => setFormData({...formData, tipo: 'receita'})}
              style={{ 
                flex: 1, padding: '10px', borderRadius: '6px', border: 'none', 
                backgroundColor: formData.tipo === 'receita' ? '#10b981' : 'transparent',
                color: formData.tipo === 'receita' ? 'white' : '#666',
                cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold'
              }}
            >
              Receita
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, tipo: 'despesa'})}
              style={{ 
                flex: 1, padding: '10px', borderRadius: '6px', border: 'none', 
                backgroundColor: formData.tipo === 'despesa' ? '#f43f5e' : 'transparent',
                color: formData.tipo === 'despesa' ? 'white' : '#666',
                cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold'
              }}
            >
              Despesa
            </button>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Descrição</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
              <FileText size={18} color="#888" style={{ marginRight: '10px' }} />
              <input 
                type="text" 
                value={formData.descricao}
                onChange={(e) => {
                  const val = e.target.value.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
                  setFormData({...formData, descricao: val});
                }}
                required
                placeholder="Ex: Venda de Cílios, Aluguel..."
                style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Valor (R$)</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                <DollarSign size={18} color="#888" style={{ marginRight: '10px' }} />
                <input 
                  type="text" 
                  value={formData.valorExibicao || ''}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val === '') {
                      setFormData({...formData, valor: 0, valorExibicao: ''});
                      return;
                    }
                    let numericValue = (parseInt(val) / 100);
                    setFormData({
                      ...formData, 
                      valor: numericValue,
                      valorExibicao: numericValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    });
                  }}
                  required
                  placeholder="0,00"
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }}
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Data</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                <Calendar size={18} color="#888" style={{ marginRight: '10px' }} />
                <input 
                  type="date" 
                  value={formData.data}
                  onChange={(e) => setFormData({...formData, data: e.target.value})}
                  required
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Observações (Opcional)</label>
            <div style={{ display: 'flex', alignItems: 'flex-start', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
              <MessageSquare size={18} color="#888" style={{ marginRight: '10px', marginTop: '2px' }} />
              <textarea 
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                placeholder="Ex: Já saiu da conta, aguardando compensação..."
                style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none', minHeight: '80px', resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#ccc', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" className="action-btn">
              <Save size={18} /> {lancamentoParaEditar ? 'Salvar Edição' : 'Salvar Lançamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LancamentoModal;
