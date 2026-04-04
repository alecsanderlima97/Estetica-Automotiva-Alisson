import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Funções Auxiliares de Persistência
  const getInitialData = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved || saved === "null" || saved === "undefined") return defaultValue;
      
      try {
        return JSON.parse(saved);
      } catch (parseError) {
        // Se falhar o parse, pode ser que o valor seja apenas uma string sem aspas (ex: premium)
        return saved || defaultValue;
      }
    } catch (e) {
      console.error(`Erro ao carregar ${key}`, e);
      return defaultValue;
    }
  };

  const [servicos, setServicos] = useState(() => getInitialData('alisson_servicos', [
    { 
      id: 1, 
      nome: 'Lavagem Técnica Premium', 
      preco: 120, 
      tempoEstimado: '2h', 
      descricao: 'Lavagem detalhada com flitagem, limpeza de chassis, motor e aplicação de cera líquida.',
      categorias: [{ nome: 'Médio', valor: 150 }, { nome: 'Grande / SUV', valor: 180 }]
    },
    { 
      id: 2, 
      nome: 'Polimento Comercial', 
      preco: 350, 
      tempoEstimado: '5h', 
      descricao: 'Remoção de riscos superficiais e descontaminação da pintura.',
      categorias: [{ nome: 'Médio', valor: 450 }, { nome: 'Grande / SUV', valor: 600 }]
    },
    { 
      id: 3, 
      nome: 'Higienização Interna', 
      preco: 250, 
      tempoEstimado: '4h', 
      descricao: 'Limpeza profunda de bancos, carpetes e teto + Oxi-sanitização.',
      categorias: [{ nome: 'Médio', valor: 300 }, { nome: 'Grande / SUV', valor: 400 }]
    }
  ]));

  const [clientes, setClientes] = useState(() => getInitialData('alisson_clientes', []));

  const [agendamentos, setAgendamentos] = useState(() => getInitialData('alisson_agendamentos', []));

  const [estoque, setEstoque] = useState(() => getInitialData('alisson_estoque', [
    { id: 1, nome: 'Shampoo Automotivo PH Neutro (5L)', categoria: 'Lavagem', quantidade: 3, minimo: 1, unidade: 'galão' },
    { id: 2, nome: 'Cera de Carnaúba Premium (200g)', categoria: 'Acabamento', quantidade: 5, minimo: 2, unidade: 'un' },
    { id: 3, nome: 'APC - Limpador Multiuso (5L)', categoria: 'Limpeza Interna', quantidade: 2, minimo: 1, unidade: 'galão' },
    { id: 4, nome: 'Toalhas de Microfibra 40x40', categoria: 'Acessórios', quantidade: 12, minimo: 20, unidade: 'un' },
    { id: 5, nome: 'Composto Polidor Corte (1kg)', categoria: 'Polimento', quantidade: 1, minimo: 1, unidade: 'un' }
  ]));

  const [financeiro, setFinanceiro] = useState(() => getInitialData('alisson_financeiro', []));

  const [privacidade, setPrivacidade] = useState(() => {
    const saved = localStorage.getItem('alisson_privacidade');
    return saved ? JSON.parse(saved) : false;
  });

  const [theme, setTheme] = useState(() => getInitialData('alisson_theme', 'premium'));

  const [userProfile, setUserProfile] = useState(() => getInitialData('alisson_user', { 
    nome: 'Alisson', 
    cargo: 'Proprietário', 
    foto: null 
  }));

  // Aplica o tema ao body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('alisson_theme', theme);
  }, [theme]);

  // Efeito para salvar no localStorage
  useEffect(() => {
    localStorage.setItem('alisson_servicos', JSON.stringify(servicos));
    localStorage.setItem('alisson_clientes', JSON.stringify(clientes));
    localStorage.setItem('alisson_agendamentos', JSON.stringify(agendamentos));
    localStorage.setItem('alisson_estoque', JSON.stringify(estoque));
    localStorage.setItem('alisson_financeiro', JSON.stringify(financeiro));
    localStorage.setItem('alisson_privacidade', JSON.stringify(privacidade));
    localStorage.setItem('alisson_user', JSON.stringify(userProfile));
  }, [servicos, clientes, agendamentos, estoque, financeiro, privacidade, userProfile]);

  const addCliente = (cliente) => {
    setClientes(prev => [...prev, { ...cliente, id: Date.now() }]);
  };

  const updateCliente = (id, updatedData) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const deleteCliente = (id) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  const addAgendamento = (agendamento) => {
    setAgendamentos(prev => [...prev, { ...agendamento, id: Date.now(), pagoSinal: agendamento.pagoSinal || false }]);
  };

  const updateAgendamento = (id, updatedData) => {
    setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
  };

  const updateAgendamentoStatus = (id, status) => {
    setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const deleteAgendamento = (id) => {
    setAgendamentos(prev => prev.filter(a => a.id !== id));
  };

  const addServico = (servico) => {
    setServicos(prev => [...prev, { ...servico, id: Date.now() }]);
  };

  const updateServico = (id, updatedData) => {
    setServicos(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const deleteServico = (id) => {
    setServicos(prev => prev.filter(s => s.id !== id));
  };

  const addProduto = (produto) => {
    setEstoque(prev => [...prev, { ...produto, id: Date.now() }]);
  };

  const updateProduto = (id, updatedData) => {
    setEstoque(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deleteProduto = (id) => {
    setEstoque(prev => prev.filter(p => p.id !== id));
  };

  const addLancamento = (lancamento) => {
    setFinanceiro(prev => [...prev, { ...lancamento, id: Date.now() }]);
  };

  const updateLancamento = (id, updatedData) => {
    setFinanceiro(prev => prev.map(l => l.id === id ? { ...l, ...updatedData } : l));
  };

  const deleteLancamento = (id) => {
    setFinanceiro(prev => prev.filter(l => l.id !== id));
  };

  const exportData = () => {
    const data = {
      alisson_servicos: servicos,
      alisson_clientes: clientes,
      alisson_agendamentos: agendamentos,
      alisson_estoque: estoque,
      alisson_financeiro: financeiro
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_alisson_estetica_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importData = (jsonData) => {
    try {
      if (jsonData.alisson_servicos) setServicos(jsonData.alisson_servicos);
      if (jsonData.alisson_clientes) setClientes(jsonData.alisson_clientes);
      if (jsonData.alisson_agendamentos) setAgendamentos(jsonData.alisson_agendamentos);
      if (jsonData.alisson_estoque) setEstoque(jsonData.alisson_estoque);
      if (jsonData.alisson_financeiro) setFinanceiro(jsonData.alisson_financeiro);
      alert('Dados restaurados com sucesso!');
      window.location.reload();
    } catch (e) {
      if (jsonData.valen_servicos) setServicos(jsonData.valen_servicos);
      if (jsonData.valen_clientes) setClientes(jsonData.valen_clientes);
      if (jsonData.valen_agendamentos) setAgendamentos(jsonData.valen_agendamentos);
      if (jsonData.valen_estoque) setEstoque(jsonData.valen_estoque);
      if (jsonData.valen_financeiro) setFinanceiro(jsonData.valen_financeiro);
      alert('Dados restaurados (legados) com sucesso!');
      window.location.reload();
    }
  };

  return (
    <DataContext.Provider value={{
      clientes, addCliente, updateCliente, deleteCliente,
      agendamentos, addAgendamento, updateAgendamento, updateAgendamentoStatus, deleteAgendamento,
      servicos, addServico, updateServico, deleteServico,
      estoque, addProduto, updateProduto, deleteProduto,
      financeiro, addLancamento, updateLancamento, deleteLancamento,
      privacidade, setPrivacidade,
      theme, setTheme,
      userProfile, setUserProfile,
      exportData, importData
    }}>
      {children}
    </DataContext.Provider>
  );
};
