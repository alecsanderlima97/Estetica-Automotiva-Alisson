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

  const [servicos, setServicos] = useState(() => getInitialData('valen_servicos', [
    { 
      id: 1, 
      nome: 'Mega Brasileiro', 
      preco: 200.00, 
      descricao: 'Extensão de cílios Mega Brasileiro',
      manutencoes: [
        { dias: 'Até 20 dias', valor: 100.00 },
        { dias: '21 a 25 dias', valor: 110.00 },
        { dias: '25 a 30 dias', valor: 120.00 }
      ],
      remocao: 40.00
    },
    { 
      id: 2, 
      nome: 'Mega Luxo', 
      preco: 200.00, 
      descricao: 'Extensão de cílios Mega Luxo',
      manutencoes: [
        { dias: 'Até 20 dias', valor: 110.00 },
        { dias: 'Até 30 dias', valor: 130.00 }
      ]
    },
    { 
      id: 3, 
      nome: 'Volume Egípcio 3D', 
      preco: 160.00, 
      descricao: 'Técnica de Volume Egípcio 3D (Disponível no castanho por R$170,00)',
      manutencoes: [
        { dias: 'Até 15 dias', valor: 90.00 },
        { dias: '16 a 20 dias', valor: 100.00 },
        { dias: '21 a 25 dias', valor: 110.00 }
      ],
      remocao: 40.00
    },
    { 
      id: 4, 
      nome: 'Efeito Fox Eyes 5D', 
      preco: 160.00, 
      descricao: 'Extensão com efeito Fox Eyes 5D',
      manutencoes: [
        { dias: 'Até 15 dias', valor: 80.00 },
        { dias: '16 a 20 dias', valor: 90.00 },
        { dias: '21 a 25 dias', valor: 100.00 }
      ],
      remocao: 40.00
    },
    { 
      id: 5, 
      nome: 'Volume Brasileiro Castanho', 
      preco: 160.00, 
      descricao: 'Volume Brasileiro na cor castanho',
      manutencoes: [
        { dias: 'Até 15 dias', valor: 90.00 },
        { dias: '16 a 20 dias', valor: 100.00 },
        { dias: '21 a 25 dias', valor: 110.00 }
      ],
      remocao: 40.00
    },
    { 
      id: 6, 
      nome: 'Volume Brasileiro', 
      preco: 150.00, 
      descricao: 'Técnica clássica de Volume Brasileiro',
      manutencoes: [
        { dias: '15 a 20 dias', valor: 90.00 },
        { dias: '21 a 25 dias', valor: 100.00 }
      ],
      remocao: 40.00
    },
    { 
      id: 7, 
      nome: 'Efeito Fox 2D', 
      preco: 160.00, 
      descricao: 'Extensão com efeito Fox 2D',
      manutencoes: [
        { dias: '15 a 20 dias', valor: 90.00 },
        { dias: '21 a 25 dias', valor: 100.00 }
      ],
      remocao: 40.00
    },
    { 
      id: 8, 
      nome: 'Maquiagem Beauty', 
      preco: 100.00, 
      descricao: 'Produtos de ótima qualidade, especialidade em colorimetria e visagismo' 
    },
    { 
      id: 9, 
      nome: 'Lash Lifting', 
      preco: 120.00, 
      descricao: 'Curvatura natural dos fios' 
    }
  ]));

  const [clientes, setClientes] = useState(() => getInitialData('valen_clientes', [
    { id: 1, nome: 'Amanda Silva', telefone: '55 15 99123-4567', email: 'amanda@email.com', ultVisita: '10/10/2026', instagram: '@amandsilv', cpf: '123.456.789-00', cep: '18430-000' },
    { id: 2, nome: 'Beatriz Costa', telefone: '55 15 99876-5432', email: 'bia.costa@email.com', ultVisita: '05/11/2026', instagram: '@costabia', cpf: '987.654.321-11', cep: '18430-001' }
  ]));

  const [agendamentos, setAgendamentos] = useState(() => getInitialData('valen_agendamentos', []));

  const [estoque, setEstoque] = useState(() => getInitialData('valen_estoque', [
    { id: 1, nome: 'Caixa Cílios 0.07D 12mm', categoria: 'Cílios', quantidade: 5, minimo: 10, unidade: 'cx' },
    { id: 2, nome: 'Cola Premium 5ml', categoria: 'Adesivos', quantidade: 2, minimo: 5, unidade: 'un' },
    { id: 3, nome: 'Removedor em Gel', categoria: 'Removedores', quantidade: 12, minimo: 5, unidade: 'un' }
  ]));

  const [financeiro, setFinanceiro] = useState(() => getInitialData('valen_financeiro', []));

  const [privacidade, setPrivacidade] = useState(() => {
    const saved = localStorage.getItem('valen_privacidade');
    return saved ? JSON.parse(saved) : false;
  });

  const [theme, setTheme] = useState(() => getInitialData('valen_theme', 'premium'));

  const [userProfile, setUserProfile] = useState(() => getInitialData('valen_user', { 
    nome: 'Melissa Dimas', 
    cargo: 'Administradora', 
    foto: null 
  }));

  // Aplica o tema ao body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('valen_theme', theme);
  }, [theme]);

  // Efeito para salvar no localStorage
  useEffect(() => {
    localStorage.setItem('valen_servicos', JSON.stringify(servicos));
    localStorage.setItem('valen_clientes', JSON.stringify(clientes));
    localStorage.setItem('valen_agendamentos', JSON.stringify(agendamentos));
    localStorage.setItem('valen_estoque', JSON.stringify(estoque));
    localStorage.setItem('valen_financeiro', JSON.stringify(financeiro));
    localStorage.setItem('valen_privacidade', JSON.stringify(privacidade));
    localStorage.setItem('valen_user', JSON.stringify(userProfile));
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
      valen_servicos: servicos,
      valen_clientes: clientes,
      valen_agendamentos: agendamentos,
      valen_estoque: estoque,
      valen_financeiro: financeiro
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_valen_studio_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importData = (jsonData) => {
    try {
      if (jsonData.valen_servicos) setServicos(jsonData.valen_servicos);
      if (jsonData.valen_clientes) setClientes(jsonData.valen_clientes);
      if (jsonData.valen_agendamentos) setAgendamentos(jsonData.valen_agendamentos);
      if (jsonData.valen_estoque) setEstoque(jsonData.valen_estoque);
      if (jsonData.valen_financeiro) setFinanceiro(jsonData.valen_financeiro);
      alert('Dados restaurados com sucesso!');
      window.location.reload();
    } catch (e) {
      alert('Erro ao importar dados. Verifique o arquivo.');
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
