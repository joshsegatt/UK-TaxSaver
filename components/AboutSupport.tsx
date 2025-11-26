import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Shield, Users, HelpCircle, Mail, MessageCircle, ChevronDown, CheckCircle2, TrendingUp, Globe, Award, Sparkles, Building2 } from 'lucide-react';

interface AboutSupportProps {
  section: 'about' | 'support';
}

export const AboutSupport: React.FC<AboutSupportProps> = ({ section }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Scroll logic for "Support" link if needed
  useEffect(() => {
    if (section === 'support') {
      const el = document.getElementById('support');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.scrollTo(0, 0);
    }
  }, [section]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { q: "Is UK TaxSaver HMRC compliant?", a: "Yes, our calculations are updated annually to reflect the latest HMRC tax bands, National Insurance rates, and allowances for the 2024/25 tax year." },
    { q: "Is my data secure?", a: "Absolutely. We use bank-grade AES-256 encryption for all data at rest and in transit. We do not sell your data to third parties." },
    { q: "Can I cancel my subscription?", a: "Yes, you can cancel your Pro subscription at any time from the Settings dashboard. Your access will continue until the end of the billing period." },
    { q: "Does this replace an accountant?", a: "TaxSaver is a powerful optimization tool, but for complex business structures, we recommend consulting a certified accountant. You can export our reports to share with them." }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-[#0f172a] via-[#115e59] to-[#042f2e] text-white font-sans overflow-x-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1000px] pointer-events-none z-0">
          <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-teal-500/10 blur-[150px] rounded-full mix-blend-screen animate-float" />
          <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-luxury-gold/5 blur-[120px] rounded-full mix-blend-screen animate-float-delayed" />
      </div>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 mb-24 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md shadow-xl animate-in fade-in slide-in-from-top-4">
           <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
           <span className="text-[11px] font-bold text-gray-200 uppercase tracking-widest">The Future of Wealth Management</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 drop-shadow-2xl leading-[0.9]">
          Tax Optimization <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-teal-200 animate-pulse-glow">Reimagined.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light text-balance">
          We combine advanced financial technology with UK tax expertise to give freelancers and contractors the power of a private wealth office.
        </p>
      </div>

      {/* TRUST BAR / STATS */}
      <div className="max-w-7xl mx-auto px-6 mb-32 relative z-10">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-y border-white/5 py-12 bg-black/10 backdrop-blur-sm">
            {[
                { label: 'Tax Saved', value: '£50M+', icon: TrendingUp, color: 'text-emerald-400' },
                { label: 'Active Users', value: '10,000+', icon: Users, color: 'text-blue-400' },
                { label: 'HMRC Compliant', value: '100%', icon: Shield, color: 'text-luxury-gold' },
                { label: 'UK Support', value: '24/7', icon: Globe, color: 'text-teal-400' },
            ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center group">
                    <stat.icon className={`w-6 h-6 mb-3 ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                    <div className="text-3xl md:text-4xl font-mono font-bold text-white mb-1 tracking-tight">{stat.value}</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
                </div>
            ))}
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-32 relative z-10">
        
        {/* STORYTELLING / VISION SECTION (Split Screen) */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
                <div className="absolute inset-0 bg-teal-500/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="relative z-10 grid grid-cols-2 gap-6">
                    <Card dark className="aspect-square bg-[#0f172a]/60 backdrop-blur-xl border-white/10 p-6 flex flex-col justify-between shadow-2xl animate-float">
                        <Building2 className="w-10 h-10 text-gray-400" />
                        <div>
                            <div className="text-4xl font-bold text-white mb-1">2023</div>
                            <div className="text-xs text-gray-500 uppercase font-bold">Founded in London</div>
                        </div>
                    </Card>
                    <Card dark className="aspect-square bg-gradient-to-br from-luxury-gold to-yellow-600 border-none p-6 flex flex-col justify-between shadow-2xl translate-y-12 animate-float-delayed text-black">
                        <Award className="w-10 h-10 text-black" />
                        <div>
                            <div className="text-4xl font-bold text-black mb-1">#1</div>
                            <div className="text-xs text-black/70 uppercase font-bold">Fintech App of the Year</div>
                        </div>
                    </Card>
                </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Built by Contractors,<br/>For Contractors.</h2>
                <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                    <p>
                        UK TaxSaver was born out of frustration. As independent contractors in London's tech scene, we were tired of spreadsheets, confusing government portals, and expensive accountants who didn't understand modern work.
                    </p>
                    <p>
                        We asked ourselves: <span className="text-white font-bold">Why isn't tax optimization as simple as checking your bank balance?</span>
                    </p>
                    <p>
                        So we built the solution. A "Financial Operating System" that not only tracks your liability in real-time but actively suggests strategies to keep more of your hard-earned money.
                    </p>
                </div>
                <div className="pt-4">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-4">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-2 border-[#022c22] bg-gray-700" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`, backgroundSize: 'cover' }} />
                            ))}
                        </div>
                        <div>
                            <div className="text-white font-bold">The Founding Team</div>
                            <div className="text-sm text-gray-500">Ex-Revolut & Monzo Engineers</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* MISSION VALUES GRID */}
        <section>
           <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Core Principles</h2>
              <p className="text-gray-400 text-lg">We are guided by three non-negotiable values that shape every feature we build.</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
             {[
               { icon: CheckCircle2, title: "Radical Simplicity", desc: "Tax law is complex. Our UX is not. We turn 500-page regulations into simple 'Yes/No' decisions." },
               { icon: Shield, title: "Bank-Grade Security", desc: "Your financial data is sacred. We use AES-256 encryption and never sell your data. You are the customer, not the product." },
               { icon: Users, title: "User-First Design", desc: "We don't build for accountants. We build for you. Every interface is crafted to reduce anxiety and increase clarity." }
             ].map((item, i) => (
               <Card dark key={i} className="p-10 bg-[#0f172a]/40 border-white/5 backdrop-blur-md hover:bg-[#0f172a]/60 hover:border-teal-500/30 transition-all duration-500 group">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg">
                     <item.icon className="w-7 h-7 text-teal-400 group-hover:text-luxury-gold transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:translate-x-1 transition-transform">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
               </Card>
             ))}
           </div>
        </section>

        {/* SUPPORT / FAQ SECTION */}
        <section id="support" className="max-w-4xl mx-auto pt-20 border-t border-white/5">
           <div className="text-center mb-16">
              <div className="w-20 h-20 bg-gradient-to-br from-luxury-gold to-yellow-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(255,215,0,0.2)] rotate-3">
                 <HelpCircle className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">How can we help?</h2>
              <p className="text-lg text-gray-400">Find answers to common questions or get in touch with our team.</p>
           </div>

           <div className="space-y-4 mb-16">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-[#0f172a]/40 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
                   <button 
                     onClick={() => toggleFaq(i)}
                     className="w-full flex items-center justify-between p-6 text-left"
                   >
                      <span className="font-bold text-white text-lg">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-luxury-gold' : ''}`} />
                   </button>
                   {openFaq === i && (
                     <div className="px-6 pb-6 pt-0 text-gray-300 leading-relaxed animate-in slide-in-from-top-2">
                        {faq.a}
                     </div>
                   )}
                </div>
              ))}
           </div>

           <div className="grid md:grid-cols-2 gap-6">
              <Card dark className="p-8 bg-[#0f172a]/60 border-white/10 flex flex-col items-center text-center hover:border-teal-500/50 transition-all cursor-pointer group hover:shadow-[0_0_30px_rgba(20,184,166,0.1)]">
                 <Mail className="w-10 h-10 text-gray-400 mb-6 group-hover:text-teal-400 transition-colors" />
                 <h4 className="text-xl font-bold text-white mb-2">Email Support</h4>
                 <p className="text-gray-400 mb-6">Detailed response within 24 hours</p>
                 <span className="text-teal-400 font-bold tracking-wide border-b border-teal-500/30 pb-0.5 group-hover:border-teal-400 transition-colors">support@taxsaver.uk</span>
              </Card>
              <Card dark className="p-8 bg-[#0f172a]/60 border-white/10 flex flex-col items-center text-center hover:border-luxury-gold/50 transition-all cursor-pointer group hover:shadow-[0_0_30px_rgba(255,215,0,0.1)]">
                 <MessageCircle className="w-10 h-10 text-gray-400 mb-6 group-hover:text-luxury-gold transition-colors" />
                 <h4 className="text-xl font-bold text-white mb-2">Live Chat</h4>
                 <p className="text-gray-400 mb-6">Available Mon-Fri, 9am-5pm</p>
                 <Button variant="secondary" size="sm" className="bg-white !text-black border-none font-bold shadow-lg group-hover:scale-105 transition-transform">Start Conversation</Button>
              </Card>
           </div>
        </section>

      </div>
    </div>
  );
};