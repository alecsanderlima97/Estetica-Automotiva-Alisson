import React, { useState, useEffect } from 'react';
import { X, Save, Package, Hash, AlertTriangle } from 'lucide-react';

const ProdutoModal = ({ isOpen, onClose, onSalvar, produtoParaEditar }) => {
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    quantidade: '',
    minimo: '',
    unidade: 'un',
    dataEntrada: '',
    dataSaida: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (produtoParaEditar) {
        setFormData({
          nome: produtoParaEditar.nome,
          categoria: produtoParaEditar.categoria,
          quantidade: produtoParaEditar.quantidade.toString(),
          minimo: produtoParaEditar.minimo.toString(),
          unidade: produtoParaEditar.unidade || 'un',
          dataEntrada: produtoParaEditar.dataEntrada || '',
          dataSaida: produtoParaEditar.dataSaida || ''
        });
      } else {
        setFormData({
          nome: '',
          categoria: '',
          quantidade: '',
          minimo: '',
          unidade: 'un',
          dataEntrada: new Date().toISOString().split('T')[0],
          dataSaida: ''
        });
      }
    }
  }, [isOpen, produtoParaEditar]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar({
      ...formData,
      quantidade: parseInt(formData.quantidade),
      minimo: parseInt(formData.minimo)
    });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '550px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--text-light)', margin: 0 }}>
            {produtoParaEditar ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Nome do Produto</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
              <Package size={18} color="#888" style={{ marginRight: '10px' }} />
              <input 
                type="text" 
                value={formData.nome}
                onChange={(e) => {
                  const val = e.target.value.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
                  setFormData({...formData, nome: val});
                }}
                required
                placeholder="Ex: Cera de Carnaúba 200g"
                style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Categoria</label>
              <input 
                type="text" 
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                required
                placeholder="Ex: Polimento"
                style={{ 
                  width: '100%', 
                  background: 'rgba(0,0,0,0.2)', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  color: 'var(--text-light)', 
                  outline: 'none' 
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Unidade</label>
              <select 
                value={formData.unidade}
                onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                style={{ 
                  width: '100%', 
                  background: 'rgba(0,0,0,0.2)', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  color: 'var(--text-light)', 
                  outline: 'none' 
                }}
              >
                <option value="un">Unidade (un)</option>
                <option value="l">Litro (L)</option>
                <option value="ml">Mililitro (ml)</option>
                <option value="kg">Quilograma (kg)</option>
                <option value="g">Grama (g)</option>
                <option value="galão">Galão</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Estoque Atual</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                <Hash size={18} color="#888" style={{ marginRight: '10px' }} />
                <input 
                  type="number" 
                  value={formData.quantidade}
                  onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                  required
                  placeholder="0"
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }}
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Estoque Mínimo</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                <AlertTriangle size={18} color="#888" style={{ marginRight: '10px' }} />
                <input 
                  type="number" 
                  value={formData.minimo}
                  onChange={(e) => setFormData({...formData, minimo: e.target.value})}
                  required
                  placeholder="0"
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Data de Entrada</label>
              <input 
                type="date" 
                value={formData.dataEntrada}
                onChange={(e) => setFormData({...formData, dataEntrada: e.target.value})}
                style={{ 
                  width: '100%', 
                  background: 'rgba(0,0,0,0.2)', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  color: 'var(--text-light)', 
                  outline: 'none' 
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Data de Saída (Última)</label>
              <input 
                type="date" 
                value={formData.dataSaida}
                onChange={(e) => setFormData({...formData, dataSaida: e.target.value})}
                style={{ 
                  width: '100%', 
                  background: 'rgba(0,0,0,0.2)', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  color: 'var(--text-light)', 
                  outline: 'none' 
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#ccc', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" className="action-btn">
              <Save size={18} /> Salvar Produto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProdutoModal;
