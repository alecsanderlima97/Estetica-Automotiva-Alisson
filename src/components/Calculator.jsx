import React, { useState, useEffect, useRef } from 'react';
import { X, Delete, Divide, Minus, Plus, Equal, Hash, History, Settings2, Sigma, Eraser, Trash2, ChevronLeft, ChevronRight, Percent } from 'lucide-react';
import * as math from 'mathjs';

const Calculator = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('calculatorHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const [isScientific, setIsScientific] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 300, y: window.innerHeight - 550 });
  const [isDragging, setIsDragging] = useState(false);
  
  const offsetRef = useRef({ x: 0, y: 0 });

  const playClick = () => {
    const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3');
    audio.volume = 0.1;
    audio.play().catch(() => {});
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return;
    setIsDragging(true);
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const newX = e.clientX - offsetRef.current.x;
      const newY = e.clientY - offsetRef.current.y;
      
      const maxX = window.innerWidth - (isScientific ? 440 : 260);
      const maxY = window.innerHeight - 450;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
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
  }, [isDragging, isScientific]);

  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (/[0-9]/.test(e.key)) handleInput(e.key);
      const ops = { '+': '+', '-': '-', '*': '*', '/': '/', '^': '^', '(': '(', ')': ')', '%': '%' };
      if (ops[e.key]) handleInput(ops[e.key]);
      if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calculate(); }
      if (e.key === 'Escape' || e.key === 'Delete' || e.key === 'c' || e.key === 'C') clear();
      if (e.key === 'Backspace') backspace();
      if (e.key === '.' || e.key === ',') handleInput('.');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression]);

  const handleInput = (val) => {
    playClick();
    setExpression(prev => {
      if (prev === 'Erro') return val;
      const lastChar = prev.slice(-1);
      const isOp = ['+', '-', '*', '/', '^', '%'].includes(val);
      const lastIsOp = ['+', '-', '*', '/', '^', '%'].includes(lastChar);
      
      if (isOp && lastIsOp && val !== '-' && lastChar !== '(') {
        return prev.slice(0, -1) + val;
      }
      return prev + val;
    });
  };

  const calculate = () => {
    if (!expression) return;
    playClick();
    try {
      const result = math.evaluate(expression);
      const formattedResult = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(8)).toString();
      
      setDisplay(formattedResult);
      setHistory(prev => [{ id: Date.now(), expression, result: formattedResult, timestamp: new Date().toLocaleTimeString() }, ...prev].slice(0, 30));
      setExpression(formattedResult);
    } catch (err) {
      setDisplay('Erro');
      setTimeout(() => setDisplay('0'), 1500);
    }
  };

  const clear = () => { playClick(); setExpression(''); setDisplay('0'); };
  const backspace = () => { playClick(); setExpression(prev => prev.slice(0, -1)); };
  const addToExpression = (func) => { playClick(); setExpression(prev => prev + func); };
  const clearHistory = () => { setHistory([]); localStorage.removeItem('calculatorHistory'); };

  return (
    <div style={{
      width: isScientific ? (showHistory ? '640px' : '440px') : (showHistory ? '460px' : '260px'),
      backgroundColor: '#1a1f14',
      borderRadius: '20px',
      padding: '16px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'white',
      position: 'fixed',
      left: `${position.x}px`,
      top: `${position.y}px`,
      zIndex: 2000,
      userSelect: 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      gap: '16px'
    }}>
      {/* Container Principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Header */}
        <div onMouseDown={handleMouseDown} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: isDragging ? 'grabbing' : 'grab' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sigma size={16} style={{ color: 'var(--primary-color)' }} />
            <span style={{ fontSize: '13px', fontWeight: '800' }}>Calculadora Alta Performance</span>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => setShowHistory(!showHistory)} className="btn-icon" title="Histórico">
              <History size={16} />
            </button>
            <button onClick={() => setIsScientific(!isScientific)} className="btn-icon" title="Científica">
              <Settings2 size={16} />
            </button>
            <button onClick={onClose} className="btn-icon">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Display */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.4)',
          padding: '12px 16px',
          borderRadius: '16px',
          textAlign: 'right',
          minHeight: '80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--primary-color)', opacity: 0.7, marginBottom: '4px', overflow: 'hidden' }}>{expression || '0'}</div>
          <div style={{ fontSize: '28px', fontWeight: '700' }}>{display}</div>
        </div>

        {/* Botoes */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            <button onClick={clear} className="btn-alt">AC</button>
            <button onClick={backspace} className="btn-alt"><Delete size={16} /></button>
            <button onClick={() => handleInput('%')} className="btn-op"><Percent size={16} /></button>
            <button onClick={() => handleInput('/')} className="btn-op">÷</button>
            
            {[7, 8, 9].map(n => <button key={n} onClick={() => handleInput(n.toString())} className="btn-num">{n}</button>)}
            <button onClick={() => handleInput('*')} className="btn-op">×</button>
            
            {[4, 5, 6].map(n => <button key={n} onClick={() => handleInput(n.toString())} className="btn-num">{n}</button>)}
            <button onClick={() => handleInput('-')} className="btn-op">−</button>
            
            {[1, 2, 3].map(n => <button key={n} onClick={() => handleInput(n.toString())} className="btn-num">{n}</button>)}
            <button onClick={() => handleInput('+')} className="btn-op">+</button>
            
            <button onClick={() => handleInput('0')} style={{ gridColumn: 'span 2' }} className="btn-num">0</button>
            <button onClick={() => handleInput('.')} className="btn-num">.</button>
            <button onClick={calculate} className="btn-eq"><Equal size={18} /></button>
          </div>

          {isScientific && (
            <div style={{ width: '120px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {['sin', 'cos', 'tan', 'log', 'sqrt', 'pow', '(', ')'].map(f => (
                <button key={f} onClick={() => f === 'pow' ? handleInput('^') : addToExpression(f+'(')} className="btn-sci">{f}</button>
              ))}
              <button onClick={() => addToExpression('pi')} className="btn-sci">π</button>
              <button onClick={() => addToExpression('e')} className="btn-sci">e</button>
            </div>
          )}
        </div>
      </div>

      {/* History Side Panel */}
      {showHistory && (
        <div style={{
          width: '200px',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '16px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid rgba(255,255,255,0.05)',
          animation: 'slideRight 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--primary-color)' }}>HISTÓRICO</span>
            <button onClick={clearHistory} className="btn-icon" style={{ color: '#f87171' }}><Trash2 size={12} /></button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
            {history.length === 0 ? (
              <div style={{ fontSize: '10px', color: '#555', textAlign: 'center', marginTop: '20px' }}>Vazio</div>
            ) : history.map(item => (
              <div key={item.id} onClick={() => setExpression(item.expression)} style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', cursor: 'pointer', transition: '0.2s' }} className="hist-item">
                <div style={{ fontSize: '10px', color: 'var(--primary-color)', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.expression}</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.result}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .btn-num { padding: 12px; border-radius: 12px; border: none; background: #2d3329; color: white; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.2s; box-shadow: 0 3px 0 #1c2117; }
        .btn-num:hover { background: #3a4235; transform: translateY(-1px); }
        .btn-num:active { transform: translateY(1px); box-shadow: 0 0 0 transparent; }

        .btn-op { padding: 12px; border-radius: 12px; border: none; background: rgba(92, 114, 73, 0.1); color: var(--primary-color); font-size: 18px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-op:hover { background: rgba(92, 114, 73, 0.2); }

        .btn-sci { padding: 8px; border-radius: 10px; border: none; background: rgba(255,255,255,0.03); color: #aaa; font-size: 11px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-sci:hover { background: rgba(255,255,255,0.08); color: white; }

        .btn-alt { padding: 12px; border-radius: 12px; border: none; background: #33392e; color: #f87171; font-size: 13px; font-weight: 700; cursor: pointer; transition: 0.2s; }

        .btn-eq { padding: 12px; border-radius: 12px; border: none; background: var(--primary-color); color: white; cursor: pointer; transition: 0.2s; box-shadow: 0 3px 0 #2b3a10; display: flex; justify-content: center; align-items: center; }
        .btn-eq:hover { filter: brightness(1.1); }

        .btn-icon { background: transparent; border: none; color: #666; cursor: pointer; padding: 6px; border-radius: 8px; transition: 0.2s; display: flex; align-items: center; }
        .btn-icon:hover { background: rgba(255,255,255,0.05); color: white; }

        .hist-item:hover { background: rgba(92, 114, 73, 0.1) !important; }

        @keyframes slideRight { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
};

export default Calculator;
