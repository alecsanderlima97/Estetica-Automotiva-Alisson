import React, { useState, useEffect, useRef } from 'react';
import { X, Delete, Divide, Minus, Plus, Equal, Hash } from 'lucide-react';

const Calculator = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: window.innerHeight - 500 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - offsetRef.current.x,
        y: e.clientY - offsetRef.current.y
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  // Suporte ao Teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Números
      if (/[0-9]/.test(e.key)) {
        handleNumber(e.key);
      }
      // Operadores
      else if (['+', '-', '*', '/'].includes(e.key)) {
        handleOperator(e.key);
      }
      // Ponto/Vírgula
      else if (e.key === '.' || e.key === ',') {
        handleNumber('.');
      }
      // Enter para calcular
      else if (e.key === 'Enter') {
        e.preventDefault();
        calculate();
      }
      // Backspace para apagar
      else if (e.key === 'Backspace') {
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      }
      // Esc para limpar (C)
      else if (e.key === 'Escape') {
        clear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, equation]); // Dependências necessárias para as funções de cálculo acessarem o estado atual

  const handleNumber = (n) => {
    if (display === '0') setDisplay(n.toString());
    else setDisplay(display + n);
  };

  const handleOperator = (op) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const fullEquation = equation + display;
      const result = eval(fullEquation);
      setDisplay(result.toString());
      setEquation('');
    } catch (e) {
      setDisplay('Erro');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  return (
    <div style={{
      width: '280px',
      backgroundColor: '#1a1f14',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      color: 'white',
      position: 'fixed',
      left: `${position.x}px`,
      top: `${position.y}px`,
      zIndex: 2000,
      userSelect: 'none'
    }}>
      <div 
        onMouseDown={handleMouseDown}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)' }}>
          <Hash size={18} />
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Calculadora</span>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      <div style={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: '16px',
        borderRadius: '12px',
        textAlign: 'right',
        marginBottom: '20px',
        minHeight: '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{equation}</div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-light)' }}>{display}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        <button onClick={clear} style={{ gridColumn: 'span 2', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#2d3329', color: '#f87171', cursor: 'pointer' }}>C</button>
        <button onClick={() => setDisplay(display.slice(0, -1) || '0')} style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#2d3329', color: '#888', cursor: 'pointer' }}><Delete size={18} /></button>
        <button onClick={() => handleOperator('/')} style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'rgba(92, 114, 73, 0.2)', color: 'var(--primary-color)', cursor: 'pointer' }}>/</button>
        
        {[7, 8, 9].map(n => <button key={n} onClick={() => handleNumber(n)} style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#2d3329', color: 'white', cursor: 'pointer' }}>{n}</button>)}
        <button onClick={() => handleOperator('*')} style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'rgba(92, 114, 73, 0.2)', color: 'var(--primary-color)', cursor: 'pointer' }}>x</button>
        
        {[4, 5, 6].map(n => <button key={n} onClick={() => handleNumber(n)} style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#2d3329', color: 'white', cursor: 'pointer' }}>{n}</button>)}
        <button onClick={() => handleOperator('-')} style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'rgba(92, 114, 73, 0.2)', color: 'var(--primary-color)', cursor: 'pointer' }}>-</button>
        
        {[1, 2, 3].map(n => <button key={n} onClick={() => handleNumber(n)} style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#2d3329', color: 'white', cursor: 'pointer' }}>{n}</button>)}
        <button onClick={() => handleOperator('+')} style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'rgba(92, 114, 73, 0.2)', color: 'var(--primary-color)', cursor: 'pointer' }}>+</button>
        
        <button onClick={() => handleNumber(0)} style={{ gridColumn: 'span 2', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#2d3329', color: 'white', cursor: 'pointer' }}>0</button>
        <button onClick={() => handleNumber('.')} style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#2d3329', color: 'white', cursor: 'pointer' }}>.</button>
        <button onClick={calculate} style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', cursor: 'pointer' }}><Equal size={18} /></button>
      </div>
    </div>
  );
};

export default Calculator;
