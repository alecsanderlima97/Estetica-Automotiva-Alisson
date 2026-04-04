import React, { useState, useEffect } from 'react';
import { X, Save, User, Phone, Mail, MapPin, Instagram, ClipboardList, Fingerprint } from 'lucide-react';
import { useData } from '../context/DataContext';
import FichaAnamnese from './FichaAnamnese';

const ClienteFormModal = ({ isOpen, onClose, clienteParaEditar, onSalvar }) => {
  const { clientes } = useData();
  const [activeTab, setActiveTab] = useState('basico');
  
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '55 ',
    email: '',
    cep: '',
    cpf: '',
    instagram: '',
    observacoes: ''
  });

  const [anamneseData, setAnamneseData] = useState({
    lentes: false,
    alergia: false,
    problemaOcular: false,
    gestante: false,
    alergiaDetalhes: '',
    procedimentosAnteriores: '',
    obsProfissional: ''
  });

  useEffect(() => {
    if (clienteParaEditar) {
      setFormData(clienteParaEditar);
      setAnamneseData(clienteParaEditar.anamnese || {
        lentes: false,
        alergia: false,
        problemaOcular: false,
        gestante: false,
        alergiaDetalhes: '',
        procedimentosAnteriores: '',
        obsProfissional: ''
      });
    } else {
      setFormData({
        nome: '',
        telefone: '55 ',
        email: '',
        cep: '',
        cpf: '',
        instagram: '',
        observacoes: ''
      });
      setAnamneseData({
        lentes: false,
        alergia: false,
        problemaOcular: false,
        gestante: false,
        alergiaDetalhes: '',
        procedimentosAnteriores: '',
        obsProfissional: ''
      });
    }
  }, [clienteParaEditar, isOpen]);

  // Lógica para puxar nome pelo CPF
  useEffect(() => {
    const cpfRaw = formData.cpf.replace(/\D/g, '');
    if (!clienteParaEditar && cpfRaw.length === 11) {
      const clienteExistente = clientes.find(c => c.cpf?.replace(/\D/g, '') === cpfRaw);
      if (clienteExistente) {
        setFormData(prev => ({
          ...prev,
          nome: clienteExistente.nome,
          telefone: clienteExistente.telefone,
          email: clienteExistente.email,
          cep: clienteExistente.cep,
          instagram: clienteExistente.instagram
        }));
        if (clienteExistente.anamnese) {
          setAnamneseData(clienteExistente.anamnese);
        }
      }
    }
  }, [formData.cpf, clientes, clienteParaEditar]);

  const applyMask = (name, value) => {
    let raw = value.replace(/\D/g, '');
    
    if (name === 'cpf') {
      return raw
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .slice(0, 14);
    }
    
    if (name === 'cep') {
      return raw
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 9);
    }
    
    if (name === 'telefone') {
      // Garante que comece com 55
      if (!raw.startsWith('55') && raw.length > 0) {
        raw = '55' + raw;
      }
      
      // 55 (11) 99999-9999
      let masked = raw;
      if (raw.length > 2) {
        masked = raw.replace(/(\d{2})(\d)/, '$1 ($2');
      }
      if (raw.length > 4) {
        masked = masked.replace(/(\d{2}) (\(\d{2})(\d)/, '$1 $2) $3');
      }
      if (raw.length > 9) {
        masked = masked.replace(/(\) \d{5})(\d)/, '$1-$2');
      }
      return masked.slice(0, 19);
    }
    
    return value;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Capitalização automática para o nome
    if (name === 'nome') {
      value = value.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    }
    
    // Se o telefone for apagado totalmente, mantém ou limpa o 55 dependendo do uso
    if (name === 'telefone' && value.length < 3) {
      setFormData(prev => ({ ...prev, [name]: '55 ' }));
      return;
    }

    const maskedValue = applyMask(name, value);
    setFormData(prev => ({ ...prev, [name]: maskedValue }));
  };

  const handleAnamneseChange = (name, value) => {
    setAnamneseData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar({ ...formData, anamnese: anamneseData });
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
      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '750px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: 'var(--text-light)', margin: 0 }}>
            {clienteParaEditar ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={tabStyle('basico')} onClick={() => setActiveTab('basico')}>
            <User size={18} /> Dados Básicos
          </div>
          <div style={tabStyle('anamnese')} onClick={() => setActiveTab('anamnese')}>
            <ClipboardList size={18} /> Ficha de Anamnese
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {activeTab === 'basico' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s ease' }}>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>CPF (Para busca rápida)</label>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    background: 'rgba(0,0,0,0.2)', 
                    border: '1px solid',
                    borderColor: clientes.some(c => c.cpf?.replace(/\D/g, '') === formData.cpf?.replace(/\D/g, '')) && !clienteParaEditar ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                    borderRadius: '8px', 
                    padding: '10px',
                    transition: 'all 0.3s'
                  }}>
                    <Fingerprint size={18} color={clientes.some(c => c.cpf?.replace(/\D/g, '') === formData.cpf?.replace(/\D/g, '')) && !clienteParaEditar ? 'var(--primary-color)' : '#888'} style={{ marginRight: '10px' }} />
                    <input type="text" name="cpf" value={formData.cpf} onChange={handleChange}
                      style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} placeholder="000.000.000-00" />
                    {clientes.some(c => c.cpf?.replace(/\D/g, '') === formData.cpf?.replace(/\D/g, '')) && !clienteParaEditar && (
                      <div style={{ color: 'var(--primary-color)', fontSize: '10px', fontWeight: 'bold', marginLeft: '5px', whiteSpace: 'nowrap' }}>ENCONTRADA ✓</div>
                    )}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Nome Completo *</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                    <User size={18} color="#888" style={{ marginRight: '10px' }} />
                    <input required type="text" name="nome" value={formData.nome || ''} onChange={handleChange}
                      style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} placeholder="Ex: Melissa Dimas" />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Telefone (WhatsApp) *</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                    <Phone size={18} color="#888" style={{ marginRight: '10px' }} />
                    <input required type="tel" name="telefone" value={formData.telefone || ''} onChange={handleChange}
                      style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} placeholder="15 99677-5414" />
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Instagram</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                    <Instagram size={18} color="#888" style={{ marginRight: '10px' }} />
                    <input type="text" name="instagram" value={formData.instagram || ''} onChange={handleChange}
                      style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} placeholder="@cliente" />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Email</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                    <Mail size={18} color="#888" style={{ marginRight: '10px' }} />
                    <input type="email" name="email" value={formData.email || ''} onChange={handleChange}
                      style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} placeholder="email@exemplo.com" />
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>CEP</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '10px' }}>
                    <MapPin size={18} color="#888" style={{ marginRight: '10px' }} />
                    <input type="text" name="cep" value={formData.cep || ''} onChange={handleChange}
                      style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', width: '100%', outline: 'none' }} placeholder="00000-000" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <FichaAnamnese data={anamneseData} onChange={handleAnamneseChange} />
            </div>
          )}

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#ccc', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" className="action-btn">
              <Save size={18} /> {clienteParaEditar ? 'Atualizar Cliente' : 'Salvar Cliente'}
            </button>
          </div>

        </form>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
};

export default ClienteFormModal;
