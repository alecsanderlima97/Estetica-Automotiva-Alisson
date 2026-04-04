import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Clock, DollarSign } from 'lucide-react';
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
          <h1 className="page-title">Catálogo de Serviços</h1>
          <p style={{ color: '#aaa', marginTop: '8px' }}>Gerencie os procedimentos e valores oficiais do Studio</p>
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
            placeholder="Buscar serviço no catálogo..." 
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
          <div key={servico.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3 style={{ color: 'var(--text-light)', fontSize: '18px', margin: 0, paddingRight: '12px' }}>{servico.nome}</h3>
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

            <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '16px', flex: 1 }}>{servico.descricao}</p>

            {servico.manutencoes && servico.manutencoes.length > 0 && (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <p style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Manutenções</p>
                {servico.manutencoes.map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#ccc', marginBottom: '4px' }}>
                    <span>{m.dias}</span>
                    <span style={{ fontWeight: '600' }}>R$ {m.valor.toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
              </div>
            )}

            {servico.remocao && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888', marginBottom: '16px' }}>
                <span>Remoção</span>
                <span>R$ {servico.remocao.toFixed(2).replace('.', ',')}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: '#ccc', fontSize: '14px' }}>
                <Clock size={16} style={{ marginRight: '6px' }} color="var(--primary-color)" />
                Aplicação
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
                <DollarSign size={16} style={{ marginRight: '4px' }} color="var(--primary-color)" />
                {servico.preco.toFixed(2).replace('.', ',')}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {servicosFiltrados.length === 0 && (
         <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
           Nenhum serviço encontrado no catálogo.
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
