import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Plus, Calendar, Filter, Eye, EyeOff, Printer, Edit2, Trash2, MessageSquare } from 'lucide-react';
import { useData } from '../context/DataContext';
import LancamentoModal from '../components/LancamentoModal';
import RelatorioFinanceiroModal from '../components/RelatorioFinanceiroModal';

const Financeiro = () => {
  const { financeiro, agendamentos, addLancamento, updateLancamento, deleteLancamento, privacidade, setPrivacidade } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRelatorioOpen, setIsRelatorioOpen] = useState(false);
  const [lancamentoParaEditar, setLancamentoParaEditar] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroMes, setFiltroMes] = useState(new Date().getMonth());
  const [filtroAno, setFiltroAno] = useState(new Date().getFullYear());

  const totalReceitasManuais = financeiro
    .filter(l => {
      const d = new Date(l.data);
      return l.tipo === 'receita' && d.getMonth() === filtroMes && d.getFullYear() === filtroAno;
    })
    .reduce((acc, curr) => acc + curr.valor, 0);
  
  const totalReceitasAgendamentos = agendamentos
    .filter(a => {
      if (a.status === 'Cancelado') return false;
      // Parsing robusto: aceita DD/MM/YYYY ou YYYY-MM-DD
      let m, y;
      if (a.dataStr.includes('/')) {
        const partes = a.dataStr.split('/');
        m = parseInt(partes[1]) - 1;
        y = parseInt(partes[2]);
      } else {
        const d = new Date(a.dataStr);
        m = d.getMonth();
        y = d.getFullYear();
      }
      return m === filtroMes && y === filtroAno;
    })
    .reduce((acc, curr) => acc + (curr.valor || 0), 0);

  const totalReceitas = totalReceitasManuais + totalReceitasAgendamentos;
  
  const totalDespesas = financeiro
    .filter(l => {
      const d = new Date(l.data);
      return l.tipo === 'despesa' && d.getMonth() === filtroMes && d.getFullYear() === filtroAno;
    })
    .reduce((acc, curr) => acc + curr.valor, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  // Filtrar para o histórico (manuais + agenda e aplicar filtros)
  const lancamentosExibidos = [
    ...financeiro.map(l => ({ ...l, origem: 'manual' })),
    ...agendamentos
      .filter(a => a.status !== 'Cancelado')
      .map(a => ({
        id: `ag-${a.id}`,
        data: a.dataStr.includes('/') ? a.dataStr.split('/').reverse().join('-') : a.dataStr,
        descricao: `Atendimento: ${a.cliente} (${a.servico})`,
        valor: a.valor || 0,
        tipo: 'receita',
        origem: 'agenda'
      }))
  ].filter(l => {
    const dataLancamento = new Date(l.data);
    const mesMatch = dataLancamento.getMonth() === filtroMes && dataLancamento.getFullYear() === filtroAno;
    const tipoMatch = filtroTipo === 'todos' || l.tipo === filtroTipo;
    return mesMatch && tipoMatch;
  });

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const formatarValor = (valor) => {
    if (privacidade) return 'R$ ••••••';
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const handleSalvar = (dados) => {
    if (lancamentoParaEditar) {
      updateLancamento(lancamentoParaEditar.id, dados);
    } else {
      addLancamento(dados);
    }
    setIsModalOpen(false);
    setLancamentoParaEditar(null);
  };

  const handleEditar = (lancamento) => {
    setLancamentoParaEditar(lancamento);
    setIsModalOpen(true);
  };

  const handleExcluir = (id) => {
    if (window.confirm('Deseja realmente excluir este lançamento?')) {
      deleteLancamento(id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestão Financeira</h1>
          <p style={{ color: '#aaa', marginTop: '8px' }}>Acompanhe o fluxo de caixa do estúdio</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            className="action-btn" 
            style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} 
            onClick={() => setPrivacidade(!privacidade)}
            title={privacidade ? "Mostrar Valores" : "Esconder Valores"}
          >
            {privacidade ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          
          <button 
            className="action-btn" 
            style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} 
            onClick={() => setIsRelatorioOpen(true)}
            title="Gerar Relatório Detalhado"
          >
            <Printer size={18} /> Relatório Detalhado
          </button>
          
          <button className="action-btn" onClick={() => { setLancamentoParaEditar(null); setIsModalOpen(true); }}>
            <Plus size={18} /> Novo Lançamento
          </button>
        </div>
      </div>

      {/* Cards de Balanço */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ borderBottom: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ color: '#888', fontSize: '14px' }}>Entradas Acumuladas</h3>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '50%' }}>
              <ArrowUpRight size={20} color="#10b981" />
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '16px', color: '#10b981' }}>
            {formatarValor(totalReceitas)}
          </p>
        </div>

        <div className="card" style={{ borderBottom: '4px solid #f43f5e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ color: '#888', fontSize: '14px' }}>Saídas Acumuladas</h3>
            <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '8px', borderRadius: '50%' }}>
              <ArrowDownRight size={20} color="#f43f5e" />
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '16px', color: '#f43f5e' }}>
            {formatarValor(totalDespesas)}
          </p>
        </div>

        <div className="card" style={{ borderBottom: `4px solid ${saldoLiquido >= 0 ? 'var(--primary-color)' : '#f43f5e'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ color: '#888', fontSize: '14px' }}>Saldo Líquido</h3>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '50%' }}>
              <DollarSign size={20} color={saldoLiquido >= 0 ? 'var(--primary-color)' : '#f43f5e'} />
            </div>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '16px', color: saldoLiquido >= 0 ? 'var(--text-light)' : '#f43f5e' }}>
            {formatarValor(saldoLiquido)}
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', color: 'var(--text-light)', margin: 0 }}>Histórico de Lançamentos</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select 
            value={filtroTipo} 
            onChange={(e) => setFiltroTipo(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ccc', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', outline: 'none' }}
          >
            <option value="todos" style={{ background: '#1a1f14' }}>Todos os Tipos</option>
            <option value="receita" style={{ background: '#1a1f14' }}>Receitas</option>
            <option value="despesa" style={{ background: '#1a1f14' }}>Despesas</option>
          </select>

          <select 
            value={filtroMes} 
            onChange={(e) => setFiltroMes(parseInt(e.target.value))}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ccc', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', outline: 'none' }}
          >
            {meses.map((mes, idx) => (
              <option key={mes} value={idx} style={{ background: '#1a1f14' }}>{mes}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th style={{ textAlign: 'right' }}>Valor</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lancamentosExibidos.sort((a, b) => new Date(b.data) - new Date(a.data)).map((lancamento) => (
                <tr key={lancamento.id}>
                  <td style={{ color: '#888' }}>{new Date(lancamento.data).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <div style={{ fontWeight: '500', color: 'var(--text-light)' }}>{lancamento.descricao}</div>
                    {lancamento.origem === 'agenda' && <span style={{ fontSize: '10px', color: 'var(--primary-color)', opacity: 0.8 }}>vinda da Agenda</span>}
                    {lancamento.observacoes && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#888', marginTop: '4px', fontStyle: 'italic' }}>
                        <MessageSquare size={12} /> {lancamento.observacoes}
                      </div>
                    )}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: lancamento.tipo === 'receita' ? '#10b981' : '#f43f5e' }}>
                    {lancamento.tipo === 'receita' ? '+' : '-'} {formatarValor(lancamento.valor)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {lancamento.origem === 'manual' && (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEditar(lancamento)} title="Editar" style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleExcluir(lancamento.id)} title="Excluir" style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {lancamentosExibidos.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    Nenhum lançamento no período.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LancamentoModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setLancamentoParaEditar(null); }}
        onSalvar={handleSalvar}
        lancamentoParaEditar={lancamentoParaEditar}
      />

      <RelatorioFinanceiroModal 
        isOpen={isRelatorioOpen}
        onClose={() => setIsRelatorioOpen(false)}
        lancamentos={lancamentosExibidos.sort((a,b) => new Date(b.data) - new Date(a.data))}
        resumo={{
           receitas: totalReceitas,
           despesas: totalDespesas,
           saldo: saldoLiquido
        }}
        periodo={`${meses[filtroMes]} de ${filtroAno}`}
      />
    </div>
  );
};

export default Financeiro;
