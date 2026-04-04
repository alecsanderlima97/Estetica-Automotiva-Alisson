import React, { useState, useEffect } from 'react';
import { X, Save, BookOpen, DollarSign, Clock, Layers } from 'lucide-react';

const ServicoModal = ({ isOpen, onClose, onSalvar, servicoParaEditar }) => {
  const [formData, setFormData] = useState({
    nome: '',
    preco: '', // Valor base (geralmente Pequeno)
    descricao: '',
    tempoEstimado: '', // em horas
    categorias: [
      { nome: 'Médio', valor: '' },
      { nome: 'Grande / SUV', valor: '' }
    ]
  });

  useEffect(() => {
    if (isOpen) {
      if (servicoParaEditar) {
        const categoriasPadrao = [
          { nome: 'Médio', valor: '' },
          { nome: 'Grande / SUV', valor: '' }
        ];
        
        if (servicoParaEditar.categorias) {
          servicoParaEditar.categorias.forEach((c, i) => {
            if (i < 2) {
              categoriasPadrao[i] = { nome: c.nome, valor: c.valor.toString() };
            }
          });
        }

        setFormData({
          nome: servicoParaEditar.nome,
          preco: servicoParaEditar.preco.toString(),
          descricao: servicoParaEditar.descricao || '',
          tempoEstimado: servicoParaEditar.tempoEstimado?.toString() || '',
          categorias: categoriasPadrao
        });
      } else {
        setFormData({
          nome: '',
          preco: '',
          descricao: '',
          tempoEstimado: '',
          categorias: [
            { nome: 'Médio', valor: '' },
            { nome: 'Grande / SUV', valor: '' }
          ]
        });
      }
    }
  }, [isOpen, servicoParaEditar]);

  if (!isOpen) return null;

  const handleCategoriaChange = (index, field, value) => {
    const novasCategorias = [...formData.categorias];
    novasCategorias[index][field] = value;
    setFormData({ ...formData, categorias: novasCategorias });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const categoriasFinal = formData.categorias
      .filter(c => c.nome && c.valor)
      .map(c => ({
        nome: c.nome,
        valor: parseFloat(c.valor)
      }));

    onSalvar({
      nome: formData.nome,
      preco: parseFloat(formData.preco),
      descricao: formData.descricao,
      tempoEstimado: formData.tempoEstimado || '2h',
      categorias: categoriasFinal
    });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--text-light)', margin: 0, fontFamily: 'Oswald' }}>
            {servicoParaEditar ? 'EDITAR SERVIÇO' : 'NOVO SERVIÇO DE ESTÉTICA'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Nome do Procedimento</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
              <BookOpen size={18} color="#888" style={{ marginRight: '10px' }} />
              <input 
                type="text" 
                value={formData.nome}
                onChange={(e) => {
                  const val = e.target.value.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
                  setFormData({...formData, nome: val});
                }}
                required
                placeholder="Ex: Polimento Técnico"
                style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Valor Base (Pequeno)</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
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
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Tempo Est. (Ex: 4h)</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                <Clock size={18} color="#888" style={{ marginRight: '10px' }} />
                <input 
                  type="text" 
                  value={formData.tempoEstimado}
                  onChange={(e) => setFormData({...formData, tempoEstimado: e.target.value})}
                  placeholder="Ex: 2h 30min"
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--primary-color)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Adicionais por Categoria de Veículo</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {formData.categorias.map((c, index) => (
                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ flex: 2, display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', padding: '10px', color: '#ccc', border: '1px solid rgba(255,255,255,0.02)' }}>
                    <Layers size={14} style={{ marginRight: '8px' }} />
                    <span style={{ fontSize: '14px' }}>{c.nome}</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                    <span style={{ color: '#888', marginRight: '4px', fontSize: '14px' }}>R$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      value={c.valor}
                      onChange={(e) => handleCategoriaChange(index, 'valor', e.target.value)}
                      style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Descrição / O que inclui</label>
            <textarea 
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              rows="3"
              placeholder="Descreva o que será feito no veículo..."
              style={{ 
                width: '100%', 
                background: 'rgba(0,0,0,0.3)', 
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
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#888', cursor: 'pointer' }}>
              CANCELAR
            </button>
            <button type="submit" className="action-btn" style={{ padding: '10px 25px' }}>
              <Save size={18} /> SALVAR SERVIÇO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicoModal;
