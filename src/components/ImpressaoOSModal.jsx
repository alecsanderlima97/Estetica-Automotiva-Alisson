import React, { useRef } from 'react';
import { X, Printer, Car, User, Clock, CheckCircle, Shield, AlertCircle, Phone, MapPin, QrCode, FileCheck, Info, CreditCard } from 'lucide-react';

const ImpressaoOSModal = ({ isOpen, onClose, agendamento, cliente }) => {
  const iframeRef = useRef(null);

  if (!isOpen || !agendamento) return null;

  const handlePrint = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const valorTotal = agendamento.valor || 0;
    const valorSinal = valorTotal * 0.3;
    const valorRestante = valorTotal - (agendamento.pagoSinal ? valorSinal : 0);
    const agendamentoId = agendamento.id.toString().padStart(4, '0');
    const dataEmissao = new Date().toLocaleDateString('pt-BR');
    const horaEmissao = new Date().toLocaleTimeString('pt-BR').substring(0, 5);

    const htmlContent = `
      <html>
        <head>
          <title>Ordem de Serviço #${agendamentoId}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Oswald:wght@400;700;900&display=swap');
            
            body { 
              margin: 0; 
              padding: 30px; 
              font-family: 'Inter', -apple-system, sans-serif; 
              color: #000 !important; 
              background: #fff !important; 
              line-height: 1.2;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            h1, h2, h3 { font-family: 'Oswald', sans-serif; text-transform: uppercase; margin: 0; color: #111 !important; }
            
            .header { border-bottom: 5px solid #4a5d23; padding-bottom: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
            .primary-bg { background-color: #4a5d23 !important; color: white !important; }
            .dark-bg { background-color: #111 !important; color: white !important; }
            .gray-bg { background-color: #f8f9fa !important; }
            .gold-bg { background-color: #fff9f0 !important; border: 1px solid #ffeeba !important; }
            
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
            .box { padding: 15px; border-radius: 12px; border: 1px solid #ddd; }
            
            table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
            th { padding: 10px; background: #eee !important; border-bottom: 2px solid #000; text-align: left; font-size: 10px; text-transform: uppercase; color: #000; }
            td { padding: 10px; border-bottom: 1px solid #ddd; font-size: 13px; color: #000; }
            
            .checklist { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
            .check-item { display: flex; align-items: center; gap: 6px; font-size: 10px; color: #000; }
            .check-box { width: 12px; height: 12px; border: 1.5px solid #000; border-radius: 2px; }
            
            .terms { font-size: 9px; color: #333; text-align: justify; line-height: 1.3; }
            .signature { text-align:center; margin-top: 35px; }
            .sig-line { border-top: 2px solid #000; padding-top: 8px; font-weight: 800; font-size: 11px; }
            
            .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 80px; font-weight: 900; color: rgba(0,0,0,0.03) !important; white-space: nowrap; z-index: -1; font-family: 'Oswald'; pointer-events: none; }
            
            @media print {
              @page { size: A4; margin: 1cm; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="watermark">ALISSON ESTÉTICA</div>

          <div class="header">
            <div style="display: flex; align-items: center; gap: 15px;">
               <div style="width: 60px; height: 60px; background: #000 !important; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #4a5d23 !important;">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
               </div>
               <div>
                 <h1 style="font-size: 26px; color: #000 !important;">ALISSON ESTÉTICA AUTOMOTIVA</h1>
                 <p style="margin: 3px 0 0 0; font-size: 12px; color: #444 !important; font-weight: 600;">Rua das Garagens, 123 - Centro | (15) 99677-5714</p>
               </div>
            </div>
            <div style="text-align: right;">
              <div class="primary-bg" style="padding: 8px 15px; border-radius: 8px; font-weight: 900; font-size: 13px; text-transform: uppercase;">OS #${agendamentoId}</div>
              <p style="margin: 8px 0 0 0; font-size: 10px; color: #555 !important; font-weight: 700;">EMISSÃO: ${dataEmissao} | ${horaEmissao}</p>
            </div>
          </div>

          <div class="grid-2">
            <div class="box gray-bg">
              <h3 style="font-size: 11px; color: #4a5d23 !important; margin-bottom: 8px; font-weight: 900;">PROPRIETÁRIO / CLIENTE</h3>
              <div style="font-size: 17px; font-weight: 900; color: #000;">${cliente?.nome || agendamento.cliente}</div>
              <div style="font-size: 12px; color: #333; margin-top: 4px;">DOC: ${cliente?.cpf || '---'} | TEL: ${cliente?.telefone || agendamento.telefone}</div>
            </div>
            <div class="box dark-bg">
              <h3 style="font-size: 10px; color: #4a5d23 !important; margin-bottom: 8px; font-weight: 900;">IDENTIFICAÇÃO DO VEÍCULO</h3>
              <div style="font-size: 17px; font-weight: 900; color: #fff;">${cliente?.veiculo?.marca || ''} ${cliente?.veiculo?.modelo || "Veículo"}</div>
              <div style="font-size: 12px; color: #eee; margin-top: 4px;">PLACA: <span style="background: #fff; color: #000; padding: 2px 6px; border-radius: 4px; font-weight: 900; margin-left: 5px;">${cliente?.veiculo?.placa || agendamento.veiculo || '---'}</span></div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 60%">DESCRIÇÃO DO SERVIÇO</th>
                <th style="text-align: center;">ENTRADA</th>
                <th style="text-align: right;">VALOR TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style="font-weight: 900; font-size: 15px; color: #000;">${agendamento.servico}</div>
                  <div style="font-size: 11px; color: #555; margin-top: 4px;">Detalhamento e estética profissional de alto padrão.</div>
                </td>
                <td style="text-align: center; font-weight: 700;">${agendamento.dataStr}<br><span style="color: #666; font-size: 11px;">às ${agendamento.horario}h</span></td>
                <td style="text-align: right; font-weight: 900; font-size: 15px;">R$ ${(valorTotal - (parseFloat(agendamento.valorAdicional) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
              ${parseFloat(agendamento.valorAdicional) > 0 ? `
              <tr class="gray-bg">
                <td style="font-size: 11px; font-weight: bold;">(+) Adicional de Complexidade / Urgência</td>
                <td></td>
                <td style="text-align: right; font-weight: 900;">R$ ${parseFloat(agendamento.valorAdicional).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>` : ''}
            </tbody>
          </table>

          <div class="grid-2">
            <div class="box">
              <h3 style="font-size: 12px; margin-bottom: 12px; font-weight: 900; border-bottom: 1px solid #ddd; padding-bottom: 5px;">CHECKLIST DE RECEBIMENTO</h3>
              <div class="checklist">
                <div class="check-item"><div class="check-box"></div> Tapetes Borracha</div>
                <div class="check-item"><div class="check-box"></div> Painel OK</div>
                <div class="check-item"><div class="check-box"></div> Porta-Objetos</div>
                <div class="check-item"><div class="check-box"></div> Step / Macaco</div>
                <div class="check-item"><div class="check-box"></div> Antena</div>
                <div class="check-item"><div class="check-box"></div> Combustível ___</div>
                <div class="check-item"><div class="check-box"></div> Quilometragem ___</div>
                <div class="check-item"><div class="check-box"></div> Chave Reserva</div>
              </div>
            </div>
            <div class="box gold-bg">
              <h3 style="font-size: 11px; color: #856404 !important; margin-bottom: 8px; font-weight: 900; border-bottom: 1px solid #ffeeba; padding-bottom: 5px;">RELATÓRIO DE AVARIAS</h3>
              <div style="font-size: 11px; min-height: 70px; color: #856404 !important;">
                ${cliente?.veiculo?.avarias || "Inspeção visual técnica realizada no ato do recebimento do veículo."}
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; gap: 30px;">
            <div style="flex: 1;">
              <h3 style="font-size: 11px; margin-bottom: 8px; font-weight: 900;">TERMOS E RESPONSABILIDADE</h3>
              <div class="terms">
                1. Não nos responsabilizamos por objetos de valor não declarados. 2. Prazo de garantia de 24h para lavagens simples. 3. Caso o veículo não seja retirado em até 48h após o aviso, poderá ser cobrada taxa de pátio (R$ 50/dia). 4. O cliente autoriza o uso de imagens para fins de marketing.
              </div>
            </div>
            <div style="width: 250px;">
              <div style="border: 2px solid #000; padding: 15px; border-radius: 12px;">
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: #444; margin-bottom: 5px;">
                  <span>Subtotal:</span><span>R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: #16a34a !important; font-weight: 900; margin-bottom: 10px;">
                  <span>Sinal Pago:</span><span>- R$ ${(agendamento.pagoSinal ? valorSinal : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style="border-top: 2px solid #000; padding-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 900; font-size: 12px; color: #000;">TOTAL À PAGAR:</span>
                  <span class="dark-bg" style="font-size: 18px; font-weight: 900; padding: 4px 10px; border-radius: 6px;">R$ ${valorRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="grid-2" style="margin-top: 50px;">
            <div class="signature">
              <div class="sig-line">ALISSON ESTÉTICA AUTOMOTIVA</div>
              <div style="font-size: 9px; color: #444; margin-top: 5px; font-weight: bold;">RESPONSÁVEL TÉCNICO</div>
            </div>
            <div class="signature">
              <div class="sig-line">ASSINATURA DO CLIENTE</div>
              <div style="font-size: 9px; color: #444; margin-top: 5px; font-weight: bold;">ESTOU DE ACORDO COM OS SERVIÇOS</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();

    // Aguardar as fontes e o layout renderizarem no iframe
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 1000); // 1 segundo de espera garantida
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
      <iframe 
        ref={iframeRef} 
        style={{ position: 'absolute', top: '-10000px', left: '-10000px', width: '100%', height: '100%' }} 
        title="Print OS"
      />

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
        <button onClick={handlePrint} className="action-btn" style={{ background: '#111', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          <Printer size={20} /> GERAR PDF / IMPRIMIR
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
