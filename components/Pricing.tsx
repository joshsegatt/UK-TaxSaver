import React from 'react';
import { Check } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { UserPlan } from '../types';

interface PricingProps {
  onSelect: (plan: UserPlan) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelect }) => {
  return (
    <section className="min-h-screen pt-32 pb-24 bg-gradient-to-br from-[#0f172a] via-[#115e59] to-[#042f2e] relative overflow-hidden flex flex-col justify-center">
      {/* Background Decor to match Hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">Simple pricing.</h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto text-balance font-medium opacity-90">
            Start optimizing your taxes today. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan - Added 'dark' prop and refined background */}
          <Card dark className="p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 bg-[#0f172a]/80 backdrop-blur-md border border-white/10 shadow-2xl hover:shadow-teal-900/20 group">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-200 transition-colors">Basic</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold font-mono text-white">£0</span>
                <span className="text-gray-400">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Basic Tax Calculator', 'Save 1 Profile', 'Standard Support', 'Email Updates'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-900/50 border border-teal-500/30 flex items-center justify-center">
                      <Check className="w-3 h-3 text-teal-300" />
                    </div>
                    <span className="text-gray-300 text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* High Contrast Basic Button - Solid White */}
            <Button 
              variant="secondary" 
              fullWidth 
              onClick={() => onSelect('Free')} 
              className="bg-white text-black border-none font-bold hover:bg-gray-100 shadow-lg shadow-black/20"
            >
              Get Basic
            </Button>
          </Card>

          {/* Pro Plan - Updated to match Calculator (Slate Glass + Gold Border) */}
          <div className="relative group">
            {/* Glow effect behind the card */}
            <div className="absolute -inset-0.5 bg-gradient-to-b from-luxury-gold/50 to-teal-500/30 rounded-[26px] blur-md opacity-70 group-hover:opacity-100 transition duration-500"></div>
            
            <Card dark className="p-8 h-full flex flex-col justify-between transform group-hover:-translate-y-2 transition-transform duration-300 bg-[#0f172a]/80 backdrop-blur-md border border-luxury-gold/40 relative z-10 shadow-2xl">
              
              <div className="absolute top-0 right-0 bg-luxury-gold text-black text-[11px] font-extrabold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider shadow-[0_4px_12px_rgba(255,215,0,0.3)]">
                Most Popular
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                   <h3 className="text-xl font-bold text-white">Pro</h3>
                   {/* High Contrast Badge - Black text on Gold bg */}
                   <span className="px-2.5 py-0.5 rounded-full bg-luxury-gold text-black text-[11px] font-bold uppercase tracking-wide shadow-sm">
                     Yearly Save 20%
                   </span>
                </div>
                
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold font-mono text-white tracking-tight">£12</span>
                  <span className="text-gray-400 font-medium">/mo</span>
                </div>
                
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

                <ul className="space-y-4 mb-8">
                  {['Advanced AI Optimization', 'Unlimited Profiles', 'HMRC Auto-Fill', 'Priority Support', 'Bank Connect'].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-luxury-gold flex items-center justify-center shadow-[0_0_10px_rgba(255,215,0,0.4)] shrink-0">
                        <Check className="w-3.5 h-3.5 text-black stroke-[3px]" />
                      </div>
                      <span className="text-gray-100 text-sm font-semibold tracking-wide">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* High Contrast Pro Button - Solid Gold, Bold Black Text */}
              <Button 
                variant="primary" 
                className="bg-[#FFD700] !text-black hover:!bg-[#F3C600] font-extrabold tracking-wide shadow-[0_4px_20px_rgba(255,215,0,0.25)] hover:shadow-[0_4px_25px_rgba(255,215,0,0.4)] border-none transition-all duration-300" 
                fullWidth 
                onClick={() => onSelect('Pro')}
              >
                Start Pro Trial
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};