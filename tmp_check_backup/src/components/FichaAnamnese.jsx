import React from 'react';

const FichaAnamnese = ({ data, onChange }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange(name, type === 'checkbox' ? checked : value);
  };

  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)'
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#ccc',
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '8px'
  };

  const inputStyle = {
    backgroundColor: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    padding: '10px',
    color: 'white',
    width: '100%',
    outline: 'none',
    marginTop: '4px'
  };

  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
      <h3 style={{ color: 'var(--primary-color)', fontSize: '18px', marginBottom: '16px' }}>Ficha de Anamnese</h3>
      
      <div style={sectionStyle}>
        <h4 style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '12px' }}>Saúde Ocular e Geral</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <label style={labelStyle}>
            <input type="checkbox" name="lentes" checked={data.lentes} onChange={handleChange} />
            Usa lentes de contato?
          </label>
          <label style={labelStyle}>
            <input type="checkbox" name="alergia" checked={data.alergia} onChange={handleChange} />
            Possui alguma alergia?
          </label>
          <label style={labelStyle}>
            <input type="checkbox" name="problemaOcular" checked={data.problemaOcular} onChange={handleChange} />
            Problemas oculares recentes?
          </label>
          <label style={labelStyle}>
            <input type="checkbox" name="gestante" checked={data.gestante} onChange={handleChange} />
            Gestante ou lactante?
          </label>
        </div>
      </div>

      <div style={sectionStyle}>
        <h4 style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '12px' }}>Detalhes Adicionais</h4>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ color: '#888', fontSize: '12px' }}>Alergias específicas / Medicamentos</label>
          <input type="text" name="alergiaDetalhes" value={data.alergiaDetalhes || ''} onChange={handleChange} style={inputStyle} placeholder="Descreva se houver..." />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ color: '#888', fontSize: '12px' }}>Procedimentos estéticos anteriores</label>
          <input type="text" name="procedimentosAnteriores" value={data.procedimentosAnteriores || ''} onChange={handleChange} style={inputStyle} placeholder="Já fez extensões antes?" />
        </div>
        <div>
          <label style={{ color: '#888', fontSize: '12px' }}>Observações da Profissional</label>
          <textarea name="obsProfissional" value={data.obsProfissional || ''} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Notas técnicas..." />
        </div>
      </div>

      <div style={{ padding: '12px', textAlign: 'center', fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
        * Declaro que as informações acima são verdadeiras.
      </div>
    </div>
  );
};

export default FichaAnamnese;
