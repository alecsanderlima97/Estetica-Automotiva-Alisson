import React, { useState, useEffect } from 'react';
import { X, Save, BookOpen, DollarSign, Clock } from 'lucide-react';

const ServicoModal = ({ isOpen, onClose, onSalvar, servicoParaEditar }) => {
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    descricao: '',
    remocao: '',
    manutencoes: [
      { dias: '', valor: '' },
      { dias: '', valor: '' },
      { dias: '', valor: '' }
    ]
  });

  useEffect(() => {
    if (isOpen) {
      if (servicoParaEditar) {
        // Preenche as manutenções existentes e completa com campos vazios até 3
        const manutencoesPadrao = [
          { dias: '', valor: '' },
          { dias: '', valor: '' },
          { dias: '', valor: '' }
        ];
        
        if (servicoParaEditar.manutencoes) {
          servicoParaEditar.manutencoes.forEach((m, i) => {
            if (i < 3) {
              manutencoesPadrao[i] = { dias: m.dias, valor: m.valor.toString() };
            }
          });
        }

        setFormData({
          nome: servicoParaEditar.nome,
          preco: servicoParaEditar.preco.toString(),
          descricao: servicoParaEditar.descricao || '',
          remocao: servicoParaEditar.remocao?.toString() || '',
          manutencoes: manutencoesPadrao
        });
      } else {
        setFormData({
          nome: '',
          preco: '',
          descricao: '',
          remocao: '',
          manutencoes: [
            { dias: '', valor: '' },
            { dias: '', valor: '' },
            { dias: '', valor: '' }
          ]
        });
      }
    }
  }, [isOpen, servicoParaEditar]);

  if (!isOpen) return null;

  const handleManutencaoChange = (index, field, value) => {
    const novasManutencoes = [...formData.manutencoes];
    novasManutencoes[index][field] = value;
    setFormData({ ...formData, manutencoes: novasManutencoes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filtra apenas as manutenções que foram preenchidas
    const manutencoesFinal = formData.manutencoes
      .filter(m => m.dias && m.valor)
      .map(m => ({
        dias: m.dias,
        valor: parseFloat(m.valor)
      }));

    onSalvar({
      nome: formData.nome,
      preco: parseFloat(formData.preco),
      descricao: formData.descricao,
      remocao: formData.remocao ? parseFloat(formData.remocao) : null,
      manutencoes: manutencoesFinal
    });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--text-light)', margin: 0 }}>
            {servicoParaEditar ? 'Editar Serviço' : 'Novo Serviço'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Nome do Serviço</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
              <BookOpen size={18} color="#888" style={{ marginRight: '10px' }} />
              <input 
                type="text" 
                value={formData.nome}
                onChange={(e) => {
                  const val = e.target.value.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
                  setFormData({...formData, nome: val});
                }}
                required
                placeholder="Ex: Volume Brasileiro"
                style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Preço Aplicação</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                <DollarSign size={18} color="#888" style={{ marginRight: '10px' }} />
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({...formData, preco: e.target.value})}
                  required
                  placeholder="0.00"
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }}
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Preço Remoção (Opcional)</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                <DollarSign size={18} color="#888" style={{ marginRight: '10px' }} />
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.remocao}
                  onChange={(e) => setFormData({...formData, remocao: e.target.value})}
                  placeholder="0.00"
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--primary-color)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Opções de Manutenção (Até 3)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {formData.manutencoes.map((m, index) => (
                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ flex: 2 }}>
                    <input 
                      type="text" 
                      placeholder="Ex: Até 15 dias"
                      value={m.dias}
                      onChange={(e) => handleManutencaoChange(index, 'dias', e.target.value)}
                      style={{ 
                        width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', 
                        borderRadius: '8px', padding: '10px', color: 'var(--text-light)', outline: 'none' 
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                    <span style={{ color: '#888', marginRight: '4px', fontSize: '14px' }}>R$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      value={m.valor}
                      onChange={(e) => handleManutencaoChange(index, 'valor', e.target.value)}
                      style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Descrição</label>
            <textarea 
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              rows="2"
              placeholder="Descreva o procedimento..."
              style={{ 
                width: '100%', 
                background: 'rgba(0,0,0,0.2)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '8px', 
                padding: '12px', 
                color: 'var(--text-light)', 
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#ccc', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" className="action-btn">
              <Save size={18} /> Salvar Serviço
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicoModal;
