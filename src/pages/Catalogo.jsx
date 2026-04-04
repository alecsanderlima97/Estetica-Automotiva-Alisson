import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Clock, DollarSign, Layers } from 'lucide-react';
import { useData } from '../context/DataContext';
import ServicoModal from '../components/ServicoModal';

const Catalogo = () => {
  const { servicos, addServico, updateServico, deleteServico } = useData();
  const [busca, setBusca] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servicoParaEditar, setServicoParaEditar] = useState(null);

  const servicosFiltrados = servicos.filter(s => 
    s.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const handleSalvar = (dados) => {
    if (servicoParaEditar) {
      updateServico(servicoParaEditar.id, dados);
    } else {
      addServico(dados);
    }
    setIsModalOpen(false);
    setServicoParaEditar(null);
  };

  const handleEdit = (servico) => {
    setServicoParaEditar(servico);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      deleteServico(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Catálogo de Estética Automotiva</h1>
          <p style={{ color: '#aaa', marginTop: '4px' }}>Gerencie os procedimentos, tempos e valores por categoria de veículo</p>
        </div>
        <button className="action-btn" onClick={() => { setServicoParaEditar(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Novo Serviço
        </button>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Search size={20} color="#888" style={{ marginRight: '12px' }} />
          <input 
            type="text" 
            placeholder="Buscar procedimento..." 
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {servicosFiltrados.map((servico) => (
          <div key={servico.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderTop: '4px solid var(--primary-color)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ color: 'var(--text-light)', fontSize: '18px', margin: 0, fontFamily: 'Oswald' }}>{servico.nome}</h3>
                <div style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '12px', marginTop: '4px' }}>
                  <Clock size={12} style={{ marginRight: '4px' }} />
                  Est. {servico.tempoEstimado || '2h'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                 <button 
                  onClick={() => handleEdit(servico)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--secondary-color)', cursor: 'pointer' }}>
                   <Edit2 size={16} />
                 </button>
                 <button 
                  onClick={() => handleDelete(servico.id)}
                  style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>

            <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '16px', flex: 1, lineHeight: '1.5' }}>{servico.descricao}</p>

            {servico.categorias && servico.categorias.length > 0 && (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Variações por Categoria</p>
                {servico.categorias.map((cat, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#ccc', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Layers size={12} color="#444" />
                      <span>{cat.nome}</span>
                    </div>
                    <span style={{ fontWeight: '600', color: 'white' }}>R$ {cat.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: '#888', fontSize: '13px' }}>
                Valor Base (Peq)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary-color)', fontSize: '20px', fontWeight: 'bold', fontFamily: 'Oswald' }}>
                <span style={{ fontSize: '14px', marginRight: '4px' }}>R$</span>
                {servico.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {servicosFiltrados.length === 0 && (
         <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#666', border: '1px dashed rgba(255,255,255,0.05)' }}>
           Nenhum procedimento cadastrado no catálogo.
         </div>
      )}

      <ServicoModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setServicoParaEditar(null); }}
        onSalvar={handleSalvar}
        servicoParaEditar={servicoParaEditar}
      />
    </div>
  );
};

export default Catalogo;
