import React, { useState, useEffect } from 'react';
import { X, ArrowUpCircle, ArrowDownCircle, Package, Check } from 'lucide-react';

const MovimentacaoModal = ({ isOpen, onClose, onConfirm, produto }) => {
  const [tipo, setTipo] = useState('saida'); // Padrão saída como solicitado
  const [quantidade, setQuantidade] = useState('1');

  useEffect(() => {
    if (isOpen) {
      setQuantidade('1');
      setTipo('saida');
    }
  }, [isOpen]);

  if (!isOpen || !produto) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(quantidade) <= 0) return;
    onConfirm(produto.id, parseInt(quantidade), tipo);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ color: 'var(--text-light)', margin: 0, fontSize: '20px' }}>Movimentar Estoque</h2>
            <p style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>{produto.nome}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              type="button"
              onClick={() => setTipo('entrada')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid ' + (tipo === 'entrada' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)'),
                background: tipo === 'entrada' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(0,0,0,0.2)',
                color: tipo === 'entrada' ? 'var(--primary-color)' : '#888',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <ArrowUpCircle size={24} />
              <span style={{ fontWeight: '500' }}>Entrada</span>
            </button>
            <button 
              type="button"
              onClick={() => setTipo('saida')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid ' + (tipo === 'saida' ? '#f87171' : 'rgba(255,255,255,0.05)'),
                background: tipo === 'saida' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(0,0,0,0.2)',
                color: tipo === 'saida' ? '#f87171' : '#888',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <ArrowDownCircle size={24} />
              <span style={{ fontWeight: '500' }}>Saída</span>
            </button>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Quantidade</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
              <Package size={18} color="#888" style={{ marginRight: '10px' }} />
              <input 
                type="number" 
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                required
                min="1"
                style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none', fontSize: '18px' }}
              />
              <span style={{ color: '#888', marginLeft: '8px', fontSize: '14px' }}>{produto.unidade}</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', fontSize: '13px', color: '#aaa' }}>
            <strong>Estoque Atual:</strong> {produto.quantidade} {produto.unidade}<br/>
            <strong>Novo Estoque:</strong> {
              tipo === 'entrada' 
                ? (parseInt(produto.quantidade) + (parseInt(quantidade) || 0)) 
                : Math.max(0, parseInt(produto.quantidade) - (parseInt(quantidade) || 0))
            } {produto.unidade}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#ccc', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className="action-btn"
              style={{ backgroundColor: tipo === 'entrada' ? 'var(--primary-color)' : '#f87171' }}
            >
              <Check size={18} /> Confirmar {tipo === 'entrada' ? 'Entrada' : 'Saída'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovimentacaoModal;
