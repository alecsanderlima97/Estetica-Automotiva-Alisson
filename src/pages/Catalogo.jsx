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
        {servicosFiltrados.map((servico) => {
          const isPintura = servico.nome.toLowerCase().includes('polimento') || servico.nome.toLowerCase().includes('vitrificação');
          const isLavagem = servico.nome.toLowerCase().includes('lavagem');
          const isInterior = servico.nome.toLowerCase().includes('higienização') || servico.nome.toLowerCase().includes('couro');
          
          const categoryColor = isPintura ? '#f59e0b' : isLavagem ? '#3b82f6' : isInterior ? '#10b981' : '#8b5cf6';
          const categoryName = isPintura ? 'PINTURA' : isLavagem ? 'LAVAGEM' : isInterior ? 'INTERIOR' : 'MOTOR';

          return (
            <div key={servico.id} className="card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%', 
              borderTop: `4px solid ${categoryColor}`, 
              transition: 'transform 0.2s',
              cursor: 'default'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ 
                    display: 'inline-block', 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: `${categoryColor}20`, 
                    color: categoryColor, 
                    fontSize: '10px', 
                    fontWeight: '900', 
                    marginBottom: '8px',
                    letterSpacing: '1px'
                  }}>
                    {categoryName}
                  </div>
                  <h3 style={{ color: 'var(--text-light)', fontSize: '20px', margin: 0, fontFamily: 'Oswald', textTransform: 'uppercase' }}>{servico.nome}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#888', fontSize: '13px', marginTop: '6px' }}>
                    <Clock size={14} style={{ marginRight: '6px' }} />
                    Execução média: {servico.tempoEstimado || '2h'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                   <button 
                    onClick={() => handleEdit(servico)}
                    title="Editar Procedimento"
                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                     <Edit2 size={16} />
                   </button>
                   <button 
                    onClick={() => handleDelete(servico.id)}
                    title="Remover"
                    style={{ background: 'rgba(220, 38, 38, 0.1)', border: 'none', color: '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>

              <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '16px', flex: 1, lineHeight: '1.6' }}>{servico.descricao}</p>

              {servico.categorias && servico.categorias.length > 0 && (
                <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '11px', color: categoryColor, fontWeight: '900', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Variações por Categoria</p>
                  {servico.categorias.map((cat, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#fff', marginBottom: '8px', borderBottom: idx !== servico.categorias.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', paddingBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Layers size={14} color="#666" />
                        <span style={{ color: '#ccc' }}>{cat.nome}</span>
                      </div>
                      <span style={{ fontWeight: '800' }}>R$ {cat.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: 'auto' }}>
                <div style={{ fontSize: '13px', color: '#666', fontWeight: 'bold' }}>
                  VALOR INICIAL (PEQ)
                </div>
                <div style={{ color: categoryColor, fontSize: '24px', fontWeight: '900', fontFamily: 'Oswald' }}>
                  <span style={{ fontSize: '14px', marginRight: '4px', opacity: 0.7 }}>R$</span>
                  {servico.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          );
        })}
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
