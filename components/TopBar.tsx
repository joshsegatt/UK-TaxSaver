import React, { useState, useEffect, useRef } from 'react';
import { PoundSterling } from 'lucide-react';
import { Button } from './ui/Button';
import { ViewState } from '../types';

interface TopBarProps {
  onLogin: () => void;
  onNavigate: (view: ViewState) => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  symbol: string;
  color: string;
  rotation: number;
}

export const TopBar: React.FC<TopBarProps> = ({ onLogin, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastParticleTime = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const now = Date.now();
    // Throttle particle creation (every 50ms)
    if (now - lastParticleTime.current < 50) return;
    lastParticleTime.current = now;

    const symbols = ['£', '$', '€', '¥', '₿'];
    const colors = ['text-luxury-gold', 'text-emerald-400', 'text-teal-300', 'text-white'];
    
    const newParticle: Particle = {
      id: now,
      x: e.clientX,
      y: e.clientY, // ClientY is correct because TopBar is fixed
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 30 - 15, // Random rotation between -15 and 15 deg
    };

    setParticles(prev => [...prev, newParticle]);

    // Cleanup particle after animation (1s)
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  };

  return (
    <nav 
      onMouseMove={handleMouseMove}
      className={`fixed top-0 left-0 right-0 z-50 h-[80px] transition-all duration-500 border-b overflow-hidden ${
      scrolled 
        ? 'bg-[#0A0A0A]/80 backdrop-blur-xl border-white/5' 
        : 'bg-[#0A0A0A] border-transparent'
    }`}>
      {/* Particle Container */}
      {particles.map((p) => (
        <span
          key={p.id}
          className={`fixed pointer-events-none text-sm font-bold font-mono animate-[float-up_1s_ease-out_forwards] ${p.color}`}
          style={{
            left: p.x,
            top: p.y,
            transform: `rotate(${p.rotation}deg)`,
            textShadow: '0 0 10px currentColor'
          }}
        >
          {p.symbol}
        </span>
      ))}

      {/* Style for the custom float-up animation since we can't edit global css easily here */}
      <style>
        {`
          @keyframes float-up {
            0% { transform: translateY(0) scale(0.5); opacity: 0; }
            20% { opacity: 1; transform: translateY(-10px) scale(1.2); }
            100% { transform: translateY(-50px) scale(0.8); opacity: 0; }
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between relative z-10">
        {/* Left: Elite Money Logo */}
        <div 
          className="flex items-center gap-4 cursor-pointer group select-none"
          onClick={() => onNavigate('landing')}
        >
          {/* Logo Container */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#0f172a] to-[#022c22] border border-teal-500/30 group-hover:border-luxury-gold/50 transition-all duration-500 shadow-[0_0_20px_rgba(20,184,166,0.2)] group-hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] overflow-hidden">
            {/* Inner glow/shine */}
            <div className="absolute inset-0 bg-teal-500/10 blur-md rounded-xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shimmer" />
            
            <PoundSterling className="w-6 h-6 text-teal-400 group-hover:text-luxury-gold transition-colors duration-300 relative z-10 stroke-[2.5px]" />
          </div>

          {/* Elite Typography */}
          <div className="flex flex-col justify-center">
            <span className="text-[9px] font-bold text-luxury-gold tracking-[0.3em] uppercase leading-tight ml-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
              UK
            </span>
            <div className="text-2xl font-extrabold tracking-tighter text-white leading-none font-sans group-hover:scale-[1.02] transition-transform origin-left">
              Tax<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Saver</span>
            </div>
          </div>
        </div>

        {/* Center: Links */}
        <div className="hidden md:flex items-center gap-8">
           <button 
            onClick={() => onNavigate('dashboard')}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 hover:scale-105 transform"
          >
            Dashboard
          </button>
          <button 
            onClick={() => onNavigate('calculator')}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 hover:scale-105 transform"
          >
            Calculator
          </button>
           <button 
            onClick={() => onNavigate('about')}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 hover:scale-105 transform"
          >
            About Us
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button 
            className="hidden sm:block text-sm font-medium text-white hover:text-gray-300 transition-colors"
            onClick={() => onNavigate('login')}
          >
            Log in
          </button>
          <Button 
            variant="glass" 
            size="sm" 
            className="shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] border-teal-500/20"
            onClick={() => onNavigate('register')}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  );
};