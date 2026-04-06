import React, { useRef } from 'react';
import { X, Printer, Car, User, Clock, CheckCircle, Shield, AlertCircle, Phone, MapPin, QrCode, FileCheck, Info, CreditCard } from 'lucide-react';
import { useData } from '../context/DataContext';

const ImpressaoOSModal = ({ isOpen, onClose, agendamento, cliente }) => {
  const iframeRef = useRef(null);
  const { userProfile } = useData();

  if (!isOpen || !agendamento) return null;

  const downloadPDF = async () => {
    const element = document.getElementById('printable-os-preview');
    if (!element || !window.html2canvas || !window.jspdf) {
      alert("Erro ao carregar motor de PDF. Por favor, aguarde 2 segundos.");
      return;
    }

    try {
      // Temporariamente ajusta o estilo para captura completa sem scroll
      const originalStyle = element.style.cssText;
      element.style.height = 'auto';
      element.style.overflow = 'visible';
      element.style.width = '800px'; // Largura fixa para PDF

      const canvas = await window.html2canvas(element, {
        scale: 2, // 2x é suficiente para papel e economiza memória
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800
      });

      // Restaura o estilo do modal no navegador
      element.style.cssText = originalStyle;

      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`OS-${agendamento.id.toString().padStart(4, '0')}-${(cliente?.nome || agendamento.cliente).split(' ')[0]}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro na geração. Tente novamente.");
    }
  };

  const valorTotal = agendamento.valor || 0;
  const valorSinal = valorTotal * 0.3;
  const valorRestante = valorTotal - (agendamento.pagoSinal ? valorSinal : 0);

  return (
    <div className="no-print" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '15px', zIndex: 2001 }}>
        <button 
          onClick={() => {
            const msg = `*ALISSON ESTÉTICA AUTOMOTIVA*%0A%0A*ORDEM DE SERVIÇO #${agendamento.id.toString().padStart(4, '0')}*%0A------------------------------%0A*Cliente:* ${cliente?.nome || agendamento.cliente}%0A*Veículo:* ${cliente?.veiculo?.marca || ''} ${cliente?.veiculo?.modelo || ''}%0A*Placa:* ${cliente?.veiculo?.placa || agendamento.veiculo || '---'}%0A*Serviço:* ${agendamento.servico}%0A*Entrada:* ${agendamento.dataStr} às ${agendamento.horario}%0A------------------------------%0A*VALOR TOTAL:* R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%0A*SINAL PAGO:* R$ ${(agendamento.pagoSinal ? valorSinal : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%0A*SALDO À PAGAR:* R$ ${valorRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%0A%0A_Acesse seu PDF completo no arquivo anexo ou via sistema. Contato: ${userProfile.telefone}_`;
            const phone = (cliente?.telefone || agendamento.telefone || '').replace(/\D/g, '');
            window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(msg.replace(/%0A/g, '\n'))}`, '_blank');
          }}
          className="action-btn" 
          style={{ background: '#25D366', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)' }}
        >
          <Phone size={20} /> ENVIAR WHATSAPP
        </button>
        <button onClick={downloadPDF} className="action-btn" style={{ background: '#111', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          <Printer size={20} /> BAIXAR PDF ECONÔMICO
        </button>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={24} />
        </button>
      </div>

      <div id="printable-os-preview" style={{
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '850px',
        height: '92vh',
        overflowY: 'auto',
        borderRadius: '4px',
        padding: '40px',
        color: '#000',
        fontFamily: "'Inter', sans-serif",
        position: 'relative'
      }}>
        {/* Cabeçalho Minimalista */}
        <div style={{ borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <div style={{ width: '60px', height: '60px', border: '2px solid #000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
               <Car size={40} />
             </div>
             <div>
               <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', fontFamily: 'Oswald', color: '#000' }}>ALISSON ESTÉTICA AUTOMOTIVA</h1>
               <p style={{ margin: 0, fontSize: '10px', color: '#000', fontWeight: '500' }}>{userProfile.endereco} | CNPJ: {userProfile.cnpj} | {userProfile.telefone}</p>
             </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', border: '2px solid #000', padding: '5px 15px', borderRadius: '4px', display: 'inline-block' }}>
               ORDEM DE SERVIÇO #{agendamento.id.toString().padStart(4, '0')}
            </div>
            <p style={{ margin: '5px 0 0 0', fontSize: '10px', color: '#000' }}>
              Emissão: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Informações Planas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div style={{ padding: '15px', border: '1px solid #000', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: '900', marginBottom: '5px', textTransform: 'uppercase' }}>Proprietário</div>
            <div style={{ fontSize: '16px', fontWeight: '800' }}>{cliente?.nome || agendamento.cliente}</div>
            <div style={{ fontSize: '12px' }}>TEL: {cliente?.telefone || agendamento.telefone}</div>
          </div>

          <div style={{ padding: '15px', border: '1px solid #000', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: '900', marginBottom: '5px', textTransform: 'uppercase' }}>Veículo</div>
            <div style={{ fontSize: '16px', fontWeight: '800' }}>{cliente?.veiculo?.marca} {cliente?.veiculo?.modelo}</div>
            <div style={{ fontSize: '12px' }}>PLACA: <strong>{cliente?.veiculo?.placa || agendamento.veiculo || '---'}</strong></div>
          </div>
        </div>

        {/* Tabela Clean */}
        <div style={{ marginBottom: '30px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #000' }}>
                <th style={{ textAlign: 'left', padding: '10px 5px', fontSize: '11px' }}>SERVIÇO REALIZADO</th>
                <th style={{ textAlign: 'center', padding: '10px 5px', fontSize: '11px' }}>DATA/HORA</th>
                <th style={{ textAlign: 'right', padding: '10px 5px', fontSize: '11px' }}>VALOR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '15px 5px', borderBottom: '1px solid #ddd' }}>
                  <div style={{ fontWeight: '800', fontSize: '14px' }}>{agendamento.servico}</div>
                </td>
                <td style={{ padding: '15px 5px', borderBottom: '1px solid #ddd', textAlign: 'center', fontSize: '12px' }}>
                  {agendamento.dataStr} às {agendamento.horario}
                </td>
                <td style={{ padding: '15px 5px', borderBottom: '1px solid #ddd', textAlign: 'right', fontWeight: '800' }}>
                  R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Checklist */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div style={{ padding: '15px', border: '1px solid #000', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>Checklist de Entrada</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
               {['Tapetes', 'Painel OK', 'Porta-Objetos', 'Estepe/Ferram.', 'Antena', 'Nível Comb.', 'Quilometr.', 'Chave Res.'].map(item => (
                 <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                   <div style={{ width: '10px', height: '10px', border: '1px solid #000' }}></div>
                   {item}
                 </div>
               ))}
            </div>
          </div>

          <div style={{ padding: '15px', border: '1px solid #000', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>Avarias Identificadas</h3>
            <div style={{ fontSize: '11px', minHeight: '60px', lineHeight: '1.4' }}>
               {cliente?.veiculo?.avarias || "Nenhuma avaria declarada no ato do recebimento."}
            </div>
          </div>
        </div>

        {/* Termos e Financeiro */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px', marginBottom: '40px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>Termos de Serviço</h3>
            <p style={{ fontSize: '9px', lineHeight: '1.4', margin: 0 }}>
              1. Não nos responsabilizamos por objetos de valor não declarados. 2. Garantia de 24h para lavagens. 3. Taxa de pátio após 48h de aviso (R$ 50/dia). 4. Autorizado uso de fotos do serviço para portfólio.
            </p>
          </div>
          
          <div style={{ width: '240px' }}>
            <div style={{ border: '2px solid #000', padding: '15px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px' }}>
                <span>Subtotal:</span>
                <span>R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '11px', fontWeight: 'bold' }}>
                <span>Sinal Pago:</span>
                <span>- R$ {(agendamento.pagoSinal ? valorSinal : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ borderTop: '1px solid #000', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '900' }}>TOTAL À PAGAR:</span>
                <span style={{ fontSize: '18px', fontWeight: '900' }}>
                  R$ {valorRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assinaturas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '30px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #000', paddingTop: '8px', fontSize: '10px', fontWeight: 'bold' }}>RESPONSÁVEL TÉCNICO</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #000', paddingTop: '8px', fontSize: '10px', fontWeight: 'bold' }}>ASSINATURA DO CLIENTE</div>
          </div>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '9px', color: '#666' }}>
          Documento gerado pelo Sistema Alisson Estética Automotiva em {new Date().toLocaleString('pt-BR')}
        </div>
      </div>
    </div>
  );
};

export default ImpressaoOSModal;
