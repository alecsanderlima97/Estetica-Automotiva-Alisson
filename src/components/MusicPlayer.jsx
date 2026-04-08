import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, AlertCircle, Loader2 } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  
  // Agora usando o arquivo LOCAL que baixamos para o projeto
  const musicUrl = "/bg-music.mp3?v=" + Date.now();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setHasError(false);
      setIsLoading(true);
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(err => {
            console.error("Erro ao iniciar áudio local:", err);
            setHasError(true);
            setIsLoading(false);
            setIsPlaying(false);
          });
      }
    }
  };

  return (
    <div 
      className="music-player-container"
      onMouseEnter={() => setShowVolume(true)}
      onMouseLeave={() => setShowVolume(false)}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px',
        padding: '0 8px',
        height: '32px',
        borderRadius: '16px',
        background: isPlaying ? 'rgba(var(--primary-rgb), 0.15)' : 'rgba(255,255,255,0.03)',
        transition: 'all 0.3s ease',
        border: '1px solid',
        borderColor: isPlaying ? 'rgba(var(--primary-rgb), 0.2)' : 'transparent',
        cursor: 'default',
        position: 'relative'
      }}
    >
      <audio 
        ref={audioRef} 
        src={musicUrl} 
        loop 
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onError={(e) => {
          console.error("Erro no arquivo local:", e);
          setHasError(true);
          setIsLoading(false);
        }}
      />
      
      <button 
        onClick={togglePlay}
        disabled={isLoading}
        style={{
          background: 'none',
          border: 'none',
          color: hasError ? '#ef4444' : (isPlaying ? 'var(--primary-color)' : '#888'),
          cursor: isLoading ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px',
          borderRadius: '50%',
          transition: 'all 0.2s',
          outline: 'none'
        }}
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          hasError ? <AlertCircle size={16} /> : (isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />)
        )}
      </button>

      <div style={{
        width: isPlaying && showVolume ? '70px' : '0px',
        opacity: isPlaying && showVolume ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: isPlaying && showVolume ? '6px' : '0px',
        pointerEvents: showVolume ? 'auto' : 'none'
      }}>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={{
            width: '60px',
            accentColor: 'var(--primary-color)',
            height: '3px',
            cursor: 'pointer',
            margin: 0
          }}
        />
      </div>

      {hasError && !showVolume && (
        <span style={{ 
          position: 'absolute', 
          top: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#ef4444',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '10px', 
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          zIndex: 100
        }}>
          Erro no áudio
        </span>
      )}
    </div>
  );
};

export default MusicPlayer;
