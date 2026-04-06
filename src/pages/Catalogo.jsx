import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Clock, DollarSign, Layers, Droplet, Shield, Sparkles, User, Settings, Wind, Bike, Activity } from 'lucide-react';
import { useData } from '../context/DataContext';
import ServicoModal from '../components/ServicoModal';

const CATEGORY_MAP = {
  LAVAGEM: { color: '#3b82f6', icon: Droplet, class: 'card-lavagem' },
  ESTÉTICA: { color: '#8b5cf6', icon: Sparkles, class: 'card-estetica' },
  PINTURA: { color: '#f59e0b', icon: Shield, class: 'card-pintura' },
  INTERIOR: { color: '#10b981', icon: User, class: 'card-interior' },
  MOTOR: { color: '#ef4444', icon: Settings, class: 'card-motor' },
  VIDROS: { color: '#06b6d4', icon: Wind, class: 'card-vidros' },
  MOTOS: { color: '#f43f5e', icon: Bike, class: 'card-motos' },
  ACESSÓRIOS: { color: '#64748b', icon: Activity, class: 'card-acessorios' },
};

const Catalogo = () => {
  const { servicos, addServico, updateServico, deleteServico } = useData();
  const [busca, setBusca] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servicoParaEditar, setServicoParaEditar] = useState(null);

  const servicosFiltrados = servicos.filter(s => 
    s.nome.toLowerCase().includes(busca.toLowerCase()) ||
    s.categoria?.toLowerCase().includes(busca.toLowerCase())
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
          <h1 className="page-title">Catálogo de Procedimentos</h1>
          <p style={{ color: '#aaa', marginTop: '4px' }}>Gerencie os serviços, tempos e valores por categoria de veículo</p>
        </div>
        <button className="action-btn" onClick={() => { setServicoParaEditar(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Novo Procedimento
        </button>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Search size={20} color="#888" style={{ marginRight: '12px' }} />
          <input 
            type="text" 
            placeholder="Buscar procedimento ou categoria..." 
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {servicosFiltrados.map((servico) => {
          const catInfo = CATEGORY_MAP[servico.categoria] || CATEGORY_MAP.LAVAGEM;
          const Icon = catInfo.icon;

          return (
            <div key={servico.id} className={`card ${catInfo.class}`} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden'
            }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
                <div>
                  <div className="category-badge" style={{ 
                    backgroundColor: `${catInfo.color}20`, 
                    color: catInfo.color, 
                    border: `1px solid ${catInfo.color}40`
                  }}>
                    <Icon size={12} />
                    {servico.categoria || 'LAVAGEM'}
                  </div>
                  <h3 style={{ color: 'var(--text-light)', fontSize: '20px', margin: 0, fontFamily: 'Oswald', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{servico.nome}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#888', fontSize: '13px', marginTop: '8px' }}>
                    <Clock size={14} style={{ marginRight: '6px' }} />
                    <span style={{ fontWeight: '500' }}>Tempo: {servico.tempoEstimado || '2h'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                   <button 
                    onClick={(e) => { e.stopPropagation(); handleEdit(servico); }}
                    title="Editar Procedimento"
                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                     <Edit2 size={16} />
                   </button>
                   <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(servico.id); }}
                    title="Remover"
                    style={{ background: 'rgba(220, 38, 38, 0.1)', border: 'none', color: '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>

              <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '20px', flex: 1, lineHeight: '1.6', position: 'relative', zIndex: 2 }}>{servico.descricao}</p>

              {servico.categorias && servico.categorias.length > 0 && (
                <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', position: 'relative', zIndex: 2 }}>
                  <p style={{ fontSize: '11px', color: catInfo.color, fontWeight: '900', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Variações por Categoria</p>
                  {servico.categorias.map((cat, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#fff', marginBottom: idx !== servico.categorias.length - 1 ? '10px' : '0', borderBottom: idx !== servico.categorias.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', paddingBottom: idx !== servico.categorias.length - 1 ? '8px' : '0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Layers size={14} color="#666" />
                        <span style={{ color: '#ccc' }}>{cat.nome}</span>
                      </div>
                      <span style={{ fontWeight: '800', color: '#fff' }}>R$ {cat.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: 'auto', position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '900', letterSpacing: '0.5px' }}>
                  VALOR INICIAL (PEQ)
                </div>
                <div style={{ color: catInfo.color, fontSize: '26px', fontWeight: '900', fontFamily: 'Oswald', display: 'flex', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '14px', marginRight: '4px', opacity: 0.7 }}>R$</span>
                  {servico.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Marca d'água traseira (Ícone da Categoria) */}
              <Icon size={120} style={{ 
                position: 'absolute', 
                bottom: '-20px', 
                right: '-20px', 
                color: `${catInfo.color}10`, 
                zIndex: 1,
                transform: 'rotate(-15deg)'
              }} />
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
