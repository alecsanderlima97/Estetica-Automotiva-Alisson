import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, History } from 'lucide-react';
import { useData } from '../context/DataContext';
import ClienteFormModal from '../components/ClienteFormModal';
import ClienteHistoricoModal from '../components/ClienteHistoricoModal';

const Clientes = () => {
  const { clientes, agendamentos, addCliente, updateCliente, deleteCliente } = useData();
  const [busca, setBusca] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [clienteParaHistorico, setClienteParaHistorico] = useState(null);

  const clientesFiltrados = clientes.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase()) || 
    c.telefone.includes(busca) ||
    c.cpf?.includes(busca)
  );

  const handleSalvarCliente = (dadosCliente) => {
    if (clienteEditando) {
      updateCliente(clienteEditando.id, dadosCliente);
    } else {
      addCliente(dadosCliente);
    }
    setIsModalOpen(false);
  };

  const handleExcluir = (id) => {
    if(window.confirm('Tem certeza que deseja excluir esta cliente?')) {
      deleteCliente(id);
    }
  };

  const abrirPainelNovo = () => {
    setClienteEditando(null);
    setIsModalOpen(true);
  };

  const abrirPainelEdicao = (cliente) => {
    setClienteEditando(cliente);
    setIsModalOpen(true);
  };

  const abrirHistorico = (cliente) => {
    setClienteParaHistorico(cliente);
    setIsHistoryOpen(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestão de Clientes</h1>
        <button className="action-btn" onClick={abrirPainelNovo}>
          <Plus size={18} /> Novo Cliente
        </button>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Search size={20} color="#888" style={{ marginRight: '12px' }} />
          <input 
            type="text" 
            placeholder="Buscar por nome, telefone ou CPF..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ 
              border: 'none', 
              background: 'transparent', 
              color: 'var(--text-dark)', 
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
                <th>Nome</th>
                <th>Telefone</th>
                <th>CPF</th>
                <th>Última Visita</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id}>
                  <td style={{ fontWeight: '500' }}>{cliente.nome}</td>
                  <td>{cliente.telefone}</td>
                  <td>{cliente.cpf || '---'}</td>
                  <td>
                    <span className={cliente.ultVisita === 'Novo' ? 'status agendado' : ''} style={cliente.ultVisita !== 'Novo' ? { color: '#888' } : {}}>
                      {cliente.ultVisita || 'Novo'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => abrirHistorico(cliente)} title="Histórico de Procedimentos" style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginRight: '12px' }}>
                      <History size={18} />
                    </button>
                    <button onClick={() => abrirPainelEdicao(cliente)} title="Editar" style={{ background: 'transparent', border: 'none', color: 'var(--secondary-color)', cursor: 'pointer', marginRight: '12px' }}>
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleExcluir(cliente.id)} title="Excluir" style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {clientesFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#888' }}>
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ClienteFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clienteParaEditar={clienteEditando}
        onSalvar={handleSalvarCliente}
      />

      <ClienteHistoricoModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        cliente={clienteParaHistorico}
        agendamentos={agendamentos}
      />
    </div>
  );
};

export default Clientes;
