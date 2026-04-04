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
    veiculo: {
      tipo: 'carro', // carro, moto, outros
      marca: '',
      modelo: '',
      placa: '',
      cor: '',
      ano: '',
      foto: '',
      avarias: ''
    }
  });

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
        veiculo: clienteParaEditar.veiculo || {
          tipo: 'carro',
          marca: '',
          modelo: '',
          placa: '',
          cor: '',
          ano: '',
          foto: '',
          avarias: ''
        }
      });
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
        veiculo: {
          tipo: 'carro',
          marca: '',
          modelo: '',
          placa: '',
          cor: '',
          ano: '',
          foto: '',
          avarias: ''
        }
      });
    }
  }, [clienteParaEditar, isOpen]);

  // Lógica de busca de CEP
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

  // Lógica para puxar dados pelo CPF (Simplificada para o novo modelo)
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
          veiculo: clienteExistente.veiculo || prev.veiculo
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
    setFormData(prev => ({
      ...prev,
      veiculo: { ...prev.veiculo, [name]: value }
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          veiculo: { ...prev.veiculo, foto: reader.result }
        }));
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
            <Car size={18} /> Informações do Veículo
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Tipo de Veículo</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px 12px' }}>
                    <select name="tipo" value={formData.veiculo.tipo} onChange={handleVeiculoChange}
                      style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', cursor: 'pointer' }}>
                      <option value="carro" style={{ background: '#222' }}>Carro</option>
                      <option value="moto" style={{ background: '#222' }}>Moto</option>
                      <option value="outros" style={{ background: '#222' }}>Outros / Náutica / Aviação</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Marca / Fabricante</label>
                  <input type="text" name="marca" value={formData.veiculo.marca || ''} onChange={handleVeiculoChange}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: 'white', width: '100%', outline: 'none' }} placeholder="Ex: BMW, Honda, Yamaha" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Modelo / Versão</label>
                  <input type="text" name="modelo" value={formData.veiculo.modelo || ''} onChange={handleVeiculoChange}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: 'white', width: '100%', outline: 'none' }} placeholder="Ex: 320i M Sport / Hornet" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Placa</label>
                    <input type="text" name="placa" value={formData.veiculo.placa || ''} onChange={handleVeiculoChange}
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: 'white', width: '100%', outline: 'none' }} placeholder="ABC1D23" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Ano</label>
                    <input type="number" name="ano" value={formData.veiculo.ano || ''} onChange={handleVeiculoChange}
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: 'white', width: '100%', outline: 'none' }} placeholder="2023" />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Cor Predominante</label>
                  <input type="text" name="cor" value={formData.veiculo.cor || ''} onChange={handleVeiculoChange}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: 'white', width: '100%', outline: 'none' }} placeholder="Ex: Azul Portimão / Preto Fosco" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Link ou Importar Foto</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                      <Camera size={18} color="#888" style={{ marginRight: '10px' }} />
                      <input type="text" name="foto" value={(formData.veiculo.foto && formData.veiculo.foto.startsWith('data:')) ? 'Imagem Importada ✓' : (formData.veiculo.foto || '')} onChange={handleVeiculoChange}
                        style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} placeholder="URL da foto" />
                    </div>
                    <button type="button" onClick={triggerFileInput} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', borderRadius: '8px', border: '1px solid var(--primary-color)', background: 'rgba(163, 184, 142, 0.1)', color: 'var(--primary-color)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      <Upload size={16} /> Importar
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" style={{ display: 'none' }} />
                  </div>
                </div>

                {formData.veiculo.foto && (
                  <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', width: '100px', height: '100px' }}>
                    <img src={formData.veiculo.foto} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '13px' }}>Relatório de Avarias / Observações Técnicas</label>
                <div style={{ display: 'flex', alignItems: 'flex-start', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: '8px', padding: '10px' }}>
                  <AlertTriangle size={18} color="#dc2626" style={{ marginRight: '10px', marginTop: '4px' }} />
                  <textarea name="avarias" value={formData.veiculo.avarias || ''} onChange={handleVeiculoChange}
                    style={{ border: 'none', background: 'transparent', color: '#ffbaba', width: '100%', outline: 'none', minHeight: '80px', resize: 'vertical' }} placeholder="Descreva riscos, amassados ou pontos de atenção sobre o estado do veículo..." />
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
