import React, { useState } from 'react';
import { Package, Plus, Edit2, Trash2, Search, AlertTriangle, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import ProdutoModal from '../components/ProdutoModal';

const Estoque = () => {
  const { estoque, addProduto, updateProduto, deleteProduto } = useData();
  const [busca, setBusca] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState(null);

  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const produtosFiltrados = estoque.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  const handleSalvar = (dados) => {
    if (produtoParaEditar) {
      updateProduto(produtoParaEditar.id, dados);
    } else {
      addProduto(dados);
    }
    setIsModalOpen(false);
    setProdutoParaEditar(null);
  };

  const handleEdit = (produto) => {
    setProdutoParaEditar(produto);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduto(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Estoque de Insumos</h1>
          <p style={{ color: '#aaa', marginTop: '8px' }}>Gerencie produtos químicos, ceras e acessórios de detalhamento</p>
        </div>
        <button className="action-btn" onClick={() => { setProdutoParaEditar(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Novo Produto
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
          <h3 style={{ color: '#888', fontSize: '14px' }}>Itens em Estoque</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: 'var(--text-light)' }}>
            {estoque.reduce((acc, curr) => acc + (parseInt(curr.quantidade) || 0), 0)}
          </p>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #dc2626' }}>
          <h3 style={{ color: '#888', fontSize: '14px' }}>Alerta de Reposição</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: '#f87171' }}>
            {estoque.filter(p => p.quantidade <= p.minimo).length}
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Search size={20} color="#888" style={{ marginRight: '12px' }} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou categoria do produto..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ 
              border: 'none', 
              background: 'transparent', 
              color: 'var(--text-light)', 
              width: '100%', 
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Estoque Atual</th>
                <th>Entrada</th>
                <th>Saída</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((produto) => (
                <tr key={produto.id}>
                  <td style={{ fontWeight: '500', color: 'var(--text-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Package size={16} color="var(--primary-color)" /> {produto.nome}
                    </div>
                  </td>
                  <td>{produto.categoria}</td>
                  <td>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: produto.quantidade <= produto.minimo ? '#f87171' : 'var(--text-light)' }}>
                      {produto.quantidade}
                    </span>
                    <span style={{ fontSize: '12px', color: '#888', marginLeft: '4px' }}>({produto.unidade})</span>
                  </td>
                  <td style={{ fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ccc' }}>
                      <Calendar size={14} color="var(--primary-color)" /> {formatarData(produto.dataEntrada)}
                    </div>
                  </td>
                  <td style={{ fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ccc' }}>
                      <Calendar size={14} color="#f87171" /> {formatarData(produto.dataSaida)}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {produto.quantidade <= produto.minimo ? (
                      <span className="status cancelado" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={14} /> Repor
                      </span>
                    ) : (
                      <span className="status concluido">Adequado</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => handleEdit(produto)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--secondary-color)', cursor: 'pointer', marginRight: '12px' }}>
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(produto.id)}
                      style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {produtosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    Nenhum produto encontrado no estoque.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProdutoModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setProdutoParaEditar(null); }}
        onSalvar={handleSalvar}
        produtoParaEditar={produtoParaEditar}
      />
    </div>
  );
};

export default Estoque;
