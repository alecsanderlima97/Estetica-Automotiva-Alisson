import React from 'react';
import { Instagram, MessageCircle, Heart, Shield, HelpCircle, Code } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Informações da Empresa Desenvolvedora (Orquestra.cs)
  const devInfo = {
    company: "Orquestra.cs",
    fullName: "Orquestra.cs - Desenvolvimento de Software de Alta Performance",
    instagram: "https://www.instagram.com/Orquestra.cs",
    whatsapp: "https://wa.me/5515998478705",
    supportText: "Olá! Gostaria de suporte técnico para Alisson Estética Automotiva."
  };

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">Alisson Estética Automotiva</span>
            <p className="footer-motto">O brilho que seu veículo merece.</p>
          </div>
          
          <div className="footer-links-group">
            <h4 className="footer-title">Suporte e Tecnologia</h4>
            <div className="footer-socials">
              <a href={devInfo.instagram} target="_blank" rel="noopener noreferrer" className="footer-social-link instagram" title="Instagram da Orquestra.cs">
                <Instagram size={18} />
                <span>@Orquestra.cs</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <p>© {currentYear} Alisson Estética Automotiva.</p>
            <div className="footer-legal-tags">
              <span className="legal-tag"><Shield size={12} /> Privacidade Protegida</span>
              <span className="legal-tag"><Code size={12} /> Tecnologia Orquestra.cs</span>
            </div>
          </div>
          
          <div className="footer-support-btn-area">
            <a href={`${devInfo.whatsapp}?text=${encodeURIComponent(devInfo.supportText)}`} target="_blank" rel="noopener noreferrer" className="support-floating-btn">
              <HelpCircle size={20} />
              <span>Suporte Técnico</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-watermark">
        Orquestrando Inovação: Onde o Código se Torna Harmonia — <strong>{devInfo.company}</strong>
      </div>
    </footer>
  );
};

export default Footer;
