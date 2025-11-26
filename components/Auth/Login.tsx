import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ViewState } from '../../types';
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
  onNavigate: (view: ViewState) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLoginSuccess();
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#115e59] to-[#042f2e] px-6">
      <Card dark className="w-full max-w-md p-8 bg-[#0f172a]/90 border-white/10 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm">Sign in to access your TaxSaver Workspace</p>
        </div>

        {/* Social Login */}
        <div className="space-y-3 mb-6">
          <button className="w-full h-12 bg-white text-black font-bold rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors" onClick={onLoginSuccess}>
             <Chrome className="w-5 h-5" /> Continue with Google
          </button>
          <button className="w-full h-12 bg-[#1e293b] text-white border border-white/10 font-bold rounded-lg flex items-center justify-center gap-3 hover:bg-[#334155] transition-colors" onClick={onLoginSuccess}>
             <Github className="w-5 h-5" /> Continue with Apple
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-xs text-gray-500 font-bold uppercase">Or continue with email</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 uppercase ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#022c22]/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:border-teal-500 focus:outline-none focus:bg-black/40 transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 uppercase ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#022c22]/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:border-teal-500 focus:outline-none focus:bg-black/40 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-xs text-teal-400 hover:text-teal-300 font-medium">Forgot Password?</button>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            className="bg-luxury-gold !text-black border-none font-bold hover:!bg-[#F3C600] h-12 mt-2"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
            {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('register')} className="text-white font-bold hover:underline decoration-luxury-gold underline-offset-4">
              Sign Up
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};
