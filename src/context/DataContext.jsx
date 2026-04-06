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
  };  const [servicos, setServicos] = useState(() => getInitialData('alisson_servicos_final', [
    { 
      id: 1, 
      nome: 'Limpeza Técnica', 
      categoria: 'ESTÉTICA',
      preco: 150, 
      tempoEstimado: '3h', 
      descricao: 'Limpeza interna e externa detalhada, com aplicação de selante nos pneus, proteção nos plásticos internos, proteção nas caixas de rodas e selante na pintura.',
      categorias: [{ nome: 'Médio', valor: 180 }, { nome: 'Grande / SUV', valor: 220 }]
    },
    { 
      id: 2, 
      nome: 'Limpeza Detalhada', 
      categoria: 'ESTÉTICA',
      preco: 250, 
      tempoEstimado: '5h', 
      descricao: 'Limpeza interna e externa minuciosa com detalhamento em emblemas, maçanetas e retrovisores. Inclui proteção em caixas de rodas, selante nos pneus e proteção de pintura com enceramento à máquina. Realizamos descontaminação de plásticos, bancos e estofados, revitalização de plásticos internos e externos. Brindes: lixo car + 1 aromatizante personalizado.',
      categorias: [{ nome: 'Médio', valor: 300 }, { nome: 'Grande / SUV', valor: 350 }]
    },
    { 
      id: 3, 
      nome: 'Limpeza Completa Detalhada (Motor + Chassi)', 
      categoria: 'MOTOR',
      preco: 300, 
      tempoEstimado: '6h', 
      descricao: 'Incluso limpeza detalhada de motor e chassi, com aplicação de proteção técnica contra oxidação e ferrugem.',
      categorias: [{ nome: 'Médio', valor: 350 }, { nome: 'Grande / SUV', valor: 400 }]
    },
    { 
      id: 4, 
      nome: 'Higienização Completa', 
      categoria: 'INTERIOR',
      preco: 800, 
      tempoEstimado: '8h', 
      descricao: 'Remoção técnica de bancos, carpetes e borrachas. Incluso troca do filtro de ar-condicionado, limpeza profunda e acabamento com proteção interna e externa + brindes exclusivos.',
      categorias: [{ nome: 'Médio', valor: 950 }, { nome: 'Grande / SUV', valor: 1100 }]
    },
    { 
      id: 5, 
      nome: 'Limpeza de Ar-condicionado', 
      categoria: 'INTERIOR',
      preco: 150, 
      tempoEstimado: '1h', 
      descricao: 'Limpeza técnica do sistema com substituição do filtro e aplicação de granada higienizadora.',
      categorias: []
    },
    { 
      id: 6, 
      nome: 'Restauração de Faróis', 
      categoria: 'PINTURA',
      preco: 260, 
      tempoEstimado: '2h', 
      descricao: 'Incluso lixamento técnico à máquina e aplicação de proteção em polímero contra raios solares UV. Durabilidade com garantia de 2 anos.',
      categorias: []
    },
    { 
      id: 7, 
      nome: 'Higienização de Bancos Avulsos', 
      categoria: 'INTERIOR',
      preco: 300, 
      tempoEstimado: '3h', 
      descricao: 'Processo de higienização profunda para bancos em estofados ou tecidos.',
      categorias: []
    },
    { 
      id: 8, 
      nome: 'Limpeza Externa com Proteção', 
      categoria: 'LAVAGEM',
      preco: 80, 
      tempoEstimado: '1h', 
      descricao: 'Lavagem externa com proteção na pintura, aplicação de selante nos pneus e limpeza técnica dos tapetes.',
      categorias: [{ nome: 'Médio', valor: 100 }, { nome: 'Grande / SUV', valor: 120 }]
    },
    { 
      id: 9, 
      nome: 'Instalação de Som Automotivo', 
      categoria: 'ACESSÓRIOS',
      preco: 0, 
      tempoEstimado: '---', 
      descricao: 'Instalação profissional de sistemas de som. Favor levar o veículo até a loja para a realização do orçamento.',
      categorias: []
    },
    { 
      id: 10, 
      nome: 'Polimento Técnico', 
      categoria: 'PINTURA',
      preco: 800, 
      tempoEstimado: '10h', 
      descricao: 'Polimento técnico na pintura com limpeza interna e externa completa. Inclui proteção em todas as superfícies do veículo e brinde personalizado.',
      categorias: [{ nome: 'Médio', valor: 1000 }, { nome: 'Grande / SUV', valor: 1300 }]
    },
    { 
      id: 11, 
      nome: 'Polimento Comercial', 
      categoria: 'PINTURA',
      preco: 500, 
      tempoEstimado: '6h', 
      descricao: 'Focado na remoção de riscos superficiais e restauração do brilho no verniz. Acompanha limpeza externa detalhada.',
      categorias: [{ nome: 'Médio', valor: 650 }, { nome: 'Grande / SUV', valor: 800 }]
    },
    { 
      id: 12, 
      nome: 'Polimento em Motos', 
      categoria: 'MOTOS',
      preco: 300, 
      tempoEstimado: '4h', 
      descricao: 'Incluso limpeza técnica detalhada, proteção nos plásticos, selante nos pneus e limpeza técnica do kit relação.',
      categorias: []
    },
    { 
      id: 13, 
      nome: 'Vitrificação de Pintura (Carro ou Moto)', 
      categoria: 'PINTURA',
      preco: 1000, 
      tempoEstimado: '12h', 
      descricao: 'Proteção de alta performance com garantia de 3 anos. (Moto: R$ 500,00 | Carro: R$ 1.000,00).',
      categorias: [{ nome: 'SUV / Grande', valor: 1400 }]
    },
    { 
      id: 14, 
      nome: 'Limpeza Técnica de Motos', 
      categoria: 'MOTOS',
      preco: 130, 
      tempoEstimado: '2h', 
      descricao: 'Proteção com verniz de motor, selante na pintura e nos pneus, revitalização de plásticos + brinde.',
      categorias: []
    },
    { 
      id: 15, 
      nome: 'Limpeza Detalhada de Motos', 
      categoria: 'MOTOS',
      preco: 220, 
      tempoEstimado: '4h', 
      descricao: 'Detalhamento das relações e remoção das carenagens para maior acesso à limpeza. Inclui proteção nos pneus, pintura e motor com verniz contra oxidação, além de revitalização de plásticos.',
      categorias: []
    },
    { 
      id: 16, 
      nome: 'Remoção de Chuva Ácida nos Vidros', 
      categoria: 'VIDROS',
      preco: 100, 
      tempoEstimado: '2h', 
      descricao: 'Tratamento nos vidros para garantir a maior visibilidade possível e segurança ao dirigir.',
      categorias: []
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
    nome: 'Alisson Henrique Rodrigues de Campos', 
    cargo: 'Proprietário', 
    cpf: '484.130.698-66',
    nascimento: '27/04/1999',
    endereco: 'Rua Ângelo Santos Penteado, 186',
    email: 'walissonrodrigues1055@gmail.com',
    telefone: '+55 (15) 99767-5822',
    cnpj: '42.563.724/0001-93',
    instagram: '@Alisson.est_automotiva',
    osCounter: 1,
    foto: null 
  }));

  // Aplica o tema ao body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('alisson_theme', theme);
  }, [theme]);

  // Efeito para migrar/corrigir agendamentos (numeração OS)
  useEffect(() => {
    const agendamentosSemNumero = agendamentos.some(a => !a.osNumber);
    
    if (agendamentosSemNumero) {
      let counter = 1;
      setAgendamentos(prev => prev.map(a => {
        if (!a.osNumber) {
          const num = counter++;
          return { ...a, osNumber: num };
        }
        if (a.osNumber >= counter) counter = a.osNumber + 1;
        return a;
      }));
      setUserProfile(prev => ({ ...prev, osCounter: counter }));
    }
  }, [agendamentos]);

  // Efeito para migrar/corrigir categorias nos serviços salvos
  useEffect(() => {
    const precisaAjustar = servicos.some(s => !s.categoria || (s.nome === 'Limpeza Técnica' && s.categoria === 'MOTOR'));
    
    if (precisaAjustar) {
      setServicos(prev => prev.map(s => {
        let novaCat = s.categoria;
        
        // Correção específica solicitada pelo usuário
        if (s.nome === 'Limpeza Técnica' && (!s.categoria || s.categoria === 'MOTOR')) {
          novaCat = 'ESTÉTICA';
        } 
        // Preenchimento de categorias faltantes baseado no nome (heurística para dados antigos)
        else if (!s.categoria) {
          if (s.nome.toLowerCase().includes('polimento') || s.nome.toLowerCase().includes('vitrificação')) novaCat = 'PINTURA';
          else if (s.nome.toLowerCase().includes('lavagem') || s.nome.toLowerCase().includes('detalhada')) novaCat = 'LAVAGEM';
          else if (s.nome.toLowerCase().includes('higienização') || s.nome.toLowerCase().includes('couro') || s.nome.toLowerCase().includes('ar-condicionado')) novaCat = 'INTERIOR';
          else if (s.nome.toLowerCase().includes('moto')) novaCat = 'MOTOS';
          else if (s.nome.toLowerCase().includes('chuva ácida')) novaCat = 'VIDROS';
          else if (s.nome.toLowerCase().includes('som') || s.nome.toLowerCase().includes('film')) novaCat = 'ACESSÓRIOS';
          else novaCat = 'ESTÉTICA';
        }
        
        return { ...s, categoria: novaCat };
      }));
    }
  }, [servicos]);

  // Efeito para salvar no localStorage
  useEffect(() => {
    localStorage.setItem('alisson_servicos_final', JSON.stringify(servicos));
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
    const nextOS = userProfile.osCounter || 1;
    setAgendamentos(prev => [...prev, { 
      ...agendamento, 
      id: Date.now(), 
      osNumber: nextOS,
      pagoSinal: agendamento.pagoSinal || false 
    }]);
    setUserProfile(prev => ({ ...prev, osCounter: nextOS + 1 }));
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
