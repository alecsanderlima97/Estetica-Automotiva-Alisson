import React, { useRef } from 'react';
import { X, Printer, Car, User, Clock, CheckCircle, Shield, AlertCircle, Phone, MapPin, QrCode, FileCheck, Info, CreditCard } from 'lucide-react';

const ImpressaoOSModal = ({ isOpen, onClose, agendamento, cliente }) => {
  const iframeRef = useRef(null);

  if (!isOpen || !agendamento) return null;

  const downloadPDF = async () => {
    const element = document.getElementById('printable-os-preview');
    if (!element || !window.html2canvas || !window.jspdf) {
      alert("Erro ao carregar motor de PDF. Por favor, aguarde 2 segundos e tente novamente.");
      return;
    }

    try {
      // Captura o elemento com alta qualidade (escala 3x)
      const canvas = await window.html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 850 // Fixa a largura para garantir consistência
      });

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
      alert("Houve um erro ao gerar o PDF. Tente usar a opção de imprimir se o download falhar.");
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
            const msg = `*ALISSON ESTÉTICA AUTOMOTIVA*%0A%0A*ORDEM DE SERVIÇO #${agendamento.id.toString().padStart(4, '0')}*%0A------------------------------%0A*Cliente:* ${cliente?.nome || agendamento.cliente}%0A*Veículo:* ${cliente?.veiculo?.marca || ''} ${cliente?.veiculo?.modelo || ''}%0A*Placa:* ${cliente?.veiculo?.placa || agendamento.veiculo || '---'}%0A*Serviço:* ${agendamento.servico}%0A*Entrada:* ${agendamento.dataStr} às ${agendamento.horario}%0A------------------------------%0A*VALOR TOTAL:* R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%0A*SINAL PAGO:* R$ ${(agendamento.pagoSinal ? valorSinal : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%0A*SALDO À PAGAR:* R$ ${valorRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%0A%0A_Acesse seu PDF completo no arquivo anexo ou via sistema._`;
            const phone = (cliente?.telefone || agendamento.telefone || '').replace(/\D/g, '');
            window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(msg.replace(/%0A/g, '\n'))}`, '_blank');
          }}
          className="action-btn" 
          style={{ background: '#25D366', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)' }}
        >
          <Phone size={20} /> ENVIAR WHATSAPP
        </button>
        <button onClick={downloadPDF} className="action-btn" style={{ background: '#111', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          <Printer size={20} /> BAIXAR PDF / IMPRIMIR
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
        borderRadius: '12px',
        padding: '50px',
        color: '#111',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        {/* Marca d'água */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '100px', fontWeight: '900', color: 'rgba(0,0,0,0.03)', whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none', zIndex: 0, fontFamily: 'Oswald' }}>
          ALISSON ESTÉTICA
        </div>

        {/* Cabeçalho */}
        <div style={{ borderBottom: '4px solid var(--primary-color, #4a5d23)', paddingBottom: '30px', marginBottom: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
             <div style={{ width: '70px', height: '70px', background: '#111', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color, #4a5d23)' }}>
               <Car size={45} />
             </div>
             <div>
               <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '900', fontFamily: 'Oswald', letterSpacing: '1px', color: '#111' }}>ALISSON ESTÉTICA AUTOMOTIVA</h1>
               <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
                 <p style={{ margin: 0, fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <MapPin size={14} /> Rua das Garagens, 123 - Centro
                 </p>
                 <p style={{ margin: 0, fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <Phone size={14} /> (15) 99677-5714
                 </p>
               </div>
             </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', background: 'var(--primary-color, #4a5d23)', color: '#fff', padding: '8px 20px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'inline-block' }}>
               ORDEM DE SERVIÇO #{agendamento.id.toString().padStart(4, '0')}
            </div>
            <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase' }}>
              Emissão: {new Date().toLocaleDateString('pt-BR')} | {new Date().toLocaleTimeString('pt-BR').substring(0, 5)}
            </p>
          </div>
        </div>

        {/* Informações Principais */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '35px', position: 'relative', zIndex: 1 }}>
          <div className="print-bg" style={{ padding: '20px', background: '#f8f9fa', border: '1px solid #eee', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#4a5d23', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>
               <User size={14} /> Proprietário
            </div>
            <div style={{ fontSize: '18px', fontWeight: '800' }}>{cliente?.nome || agendamento.cliente}</div>
            <div style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>DOC: {cliente?.cpf || '---'}</div>
            <div style={{ fontSize: '13px', color: '#555' }}>TEL: {cliente?.telefone || agendamento.telefone}</div>
          </div>

          <div className="print-bg" style={{ padding: '20px', background: '#111', color: 'white', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--primary-color, #4a5d23)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>
               <Car size={14} /> Identificação do Veículo
            </div>
            <div style={{ fontSize: '18px', fontWeight: '800' }}>{cliente?.veiculo?.marca} {cliente?.veiculo?.modelo || "Veículo não especificado"}</div>
            <div style={{ fontSize: '13px', color: '#aaa', marginTop: '6px' }}>PLACA: <span style={{ fontWeight: 'bold', color: 'white', fontSize: '15px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{cliente?.veiculo?.placa || agendamento.veiculo || '---'}</span></div>
            <div style={{ fontSize: '13px', color: '#aaa' }}>COR: {cliente?.veiculo?.cor || '---'} | ANO: {cliente?.veiculo?.ano || '---'}</div>
          </div>
        </div>

        {/* Tabela de Serviços */}
        <div style={{ marginBottom: '35px', position: 'relative', zIndex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="print-bg" style={{ background: '#f1f5f9', borderBottom: '3px solid #111' }}>
                <th style={{ textAlign: 'left', padding: '15px', fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px' }}>Descrição do Procedimento</th>
                <th style={{ textAlign: 'center', padding: '15px', fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px' }}>Data Entrada</th>
                <th style={{ textAlign: 'right', padding: '15px', fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px' }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '20px 15px', borderBottom: '1px solid #efefef' }}>
                  <div style={{ fontWeight: '800', fontSize: '16px', color: '#111' }}>{agendamento.servico}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '6px', fontStyle: 'italic' }}>Serviço de alta performance com garantia técnica.</div>
                </td>
                <td style={{ padding: '20px 15px', borderBottom: '1px solid #efefef', textAlign: 'center', fontSize: '14px', color: '#444' }}>
                  <div style={{ fontWeight: 'bold' }}>{agendamento.dataStr}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>às {agendamento.horario}</div>
                </td>
                <td style={{ padding: '20px 15px', borderBottom: '1px solid #efefef', textAlign: 'right', fontWeight: '800', fontSize: '16px' }}>
                  R$ {(valorTotal - (parseFloat(agendamento.valorAdicional) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
              {parseFloat(agendamento.valorAdicional) > 0 && (
                <tr className="print-bg" style={{ background: '#fafafa' }}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #efefef', fontStyle: 'italic', color: '#444', fontSize: '13px' }}>
                     (+) Taxa de Urgência / Adicional de Complexidade
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #efefef' }}></td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #efefef', textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>
                    R$ {parseFloat(agendamento.valorAdicional).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Checklist de Recebimento */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '35px', position: 'relative', zIndex: 1 }}>
          <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '13px', fontWeight: '900', color: '#111', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
               <FileCheck size={16} color="var(--primary-color, #4a5d23)" /> Checklist de Entrada
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
               {[
                 'Tapetes de Borracha', 'Rádio / Painel OK', 'Porta-Objetos Vazio',
                 'Step / Ferramentas', 'Antena Ativa', 'Combustível: ____',
                 'Quilometragem: ____', 'Chave Reserva'
               ].map(item => (
                 <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#555' }}>
                   <div style={{ width: '12px', height: '12px', border: '1px solid #999', borderRadius: '2px' }}></div>
                   {item}
                 </div>
               ))}
            </div>
          </div>

          <div className="print-bg" style={{ padding: '20px', background: '#fff9f0', border: '1px solid #ffeeba', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '900', color: '#856404', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
               <AlertCircle size={16} /> Relatório de Avarias
            </h3>
            <div style={{ minHeight: '80px', borderBottom: '1px dashed #d6b55c', marginBottom: '10px', fontSize: '13px', color: '#856404', lineHeight: '1.6' }}>
               {cliente?.veiculo?.avarias || "Nenhuma avaria declarada no recebimento conforme inspeção visual técnica inicial realizada com o cliente."}
            </div>
            <p style={{ fontSize: '10px', color: '#d6b55c', margin: 0, fontStyle: 'italic' }}>* Riscos, mossas ou manchas identificadas e declaradas.</p>
          </div>
        </div>

        {/* Financeiro e Termos */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', marginBottom: '45px', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', color: '#111', display: 'flex', alignItems: 'center', gap: '6px' }}>
               <Info size={16} /> Termos e Garantia
            </h3>
            <div style={{ fontSize: '10px', color: '#777', lineHeight: '1.6', textAlign: 'justify' }}>
              1. A Alisson Estética Automotiva não se responsabiliza por objetos de valor deixados no interior do veículo e não declarados no checklist. 
              2. O prazo de garantia para lavagens é de 24h e para polimentos/vitrificações conforme certificado anexo. 
              3. Caso o veículo não seja retirado em até 48h após a conclusão, poderá ser cobrada taxa de pátio/estacionamento (R$ 50/dia). 
              4. O cliente autoriza a captação de imagens para fins de registro técnico e marketing (Instagram @alissonestetica).
            </div>
          </div>
          
          <div style={{ width: '280px' }}>
            <div style={{ border: '2px solid #111', padding: '20px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#666', fontSize: '12px' }}>
                <span>Subtotal:</span>
                <span>R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#16a34a', fontSize: '12px', fontWeight: 'bold' }}>
                <span>Sinal Pago (30%):</span>
                <span>- R$ {(agendamento.pagoSinal ? valorSinal : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ borderTop: '2px solid #111', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '900', color: '#111' }}>TOTAL À PAGAR:</span>
                <span className="print-bg" style={{ fontSize: '22px', fontWeight: '900', color: 'white', background: '#111', padding: '4px 12px', borderRadius: '6px' }}>
                  R$ {valorRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', color: '#888', justifyContent: 'center' }}>
              <CreditCard size={14} />
              <span style={{ fontSize: '10px', fontWeight: '600' }}>ACEITAMOS PIX, CARTÃO E DINHEIRO</span>
            </div>
          </div>
        </div>

        {/* Assinaturas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginTop: '40px', paddingBottom: '30px', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ height: '40px' }}></div>
            <div style={{ borderTop: '1.5px solid #111', paddingTop: '12px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#111' }}>Responsável Técnico</div>
            <div style={{ fontSize: '9px', color: '#888', marginTop: '5px' }}>Alisson Estética Automotiva</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ height: '40px' }}></div>
            <div style={{ borderTop: '1.5px solid #111', paddingTop: '12px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#111' }}>Assinatura do Cliente</div>
            <div style={{ fontSize: '9px', color: '#888', marginTop: '5px' }}>Concordo com os itens do checklist e valores</div>
          </div>
        </div>

        {/* Rodapé Interno */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #efefef', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', background: '#f8f9fa', borderRadius: '8px' }}>
                <QrCode size={45} color="#111" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '10px', fontWeight: 'bold' }}>ACESSE NOSSAS REDES</p>
                <p style={{ margin: 0, fontSize: '10px', color: '#aaa' }}>Instagram: @alissonestetica</p>
              </div>
           </div>
           <div style={{ textAlign: 'right', fontSize: '9px', color: '#ccc', letterSpacing: '1.5px' }}>
             DETAILED BY **PREMIUM DETAILING PRO SYSTEM**
           </div>
        </div>
      </div>
    </div>
  );
};

export default ImpressaoOSModal;
