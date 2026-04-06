import React, { useState, useEffect, useRef } from 'react';
import { X, Save, User, Phone, Mail, MapPin, Instagram, Car, Cake, Camera, AlertTriangle, Truck, Upload } from 'lucide-react';
import { useData } from '../context/DataContext';

const ClienteFormModal = ({ isOpen, onClose, clienteParaEditar, onSalvar }) => {
  const { clientes } = useData();
  const [activeTab, setActiveTab] = useState('basico');
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '55 ',
    email: '',
    cpf: '',
    instagram: '',
    dataAniversario: '',
    observacoes: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    complemento: '',
    veiculos: [{
      id: Date.now(),
      tipo: 'carro',
      marca: '',
      modelo: '',
      placa: '',
      cor: '',
      ano: '',
      foto: '',
      avarias: ''
    }]
  });

  const [veiculoIndex, setVeiculoIndex] = useState(0);

  useEffect(() => {
    if (clienteParaEditar) {
      setFormData({
        cep: '',
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        complemento: '',
        ...clienteParaEditar,
        veiculos: clienteParaEditar.veiculos?.length > 0 ? clienteParaEditar.veiculos : [{
          id: Date.now(),
          tipo: 'carro',
          marca: '',
          modelo: '',
          placa: '',
          cor: '',
          ano: '',
          foto: '',
          avarias: ''
        }]
      });
      setVeiculoIndex(0);
    } else {
      setFormData({
        nome: '',
        telefone: '55 ',
        email: '',
        cpf: '',
        instagram: '',
        dataAniversario: '',
        observacoes: '',
        cep: '',
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        complemento: '',
        veiculos: [{
          id: Date.now(),
          tipo: 'carro',
          marca: '',
          modelo: '',
          placa: '',
          cor: '',
          ano: '',
          foto: '',
          avarias: ''
        }]
      });
      setVeiculoIndex(0);
    }
  }, [clienteParaEditar, isOpen]);

  // ... (mesmos useEffects de CEP e CPF) ...
  useEffect(() => {
    const cepClean = formData.cep?.replace(/\D/g, '');
    if (cepClean?.length === 8) {
      fetch(`https://viacep.com.br/ws/${cepClean}/json/`)
        .then(res => res.json())
        .then(data => {
          if (!data.erro) {
            setFormData(prev => ({
              ...prev,
              logradouro: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              estado: data.uf
            }));
          }
        })
        .catch(err => console.error("Erro ao buscar CEP", err));
    }
  }, [formData.cep]);

  useEffect(() => {
    const cpfRaw = formData.cpf?.replace(/\D/g, '');
    if (!clienteParaEditar && cpfRaw?.length === 11) {
      const clienteExistente = clientes.find(c => c.cpf?.replace(/\D/g, '') === cpfRaw);
      if (clienteExistente) {
        setFormData(prev => ({
          ...prev,
          nome: clienteExistente.nome,
          telefone: clienteExistente.telefone,
          email: clienteExistente.email,
          instagram: clienteExistente.instagram,
          dataAniversario: clienteExistente.dataAniversario || '',
          cep: clienteExistente.cep || '',
          logradouro: clienteExistente.logradouro || '',
          numero: clienteExistente.numero || '',
          bairro: clienteExistente.bairro || '',
          cidade: clienteExistente.cidade || '',
          estado: clienteExistente.estado || '',
          complemento: clienteExistente.complemento || '',
          veiculos: clienteExistente.veiculos || prev.veiculos
        }));
      }
    }
  }, [formData.cpf, clientes, clienteParaEditar]);

  const applyMask = (name, value) => {
    let raw = value.replace(/\D/g, '');
    if (name === 'cpf') return raw.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').slice(0, 14);
    if (name === 'cep') return raw.replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
    if (name === 'telefone') {
      if (!raw.startsWith('55') && raw.length > 0) raw = '55' + raw;
      let masked = raw;
      if (raw.length > 2) masked = raw.replace(/(\d{2})(\d)/, '$1 ($2');
      if (raw.length > 4) masked = masked.replace(/(\d{2}) (\(\d{2})(\d)/, '$1 $2) $3');
      if (raw.length > 9) masked = masked.replace(/(\) \d{5})(\d)/, '$1-$2');
      return masked.slice(0, 19);
    }
    if (name === 'placa') return value.toUpperCase().slice(0, 7);
    return value;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'nome') value = value.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    if (name === 'telefone' && value.length < 3) {
      setFormData(prev => ({ ...prev, [name]: '55 ' }));
      return;
    }
    const maskedValue = applyMask(name, value);
    setFormData(prev => ({ ...prev, [name]: maskedValue }));
  };

  const handleVeiculoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const novosVeiculos = [...prev.veiculos];
      novosVeiculos[veiculoIndex] = { ...novosVeiculos[veiculoIndex], [name]: value };
      return { ...prev, veiculos: novosVeiculos };
    });
  };

  const addNovoVeiculo = () => {
    setFormData(prev => ({
      ...prev,
      veiculos: [...prev.veiculos, {
        id: Date.now(),
        tipo: 'carro',
        marca: '',
        modelo: '',
        placa: '',
        cor: '',
        ano: '',
        foto: '',
        avarias: ''
      }]
    }));
    setVeiculoIndex(formData.veiculos.length);
  };

  const removerVeiculo = (idx) => {
    if (formData.veiculos.length === 1) return;
    setFormData(prev => ({
      ...prev,
      veiculos: prev.veiculos.filter((_, i) => i !== idx)
    }));
    setVeiculoIndex(0);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => {
          const novosVeiculos = [...prev.veiculos];
          novosVeiculos[veiculoIndex] = { ...novosVeiculos[veiculoIndex], foto: reader.result };
          return { ...prev, veiculos: novosVeiculos };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar(formData);
  };

  const tabStyle = (id) => ({
    padding: '12px 24px',
    cursor: 'pointer',
    color: activeTab === id ? 'var(--primary-color)' : '#888',
    borderBottom: activeTab === id ? '2px solid var(--primary-color)' : '2px solid transparent',
    transition: 'all 0.3s',
    fontWeight: activeTab === id ? 'bold' : 'normal',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  });

  if (!isOpen) return null;

  const currentVeiculo = formData.veiculos[veiculoIndex] || {};

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '800px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: 'var(--text-light)', margin: 0, fontFamily: 'Oswald', letterSpacing: '1px' }}>
            {clienteParaEditar ? 'EDITAR FICHA CADASTRAL' : 'NOVO CADASTRO DE CLIENTE'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={tabStyle('basico')} onClick={() => setActiveTab('basico')}>
            <User size={18} /> Dados do Cliente
          </div>
          <div style={tabStyle('veiculo')} onClick={() => setActiveTab('veiculo')}>
            <Car size={18} /> Veículos ({formData.veiculos.length})
          </div>
          <div style={tabStyle('endereco')} onClick={() => setActiveTab('endereco')}>
            <MapPin size={18} /> Endereço / Delivery
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {activeTab === 'basico' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Nome Completo *</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                    <User size={18} color="#888" style={{ marginRight: '10px' }} />
                    <input required type="text" name="nome" value={formData.nome || ''} onChange={handleChange}
                      style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} placeholder="Nome do Cliente" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Data de Aniversário</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                    <Cake size={18} color="#888" style={{ marginRight: '10px' }} />
                    <input type="date" name="dataAniversario" value={formData.dataAniversario || ''} onChange={handleChange}
                      style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Telefone (WhatsApp) *</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                    <Phone size={18} color="#888" style={{ marginRight: '10px' }} />
                    <input required type="tel" name="telefone" value={formData.telefone || ''} onChange={handleChange}
                      style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Instagram</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                    <Instagram size={18} color="#888" style={{ marginRight: '10px' }} />
                    <input type="text" name="instagram" value={formData.instagram || ''} onChange={handleChange}
                      style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} placeholder="@user" />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>CPF</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                    <Mail size={18} color="#888" style={{ marginRight: '10px' }} />
                    <input type="text" name="cpf" value={formData.cpf || ''} onChange={handleChange}
                      style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} placeholder="000.000.000-00" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Email</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                    <Mail size={18} color="#888" style={{ marginRight: '10px' }} />
                    <input type="email" name="email" value={formData.email || ''} onChange={handleChange}
                      style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} placeholder="cliente@email.com" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'endereco' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>CEP</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                    <MapPin size={18} color="#888" style={{ marginRight: '10px' }} />
                    <input type="text" name="cep" value={formData.cep || ''} onChange={handleChange}
                      style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} placeholder="00000-000" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Bairro</label>
                  <input type="text" name="bairro" value={formData.bairro || ''} onChange={handleChange}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: 'white', width: '100%', outline: 'none' }} placeholder="Bairro" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Logradouro (Rua/Avenida)</label>
                <input type="text" name="logradouro" value={formData.logradouro || ''} onChange={handleChange}
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: 'white', width: '100%', outline: 'none' }} placeholder="Rua..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Número</label>
                  <input type="text" name="numero" value={formData.numero || ''} onChange={handleChange}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: 'white', width: '100%', outline: 'none' }} placeholder="123" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Complemento</label>
                  <input type="text" name="complemento" value={formData.complemento || ''} onChange={handleChange}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: 'white', width: '100%', outline: 'none' }} placeholder="Apto, Bloco..." />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Cidade</label>
                  <input type="text" name="cidade" value={formData.cidade || ''} onChange={handleChange}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: 'white', width: '100%', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Estado (UF)</label>
                  <input type="text" name="estado" value={formData.estado || ''} onChange={handleChange}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: 'white', width: '100%', outline: 'none' }} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'veiculo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s ease' }}>
              
              {/* Seletor de Veículos Horizontal */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                {formData.veiculos.map((v, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <button 
                      type="button"
                      onClick={() => setVeiculoIndex(idx)}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: veiculoIndex === idx ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                        background: veiculoIndex === idx ? 'rgba(var(--primary-rgb), 0.1)' : 'rgba(0,0,0,0.2)',
                        color: veiculoIndex === idx ? 'var(--primary-color)' : '#888',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Car size={16} /> 
                      {v.modelo || `Veículo ${idx + 1}`}
                      {v.placa && ` (${v.placa})`}
                    </button>
                    {formData.veiculos.length > 1 && (
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); removerVeiculo(idx); }}
                        style={{ position: 'absolute', top: '-8px', right: '-8px', width: '20px', height: '20px', borderRadius: '50%', background: '#dc2626', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={addNovoVeiculo}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', border: '1px dashed #555', background: 'transparent', color: '#888', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}
                >
                  <Plus size={16} /> Adicionar Veículo
                </button>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Tipo</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px 12px' }}>
                      <select name="tipo" value={currentVeiculo.tipo} onChange={handleVeiculoChange}
                        style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', cursor: 'pointer' }}>
                        <option value="carro" style={{ background: '#222' }}>Carro</option>
                        <option value="moto" style={{ background: '#222' }}>Moto</option>
                        <option value="outros" style={{ background: '#222' }}>Outros</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Marca / Fabricante</label>
                    <input type="text" name="marca" value={currentVeiculo.marca || ''} onChange={handleVeiculoChange}
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: 'white', width: '100%', outline: 'none' }} placeholder="Ex: BMW, Honda" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Modelo / Versão</label>
                    <input type="text" name="modelo" value={currentVeiculo.modelo || ''} onChange={handleVeiculoChange}
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: 'white', width: '100%', outline: 'none' }} placeholder="Ex: 320i / Hornet" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Placa</label>
                      <input type="text" name="placa" value={currentVeiculo.placa || ''} onChange={handleVeiculoChange}
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: 'white', width: '100%', outline: 'none' }} placeholder="ABC1D23" />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Ano</label>
                      <input type="number" name="ano" value={currentVeiculo.ano || ''} onChange={handleVeiculoChange}
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: 'white', width: '100%', outline: 'none' }} placeholder="2023" />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Cor Predominante</label>
                    <input type="text" name="cor" value={currentVeiculo.cor || ''} onChange={handleVeiculoChange}
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: 'white', width: '100%', outline: 'none' }} placeholder="Ex: Azul / Preto" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Foto do Veículo</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                        <Camera size={18} color="#888" style={{ marginRight: '10px' }} />
                        <input type="text" name="foto" value={(currentVeiculo.foto && currentVeiculo.foto.startsWith('data:')) ? 'Imagem ✓' : (currentVeiculo.foto || '')} onChange={handleVeiculoChange}
                          style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} placeholder="URL da foto" />
                      </div>
                      <button type="button" onClick={triggerFileInput} style={{ padding: '0 12px', borderRadius: '8px', border: '1px solid var(--primary-color)', background: 'transparent', color: 'var(--primary-color)', cursor: 'pointer' }}>
                        <Upload size={16} />
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" style={{ display: 'none' }} />
                    </div>
                  </div>
                </div>

                {currentVeiculo.foto && (
                  <div style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', width: '120px', height: '120px' }}>
                    <img src={currentVeiculo.foto} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Relatório de Avarias</label>
                  <textarea name="avarias" value={currentVeiculo.avarias || ''} onChange={handleVeiculoChange}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: '8px', padding: '12px', color: '#ffbaba', width: '100%', outline: 'none', minHeight: '80px' }} placeholder="Descrições técnicas de riscos, batidas, etc..." />
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#888', cursor: 'pointer' }}>
              CANCELAR
            </button>
            <button type="submit" className="action-btn" style={{ padding: '10px 25px' }}>
              <Save size={18} /> {clienteParaEditar ? 'ATUALIZAR CADASTRO' : 'FINALIZAR CADASTRO'}
            </button>
          </div>
        </form>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
};

export default ClienteFormModal;
