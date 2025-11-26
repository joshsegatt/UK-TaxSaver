import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  Search, 
  Bell, 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { Button } from './ui/Button';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const [rotation, setRotation] = useState({ x: 5, y: -12 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax Refs
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      requestAnimationFrame(() => {
        if (orb1Ref.current) orb1Ref.current.style.transform = `translateY(${y * 0.2}px)`;
        if (orb2Ref.current) orb2Ref.current.style.transform = `translateY(${y * 0.15}px)`;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width - 0.5);
    const yPct = (mouseY / height - 0.5);
    // Enhanced rotation for the larger composition
    setRotation({ x: -yPct * 15, y: xPct * 15 });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 5, y: -12 });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-[100px] overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#115e59] to-[#042f2e]">
      {/* Background Decor */}
      <div ref={orb1Ref} className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-teal-500/10 blur-[150px] rounded-full border border-white/5 pointer-events-none mix-blend-screen will-change-transform" />
      <div ref={orb2Ref} className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-600/10 blur-[150px] rounded-full border border-white/5 pointer-events-none mix-blend-screen will-change-transform" />

      {/* Ultra Wide Container */}
      <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-center">
        
        {/* LEFT: Content */}
        <div className="space-y-10 z-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-900/30 border border-teal-500/30 backdrop-blur-sm shadow-[0_0_20px_rgba(20,184,166,0.2)]">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_10px_#2dd4bf]" />
            <span className="text-xs font-bold text-teal-100 tracking-wide uppercase">#1 Tax Platform 2025</span>
          </div>

          <h1 className="text-6xl md:text-7xl xl:text-8xl font-bold text-white tracking-tighter text-balance leading-[0.9] drop-shadow-2xl">
            Master your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-200 to-white">
              Wealth.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-xl leading-relaxed text-balance font-medium">
            The most advanced tax optimization platform for UK residents. 
            Connect your bank, automate your returns, and save thousands.
          </p>

          <div className="flex flex-col items-start gap-3">
            <Button variant="primary" size="lg" className="h-14 px-8 text-lg bg-teal-500 hover:bg-teal-400 !text-black font-extrabold shadow-[0_0_30px_rgba(20,184,166,0.4)] hover:shadow-[0_0_50px_rgba(20,184,166,0.6)] border-none transition-all duration-300 group" onClick={onStart}>
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform stroke-[2.5px]" />
            </Button>
            <p className="text-xs text-gray-400 font-medium ml-1">
              <span className="text-teal-400 font-bold">Free Account</span> included with signup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
              <span className="text-sm font-semibold text-gray-300">HMRC Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
              <span className="text-sm font-semibold text-gray-300">Bank-Grade Security</span>
            </div>
             <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
              <span className="text-sm font-semibold text-gray-300">Real-Time Sync</span>
            </div>
          </div>
        </div>

        {/* RIGHT: 3D Animated Dashboard Composition */}
        <div 
          ref={containerRef}
          className="relative h-[700px] w-full flex items-center justify-center perspective-1000 group cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Glow Behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/20 blur-[100px] rounded-full animate-pulse-glow pointer-events-none" />

          {/* The 3D Group */}
          <div 
            className="relative w-full max-w-[700px] aspect-[16/10] preserve-3d will-change-transform ease-out"
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transitionDuration: isHovering ? '100ms' : '800ms',
            }}
          >
            
            {/* Layer 1: Main Dashboard Window (Back) */}
            <div className="absolute inset-0 bg-[#0f172a] rounded-xl border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col font-sans">
              
              {/* Fake Window Header */}
              <div className="h-9 bg-[#0f172a] border-b border-white/10 flex items-center justify-between px-4 shrink-0">
                 <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                 </div>
                 <div className="flex-1 mx-4 flex justify-center">
                    <div className="h-5 w-64 bg-white/5 rounded-md flex items-center px-2 gap-2 border border-white/5">
                        <Search className="w-3 h-3 text-gray-600" />
                        <span className="text-[10px] text-gray-600">Search workspace...</span>
                    </div>
                 </div>
                 <div className="flex gap-3 items-center">
                     <Bell className="w-3 h-3 text-gray-500" />
                     <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500 ring-2 ring-white/10" />
                 </div>
              </div>
              
              <div className="flex flex-1 overflow-hidden">
                {/* Miniature Sidebar */}
                <div className="w-36 border-r border-white/5 bg-[#022c22]/30 p-2 space-y-1 flex flex-col">
                   <div className="flex items-center gap-2 px-2 py-2 mb-2">
                      <div className="w-5 h-5 rounded bg-luxury-gold flex items-center justify-center text-[10px] font-bold text-black shadow-lg shadow-luxury-gold/20">T</div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-white font-bold">TaxSaver</span>
                        <span className="text-[7px] text-gray-500">Pro Plan</span>
                      </div>
                   </div>
                   
                   {[
                     { icon: LayoutDashboard, label: 'Overview', active: true },
                     { icon: Wallet, label: 'Transactions', active: false },
                     { icon: PieChart, label: 'Reports', active: false },
                     { icon: Settings, label: 'Settings', active: false },
                   ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${item.active ? 'bg-teal-500/20 text-teal-400' : 'text-gray-500'}`}>
                         <item.icon className="w-3.5 h-3.5" />
                         <span className="text-[9px] font-medium">{item.label}</span>
                      </div>
                   ))}

                   <div className="mt-auto pt-2 border-t border-white/5">
                     <div className="text-[8px] font-bold text-gray-600 uppercase mb-1 px-2">Recent</div>
                     <div className="flex items-center gap-2 px-2 py-1 text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-[9px]">Income 24/25</span>
                     </div>
                   </div>
                </div>

                {/* Miniature Main Content */}
                <div className="flex-1 bg-[#0f172a] p-5 space-y-5 overflow-hidden relative">
                   {/* Background Grid */}
                   <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                   {/* Content Header */}
                   <div className="flex justify-between items-end relative z-10">
                      <div>
                        <h2 className="text-sm font-bold text-white mb-0.5">Financial Overview</h2>
                        <p className="text-[10px] text-gray-500">Updated just now</p>
                      </div>
                      <div className="h-6 px-3 bg-luxury-gold rounded-md flex items-center text-[10px] font-bold text-black shadow-lg shadow-luxury-gold/10">
                         + New Entry
                      </div>
                   </div>

                   {/* Stats Grid */}
                   <div className="grid grid-cols-3 gap-3 relative z-10">
                      {[
                        { label: 'Total Revenue', value: '£124,500', color: 'text-white', sub: '+12%' },
                        { label: 'Tax Liability', value: '£22,400', color: 'text-gray-200', sub: 'Est.' },
                        { label: 'Net Profit', value: '£102,100', color: 'text-emerald-400', sub: 'Safe' },
                      ].map((stat, i) => (
                        <div key={i} className="bg-[#1e293b]/80 backdrop-blur-sm p-3 rounded-lg border border-white/5 shadow-lg">
                           <div className="flex justify-between items-center mb-1">
                             <div className="text-[8px] text-gray-500 uppercase tracking-wider font-bold">{stat.label}</div>
                             <MoreHorizontal className="w-3 h-3 text-gray-600" />
                           </div>
                           <div className={`text-sm font-mono font-bold ${stat.color}`}>{stat.value}</div>
                           <div className="text-[9px] text-teal-500 mt-1 font-medium">{stat.sub}</div>
                        </div>
                      ))}
                   </div>

                   {/* Miniature Data Grid / Board */}
                   <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-lg border border-white/5 overflow-hidden shadow-lg relative z-10">
                      {/* Table Header */}
                      <div className="grid grid-cols-12 gap-2 p-2 border-b border-white/5 bg-black/20">
                         <div className="col-span-5 text-[8px] font-bold text-gray-500 uppercase">Transaction</div>
                         <div className="col-span-3 text-[8px] font-bold text-gray-500 uppercase text-center">Status</div>
                         <div className="col-span-2 text-[8px] font-bold text-gray-500 uppercase">Date</div>
                         <div className="col-span-2 text-[8px] font-bold text-gray-500 uppercase text-right">Amount</div>
                      </div>
                      {/* Rows */}
                      {[
                        { name: 'Google Ireland', sub: 'Contract', status: 'Done', color: 'bg-emerald-500', amount: '£4,500' },
                        { name: 'Apple Store', sub: 'Equipment', status: 'Pending', color: 'bg-amber-500', amount: '-£2,499' },
                        { name: 'Starbucks', sub: 'Client Meeting', status: 'Review', color: 'bg-blue-500', amount: '-£12.50' },
                        { name: 'HMRC VAT', sub: 'Tax Payment', status: 'Done', color: 'bg-emerald-500', amount: '-£1,200' },
                      ].map((row, i) => (
                        <div key={i} className="grid grid-cols-12 gap-2 p-2 border-b border-white/5 items-center hover:bg-white/5">
                           <div className="col-span-5 flex items-center gap-2">
                              <div className="w-4 h-4 rounded bg-gray-700 flex items-center justify-center text-[8px] text-white font-bold">
                                {row.name[0]}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] text-gray-200 font-medium truncate">{row.name}</span>
                                <span className="text-[7px] text-gray-500 truncate">{row.sub}</span>
                              </div>
                           </div>
                           <div className="col-span-3 flex justify-center">
                              <div className={`px-1.5 py-0.5 rounded text-[7px] text-white font-bold uppercase tracking-wider ${row.color}`}>{row.status}</div>
                           </div>
                           <div className="col-span-2 text-[8px] text-gray-500">Oct {24-i}</div>
                           <div className={`col-span-2 text-right text-[8px] font-mono font-bold ${row.amount.startsWith('-') ? 'text-gray-300' : 'text-white'}`}>{row.amount}</div>
                        </div>
                      ))}
                   </div>

                   {/* Bottom Chart Section */}
                   <div className="h-32 bg-[#1e293b]/80 backdrop-blur-sm rounded-lg border border-white/5 p-3 flex items-end justify-between gap-1 relative overflow-hidden shadow-lg z-10">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 border-t border-white/5 top-1/3 pointer-events-none" />
                        <div className="absolute inset-0 border-t border-white/5 top-2/3 pointer-events-none" />
                        
                        {[40, 70, 50, 90, 60, 80, 45, 75, 55, 95, 65, 85].map((h, i) => (
                        <div 
                            key={i} 
                            className="flex-1 bg-gradient-to-t from-teal-900 to-teal-400 rounded-t-[1px] opacity-80 hover:opacity-100 transition-opacity"
                            style={{ 
                            height: `${h}%`,
                            animation: `barGrow 3s ease-in-out ${i * 0.1}s infinite`
                            }} 
                        />
                        ))}
                   </div>
                </div>
              </div>
            </div>

            {/* Layer 2: Floating Graph Card (Middle Left) */}
            <div 
              className="absolute -left-12 bottom-20 w-64 bg-[#0f172a] backdrop-blur-xl border border-teal-500/30 rounded-2xl p-5 shadow-2xl z-20 animate-float"
              style={{ transform: 'translateZ(40px)' }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase">Tax Saved YTD</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-mono font-bold text-white mb-2">£12,450</div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[75%] animate-shimmer" />
              </div>
              <div className="mt-2 text-[10px] text-gray-500 flex justify-between">
                <span>Goal: £15k</span>
                <span className="text-emerald-400">83%</span>
              </div>
            </div>

            {/* Layer 3: Floating Status Card (Top Right) */}
            <div 
              className="absolute -right-8 top-12 w-56 bg-[#0f172a] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-30 animate-float-delayed"
              style={{ transform: 'translateZ(80px)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                 <div className="p-2 bg-luxury-gold rounded-lg text-black shadow-lg shadow-luxury-gold/20">
                   <Activity className="w-4 h-4" />
                 </div>
                 <div>
                   <div className="text-[10px] text-gray-400 font-bold uppercase">Health Score</div>
                   <div className="text-sm text-white font-bold">Excellent</div>
                 </div>
              </div>
              {/* Mini Donut Animation */}
              <div className="flex justify-between items-center">
                 <div className="relative w-12 h-12 rounded-full border-4 border-gray-700 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-luxury-gold border-t-transparent animate-spin duration-3000" />
                    <span className="text-[10px] font-bold text-white">98</span>
                 </div>
                 <div className="text-right">
                   <div className="text-[10px] text-gray-500">Last Scan</div>
                   <div className="text-xs text-emerald-400 font-bold">Just Now</div>
                 </div>
              </div>
            </div>

            {/* Layer 4: Floating Notification (Bottom Right) */}
             <div 
              className="absolute -right-4 bottom-[-20px] bg-teal-500 text-black px-5 py-3 rounded-xl shadow-[0_10px_40px_rgba(20,184,166,0.5)] z-40 flex items-center gap-3 font-bold animate-float border border-teal-400"
              style={{ transform: 'translateZ(100px)' }}
            >
              <div className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-black font-bold" />
              </div>
              <div className="flex flex-col leading-none">
                 <span className="text-xs font-extrabold">Refund Approved</span>
                 <span className="text-[9px] opacity-70 mt-0.5">£1,200 deposited</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};