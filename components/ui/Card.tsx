import React from 'react';
import { CardProps } from '../../types';

export const Card: React.FC<CardProps> = ({ children, className = '', dark = false }) => {
  const baseStyles = "relative overflow-hidden rounded-3xl transition-all duration-300";
  const themeStyles = dark 
    ? "bg-carbon-black text-white border border-white/10 shadow-2xl" 
    : "bg-white text-carbon-black border border-white/40 shadow-xl shadow-gray-200/50 backdrop-blur-xl";

  return (
    <div className={`${baseStyles} ${themeStyles} ${className}`}>
      {children}
    </div>
  );
};
