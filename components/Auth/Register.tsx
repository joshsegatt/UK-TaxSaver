import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ViewState } from '../../types';
import { Mail, Lock, User, ArrowRight, Chrome, Github, CheckCircle2 } from 'lucide-react';

interface RegisterProps {
  onRegisterSuccess: () => void;
  onNavigate: (view: ViewState) => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onRegisterSuccess();
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#115e59] to-[#042f2e] px-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left: Value Proposition */}
        <div className="hidden md:block space-y-8 animate-in slide-in-from-left-4 duration-500">
          <div>
             <h1 className="text-4xl font-bold text-white tracking-tight mb-4">Create your <br/><span className="text-luxury-gold">Free Account</span> today.</h1>
             <p className="text-gray-300 text-lg">Join 10,000+ UK residents optimizing their wealth with TaxSaver.</p>
          </div>

          <div className="space-y-4">
             {[
               { title: 'Tax Dashboard', desc: 'Track income, expenses and basic tax liability.' },
               { title: 'Secure Platform', desc: 'Bank-grade encryption and GDPR compliance.' },
               { title: 'Easy Upgrade', desc: 'Unlock automation and reports whenever you are ready.' },
             ].map((item, i) => (
               <div key={i} className="flex gap-4 items-start bg-[#0f172a]/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                  <div className="mt-1 p-1 bg-teal-500/20 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
               </div>
             ))}
          </div>
          
          <div className="pt-4 border-t border-white/10">
             <div className="flex -space-x-3 mb-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-[#022c22] bg-gray-600 flex items-center justify-center text-xs font-bold text-white relative z-10">
                   {String.fromCharCode(64+i)}
                 </div>
               ))}
               <div className="w-10 h-10 rounded-full border-2 border-[#022c22] bg-luxury-gold flex items-center justify-center text-xs font-bold text-black relative z-20">
                 +2k
               </div>
             </div>
             <p className="text-sm text-gray-400">Join the community of smart earners.</p>
          </div>
        </div>

        {/* Right: Register Form */}
        <Card dark className="w-full max-w-md mx-auto p-8 bg-[#0f172a]/90 border-white/10 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400 text-sm">No credit card required.</p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button className="w-full h-12 bg-white text-black font-bold rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors" onClick={onRegisterSuccess}>
              <Chrome className="w-5 h-5" /> Sign up with Google
            </button>
            <button className="w-full h-12 bg-[#1e293b] text-white border border-white/10 font-bold rounded-lg flex items-center justify-center gap-3 hover:bg-[#334155] transition-colors" onClick={onRegisterSuccess}>
              <Github className="w-5 h-5" /> Sign up with Apple
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-xs text-gray-500 font-bold uppercase">Or register with email</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300 uppercase ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#022c22]/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:border-teal-500 focus:outline-none focus:bg-black/40 transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              className="bg-luxury-gold !text-black border-none font-bold hover:!bg-[#F3C600] h-12 mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Get Started'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
            
            <p className="text-[10px] text-gray-500 text-center mt-2">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <button onClick={() => onNavigate('login')} className="text-white font-bold hover:underline decoration-luxury-gold underline-offset-4">
                Log In
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};