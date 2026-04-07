import React, { useRef } from 'react';
import { X, Printer, Car, User, Clock, CheckCircle, Shield, AlertCircle, Phone, MapPin, QrCode, FileCheck, Info, CreditCard, ArrowLeft, Download } from 'lucide-react';
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
      backgroundColor: '#0a0a0a',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
      padding: '20px'
    }}>
      {/* Botão Voltar no Topo */}
      <div style={{ width: '100%', maxWidth: '850px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={onClose}
          style={{ 
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
            color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', 
            display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600' 
          }}
        >
          <ArrowLeft size={18} /> Voltar
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
          <FileCheck size={24} className="text-primary" />
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Ordem de Serviço</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
          <X size={28} />
        </button>
      </div>

      <div id="printable-os-preview" style={{
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '810px', // Largura A4 aprox em pixels
        height: '75vh',
        overflowY: 'auto',
        borderRadius: '8px',
        padding: '50px',
        color: '#000',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        {/* Cabeçalho Estilo Valen Studio */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <div>
            <h1 style={{ 
              margin: 0, fontSize: '36px', fontWeight: '700', 
              fontFamily: "'Playfair Display', serif", 
              color: '#2d3419', letterSpacing: '1px', textTransform: 'uppercase' 
            }}>
              ALISSON STUDIO
            </h1>
            <p style={{ 
              margin: '2px 0 0 0', fontSize: '12px', color: '#666', 
              letterSpacing: '3px', fontWeight: '500', textTransform: 'uppercase' 
            }}>
              Estética Automotiva de Elite
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#000' }}>
               OS #{agendamento.osNumber ? agendamento.osNumber.toString().padStart(6, '0') : agendamento.id.toString().slice(-6)}
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#666' }}>
              {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div style={{ height: '2px', background: '#000', width: '100%', marginBottom: '30px' }}></div>

        {/* Seção: DADOS DO CLIENTE */}
        <div style={{ 
          background: '#f4f4f4', padding: '8px 15px', marginBottom: '20px', 
          borderRadius: '4px', fontWeight: '800', fontSize: '12px', color: '#333',
          textTransform: 'uppercase', letterSpacing: '1px'
        }}>
          Dados do Cliente
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '25px', padding: '0 10px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Nome:</span>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{cliente?.nome || agendamento.cliente}</div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Telefone:</span>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{cliente?.telefone || agendamento.telefone}</div>
          </div>
        </div>

        {/* Seção: DETALHES DO ATENDIMENTO */}
        <div style={{ 
          background: '#f4f4f4', padding: '8px 15px', marginBottom: '20px', 
          borderRadius: '4px', fontWeight: '800', fontSize: '12px', color: '#333',
          textTransform: 'uppercase', letterSpacing: '1px'
        }}>
          Detalhes do Atendimento
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '20px', marginBottom: '25px', padding: '0 10px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Procedimento:</span>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{agendamento.servico}</div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Horário:</span>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{agendamento.horario}</div>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Data:</span>
            <div style={{ fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {agendamento.dataStr}
              {agendamento.pagoSinal && (
                <span style={{ color: '#1a4d2e', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <CheckCircle size={12} /> SINAL PAGO
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Seção exclusiva Estética: Checklist e Avarias */}
        <div style={{ 
          background: '#f4f4f4', padding: '8px 15px', marginBottom: '20px', 
          borderRadius: '4px', fontWeight: '800', fontSize: '12px', color: '#333',
          textTransform: 'uppercase', letterSpacing: '1px'
        }}>
          Inspeção do Veículo
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px', marginBottom: '25px', padding: '0 10px' }}>
           <div>
             <span style={{ fontSize: '11px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Veículo:</span>
             <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>{agendamento.veiculo || '---'}</div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
               {['Tapetes', 'Painel', 'Estepe', 'Cravos'].map(item => (
                 <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#555' }}>
                   <div style={{ width: '8px', height: '8px', border: '1px solid #000' }}></div> {item}
                 </div>
               ))}
             </div>
           </div>
           <div>
             <span style={{ fontSize: '11px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Avarias / Observações:</span>
             <div style={{ fontSize: '11px', color: '#555', lineHeight: '1.4', marginTop: '5px', border: '1px dashed #ddd', padding: '8px', borderRadius: '4px' }}>
               {agendamento.avarias || "Nenhuma avaria declarada no ato do recebimento."}
             </div>
           </div>
        </div>

        {/* Seção: VALORES */}
        <div style={{ 
          background: '#f4f4f4', padding: '8px 15px', marginBottom: '10px', 
          borderRadius: '4px', fontWeight: '800', fontSize: '12px', color: '#333',
          textTransform: 'uppercase', letterSpacing: '1px'
        }}>
          Valores
        </div>

        <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', marginBottom: '30px' }}>
          <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
            <span style={{ fontSize: '14px', color: '#555' }}>Total do Serviço</span>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
            <span style={{ fontSize: '14px', color: '#555' }}>Sinal Antecipado (30%)</span>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>R$ {valorSinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div style={{ 
            padding: '15px 20px', display: 'flex', justifyContent: 'space-between', 
            background: '#2d3419', color: 'white' 
          }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Valor Restante a Pagar</span>
            <span style={{ fontSize: '18px', fontWeight: '900' }}>R$ {valorRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Assinaturas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginTop: '60px', padding: '0 40px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Assinatura do Cliente
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
               Alisson Studio
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '20px', left: '50px', right: '50px', borderTop: '1px solid #eee', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#aaa' }}>
          <span>Gerado via Alisson Management System</span>
          <span>{new Date().toLocaleString('pt-BR')}</span>
        </div>
      </div>

      {/* Barra de Ações na Parte Inferior */}
      <div style={{ 
        width: '100%', maxWidth: '850px', marginTop: '25px', 
        display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr 1.5fr', gap: '15px' 
      }}>
        <button 
          onClick={onClose}
          style={{ 
            background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', 
            padding: '15px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' 
          }}
        >
          <ArrowLeft size={20} /> Voltar
        </button>

        <button 
          onClick={downloadPDF}
          style={{ 
            background: 'white', color: '#000', border: 'none', 
            padding: '15px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' 
          }}
        >
          <Download size={20} /> Baixar PDF
        </button>

        <button 
          onClick={() => window.print()}
          style={{ 
            background: '#2d3419', color: 'white', border: 'none', 
            padding: '15px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' 
          }}
        >
          <Printer size={20} /> Imprimir
        </button>

        <button 
          onClick={() => {
            const msg = `*ALISSON STUDIO*%0A%0A*ORDEM DE SERVIÇO #${agendamento.osNumber || agendamento.id}*%0A------------------------------%0A*Cliente:* ${cliente?.nome || agendamento.cliente}%0A*Procedimento:* ${agendamento.servico}%0A*Data:* ${agendamento.dataStr}%0A------------------------------%0A*SALDO À PAGAR:* R$ ${valorRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%0A%0A_Aguardamos seu veículo!_`;
            const phone = (cliente?.telefone || agendamento.telefone || '').replace(/\D/g, '');
            window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(msg.replace(/%0A/g, '\n'))}`, '_blank');
          }}
          style={{ 
            background: '#25D366', color: 'white', border: 'none', 
            padding: '15px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' 
          }}
        >
          <Phone size={20} /> Enviar WhatsApp
        </button>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          #printable-os-preview { 
            position: fixed !important; 
            top: 0 !important; 
            left: 0 !important; 
            width: 100% !important; 
            max-width: none !important;
            height: auto !important; 
            margin: 0 !important; 
            padding: 30px !important; 
            box-shadow: none !important;
            overflow: visible !important;
          }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
};

export default ImpressaoOSModal;
