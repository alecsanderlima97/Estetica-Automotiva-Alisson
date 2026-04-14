import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('last_logged_email') || '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const playLoginSound = () => {
    const audio = new Audio('/login_sound.mp3?v=' + Date.now());
    audio.volume = 0.7;
    return audio.play();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Lista de usuários autorizados conforme solicitado pelo desenvolvedor
    const savedAlissonPass = localStorage.getItem('alisson_admin_pass') || 'admin';
    
    const authorizedUsers = [
      { email: 'walissonrodrigues1055@gmail.com', password: savedAlissonPass, name: 'Administrador', role: 'admin' },
      { email: 'orquestracs@gmail.com', password: 'admin', name: 'Suporte Técnico', role: 'dev' }
    ];

    const matchedUser = authorizedUsers.find(u => u.email === email && u.password === password);
    
    setTimeout(() => {
      if (matchedUser) {
        // Salva o e-mail para a próxima vez
        localStorage.setItem('last_logged_email', email);
        
        // Toca o som de entrada
        playLoginSound().catch(e => console.log("Erro ao tocar som:", e));
        
        // Aguarda animação antes de entrar
        setTimeout(() => {
          onLogin(matchedUser);
          setLoading(false);
        }, 1500);
      } else {
        alert('Credenciais incorretas! Verifique seu e-mail e senha.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #2d3329 0%, #1a1f14 100%)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'rgba(34, 43, 25, 0.6)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          backgroundColor: 'var(--primary-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          color: 'white',
          boxShadow: '0 10px 15px -3px rgba(92, 114, 73, 0.3)'
        }}>
          <Lock size={32} />
        </div>

        <h1 style={{ color: 'var(--text-light)', fontSize: '24px', marginBottom: '8px', fontFamily: 'Oswald', textTransform: 'uppercase' }}>Sistema de Gestão</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>Acesse sua conta na Estética Automotiva</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ color: '#aaa', fontSize: '13px', marginBottom: '8px', display: 'block' }}>E-mail</label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <User size={18} color="#666" style={{ position: 'absolute', left: '16px' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '14px 14px 14px 48px',
                  color: 'white',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px', textAlign: 'left' }}>
            <label style={{ color: '#aaa', fontSize: '13px', marginBottom: '8px', display: 'block' }}>Senha</label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Lock size={18} color="#666" style={{ position: 'absolute', left: '16px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '14px 14px 14px 48px',
                  color: 'white',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  background: 'transparent',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s'
            }}
          >
            {loading ? (
              <div className="loader" style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            ) : (
              <>Entrar no Sistema <CheckCircle size={18} /></>
            )}
          </button>
        </form>

        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Login;
