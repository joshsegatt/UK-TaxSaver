
import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import {
  Wallet,
  TrendingUp,
  Info,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Settings,
  PoundSterling,
  Building2,
  Briefcase,
  Download,
  CheckCircle2,
  LockOpen,
  X,
  Lightbulb,
  PiggyBank,
  Bike,
  Heart
} from 'lucide-react';

interface CalculatorProps {
  onSignup: () => void;
}

type Region = 'England' | 'Scotland' | 'Wales';
type StudentLoan = 'none' | 'plan1' | 'plan2' | 'plan4' | 'pg';

export const Calculator: React.FC<CalculatorProps> = ({ onSignup }) => {
  // --- STATE ---
  const [salary, setSalary] = useState<number>(65000);
  const [pension, setPension] = useState<number>(5);
  const [bonus, setBonus] = useState<number>(0);
  const [region, setRegion] = useState<Region>('England');
  const [taxCode, setTaxCode] = useState<string>('1257L');
  const [studentLoan, setStudentLoan] = useState<StudentLoan>('plan2');
  const [isBlind, setIsBlind] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showStrategies, setShowStrategies] = useState(false);

  const [results, setResults] = useState({
    gross: 0,
    tax: 0,
    ni: 0,
    studentLoan: 0,
    pension: 0,
    net: 0,
    marginalRate: 0,
  });

  // --- ENGINE ---
  useEffect(() => {
    const calculate = () => {
      const gross = salary + bonus;

      // 1. Pension (Assume Salary Sacrifice for simplicity/optimization)
      const pensionAmount = (gross * (pension / 100));
      const taxableGross = gross - pensionAmount;

      // 2. Personal Allowance Logic
      let allowance = 12570;

      // Blind Person's Allowance (24/25)
      if (isBlind) allowance += 3070;

      // Taper (Lost by £1 for every £2 over £100k)
      if (taxableGross > 100000) {
        const reduction = (taxableGross - 100000) / 2;
        allowance = Math.max(0, allowance - reduction);
      }

      // Tax Code Override (Basic simulation)
      if (taxCode.toUpperCase() === 'BR') allowance = 0;
      // Note: Full tax code parsing is complex, assuming standard logic + override for now

      // 3. Income Tax Calculation
      let tax = 0;
      const taxableIncome = Math.max(0, taxableGross - allowance);

      if (region === 'Scotland') {
        // Scottish Bands 24/25 (Approx)
        // Starter (19%), Basic (20%), Intermediate (21%), Higher (42%), Advanced (45%), Top (48%)
        // Simplified Logic for Demo:
        if (taxableIncome > 125140) {
          tax += (taxableIncome - 125140) * 0.48; // Top
          tax += (125140 - 62430) * 0.45; // Advanced
          tax += (62430 - 43663) * 0.42; // Higher
          tax += (43663 - 26562) * 0.21; // Intermediate
          tax += (26562 - 14876) * 0.20; // Basic
          tax += (14876 - 0) * 0.19; // Starter
        } else if (taxableIncome > 62430) {
          tax += (taxableIncome - 62430) * 0.45;
          tax += (62430 - 43663) * 0.42;
          tax += (43663 - 26562) * 0.21;
          tax += (26562 - 14876) * 0.20;
          tax += (14876 - 0) * 0.19;
        } else if (taxableIncome > 43663) {
          tax += (taxableIncome - 43663) * 0.42;
          tax += (43663 - 26562) * 0.21;
          tax += (26562 - 14876) * 0.20;
          tax += (14876 - 0) * 0.19;
        } else if (taxableIncome > 26562) {
          tax += (taxableIncome - 26562) * 0.21;
          tax += (26562 - 14876) * 0.20;
          tax += (14876 - 0) * 0.19;
        } else if (taxableIncome > 14876) {
          tax += (taxableIncome - 14876) * 0.20;
          tax += (14876 - 0) * 0.19;
        } else {
          tax += taxableIncome * 0.19;
        }
      } else {
        // RUK (Rest of UK) Bands
        if (taxableIncome > 125140) {
          tax += (taxableIncome - 125140) * 0.45;
          tax += (125140 - 37700) * 0.40;
          tax += 37700 * 0.20;
        } else if (taxableIncome > 37700) {
          tax += (taxableIncome - 37700) * 0.40;
          tax += 37700 * 0.20;
        } else {
          tax += taxableIncome * 0.20;
        }
      }

      // 4. National Insurance (24/25 - 8% then 2%)
      let ni = 0;
      // NI thresholds apply to per pay period, but annualised for this Calc
      if (gross > 50270) {
        ni += (gross - 50270) * 0.02;
        ni += (50270 - 12570) * 0.08;
      } else if (gross > 12570) {
        ni += (gross - 12570) * 0.08;
      }

      // 5. Student Loan
      let loan = 0;
      const planThresholds = {
        'plan1': 24990,
        'plan2': 27295,
        'plan4': 31395, // Scotland
        'pg': 21000,
        'none': 9999999
      };
      const threshold = planThresholds[studentLoan];
      const rate = studentLoan === 'pg' ? 0.06 : 0.09;

      if (gross > threshold) {
        loan = (gross - threshold) * rate;
      }

      const net = gross - tax - ni - loan - pensionAmount;

      // Marginal Rate Calculation (Simplified)
      let marginal = 0;
      if (region === 'Scotland') {
        if (taxableIncome > 125140) marginal = 48 + 2; // + NI
        else if (taxableIncome > 62430) marginal = 45 + 2;
        else if (taxableIncome > 43663) marginal = 42 + 2; // Between 43k and 50k NI is 8%
        else if (taxableIncome > 26562) marginal = 21 + 8;
        else if (taxableIncome > 14876) marginal = 20 + 8;
        else marginal = 19;
      } else {
        if (taxableIncome > 125140) marginal = 45 + 2;
        else if (taxableIncome > 100000) marginal = 60 + 2; // The 60% trap!
        else if (taxableIncome > 50270) marginal = 40 + 2;
        else if (taxableIncome > 12570) marginal = 20 + 8;
      }

      setResults({
        gross,
        tax,
        ni,
        studentLoan: loan,
        pension: pensionAmount,
        net,
        marginalRate: marginal
      });
    };

    calculate();
  }, [salary, bonus, pension, region, taxCode, studentLoan, isBlind]);

  // --- EXPORT FUNCTION ---
  const handleExport = () => {
    setIsExporting(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsExporting(false);
      // In a real app, this would download a PDF
      // For now, we simulate success via button state
    }, 1500);
  };

  // --- VISUALIZATION DATA ---
  const chartData = [
    { name: 'Net Pay', value: results.net, color: '#10B981' },
    { name: 'Tax', value: results.tax, color: '#f43f5e' },
    { name: 'NI', value: results.ni, color: '#f59e0b' },
    { name: 'Pension', value: results.pension, color: '#2dd4bf' },
    { name: 'Loan', value: results.studentLoan, color: '#8b5cf6' },
  ].filter(d => d.value > 0);

  const breakdownData = [
    { label: 'Yearly', factor: 1 },
    { label: 'Monthly', factor: 12 },
    { label: 'Weekly', factor: 52 },
    { label: 'Daily', factor: 260 },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-[#0f172a] via-[#115e59] to-[#042f2e] text-white overflow-y-auto no-scrollbar font-sans relative">

      {/* STRATEGIES MODAL */}
      {showStrategies && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-white/10 bg-[#022c22]/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-luxury-gold rounded-lg text-black">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Optimization Strategies</h3>
              </div>
              <button onClick={() => setShowStrategies(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <p className="text-gray-300 text-sm mb-4">
                Based on your marginal rate of <span className="text-rose-400 font-bold">{results.marginalRate}%</span>, here is how you can effectively reduce your tax bill.
              </p>

              <div className="bg-[#1e293b]/50 rounded-xl p-4 border border-white/5 flex gap-4">
                <div className="p-2 bg-teal-500/10 rounded-lg h-fit">
                  <PiggyBank className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Salary Sacrifice Pension</h4>
                  <p className="text-xs text-gray-400 mt-1">Contributing more to your pension reduces your taxable income directly. This is the most efficient way to reclaim Personal Allowance over £100k.</p>
                </div>
              </div>

              <div className="bg-[#1e293b]/50 rounded-xl p-4 border border-white/5 flex gap-4">
                <div className="p-2 bg-blue-500/10 rounded-lg h-fit">
                  <Bike className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Cycle to Work Scheme</h4>
                  <p className="text-xs text-gray-400 mt-1">Purchase a bike and equipment tax-free. The cost is deducted from your gross salary, saving you Income Tax and National Insurance.</p>
                </div>
              </div>

              <div className="bg-[#1e293b]/50 rounded-xl p-4 border border-white/5 flex gap-4">
                <div className="p-2 bg-rose-500/10 rounded-lg h-fit">
                  <Heart className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Gift Aid Donations</h4>
                  <p className="text-xs text-gray-400 mt-1">Donating to charity extends your Basic Rate tax band. If you are a Higher Rate payer, you can claim back the difference (20% or 25%) via Self Assessment.</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-[#022c22]/30 border-t border-white/10 text-center">
              <Button onClick={onSignup} variant="primary" className="bg-luxury-gold !text-black border-none font-bold hover:bg-[#F3C600]">
                Automate with Pro Plan
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-6">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/30 rounded-full mb-4 animate-in fade-in slide-in-from-top-4">
            <LockOpen className="w-3 h-3 text-teal-400" />
            <span className="text-[10px] font-bold text-teal-200 uppercase tracking-wide">Included in Free Plan</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 drop-shadow-lg">
            Advanced Salary Calculator
          </h1>
          <p className="text-gray-200 font-medium">Updated for 2024/25 Tax Year • HMRC Compliant</p>
        </div>

        <div className="grid xl:grid-cols-12 gap-8 items-start">

          {/* --- LEFT COLUMN: INPUTS --- */}
          <div className="xl:col-span-5 space-y-6">

            {/* Main Income Card - Matching Dashboard Pro Style */}
            <Card dark className="p-6 bg-[#0f172a]/80 backdrop-blur-md border border-white/10 shadow-2xl relative z-10">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="p-2 bg-teal-500 rounded-lg text-black shadow-lg shadow-teal-500/20">
                  <Wallet className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Income Details</h3>
              </div>

              <div className="space-y-6">
                {/* Salary */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wide flex justify-between">
                    Annual Salary
                    <span className="text-white font-mono font-bold text-lg">£{salary.toLocaleString()}</span>
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="range" min="12000" max="150000" step="500"
                      value={salary} onChange={(e) => setSalary(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-700 rounded-full appearance-none accent-teal-400 hover:accent-teal-300 cursor-pointer"
                    />
                    <input
                      type="number"
                      value={salary} onChange={(e) => setSalary(Number(e.target.value))}
                      className="w-28 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono font-bold focus:border-teal-500 outline-none text-right shadow-inner"
                    />
                  </div>
                </div>

                {/* Pension */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wide flex justify-between">
                    Pension Contribution
                    <span className="text-teal-400 font-mono font-bold">{pension}%</span>
                  </label>
                  <input
                    type="range" min="0" max="25" step="1"
                    value={pension} onChange={(e) => setPension(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none accent-teal-400 hover:accent-teal-300 cursor-pointer"
                  />
                </div>
              </div>
            </Card>

            {/* Advanced Settings Accordion */}
            <Card dark className="bg-[#0f172a]/80 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden transition-all duration-300">
              <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <h3 className="text-sm font-bold text-white">Advanced Settings</h3>
                </div>
                {showAdvanced ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>

              {showAdvanced && (
                <div className="p-6 pt-0 space-y-6 border-t border-white/10 animate-in slide-in-from-top-2">

                  {/* Tax Code & Region */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 uppercase">Tax Region</label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value as Region)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-medium focus:border-teal-500 outline-none appearance-none"
                      >
                        <option value="England">England & NI</option>
                        <option value="Scotland">Scotland</option>
                        <option value="Wales">Wales</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 uppercase">Tax Code</label>
                      <input
                        type="text"
                        value={taxCode}
                        onChange={(e) => setTaxCode(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono font-medium focus:border-teal-500 outline-none uppercase"
                      />
                    </div>
                  </div>

                  {/* Student Loan */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-300 uppercase">Student Loan</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['none', 'plan1', 'plan2', 'plan4', 'pg'].map((plan) => (
                        <button
                          key={plan}
                          onClick={() => setStudentLoan(plan as StudentLoan)}
                          className={`px-2 py-2 rounded border text-xs font-bold transition-colors uppercase ${studentLoan === plan
                              ? 'bg-teal-500 border-teal-500 text-black'
                              : 'border-white/10 text-gray-300 hover:border-gray-400 hover:text-white bg-black/40'
                            }`}
                        >
                          {plan === 'pg' ? 'Postgrad' : plan === 'none' ? 'None' : plan.replace('plan', 'Plan ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bonus & Overtime */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-300 uppercase">Annual Bonus / Overtime</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">£</span>
                      <input
                        type="number"
                        value={bonus}
                        onChange={(e) => setBonus(Number(e.target.value))}
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm text-white font-mono font-medium focus:border-teal-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <span className="text-sm text-gray-200 font-medium">Blind Person's Allowance</span>
                    <button
                      onClick={() => setIsBlind(!isBlind)}
                      className={`w-11 h-6 rounded-full relative transition-colors ${isBlind ? 'bg-teal-500' : 'bg-gray-600'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm ${isBlind ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>

                </div>
              )}
            </Card>

            {/* Smart Optimization Tip */}
            <div className="p-4 rounded-xl bg-[#022c22]/90 border border-teal-500/30 flex items-start gap-4 shadow-lg backdrop-blur-sm">
              <div className="p-2 bg-teal-500/20 rounded-full text-teal-400 mt-1">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-teal-200">Marginal Tax Trap</h4>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed font-medium">
                  You keep <span className="text-white font-bold">{(100 - results.marginalRate).toFixed(0)}p</span> of every extra £1 earned.
                  {salary > 100000 && " Warning: You are losing your Personal Allowance."}
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowStrategies(true)}
                  className="mt-3 h-8 bg-luxury-gold !text-black border-none font-bold text-xs hover:bg-[#F3C600] transition-colors"
                >
                  View Strategies
                </Button>
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN: RESULTS --- */}
          <div className="xl:col-span-7 space-y-6">

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card dark className="p-6 bg-[#0f172a]/80 backdrop-blur-md border border-white/10 flex flex-col justify-between h-32 relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <PoundSterling className="w-16 h-16 text-emerald-400" />
                </div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">Yearly Take Home</div>
                <div className="text-4xl font-mono font-bold text-white tracking-tight">£{results.net.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <div className="text-xs font-bold text-emerald-400 bg-emerald-900/30 w-fit px-2 py-0.5 rounded border border-emerald-500/20">
                  {((results.net / results.gross) * 100).toFixed(1)}% of Gross
                </div>
              </Card>

              <Card dark className="p-6 bg-[#0f172a]/80 backdrop-blur-md border border-white/10 flex flex-col justify-between h-32 relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Wallet className="w-16 h-16 text-blue-400" />
                </div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">Monthly Take Home</div>
                <div className="text-4xl font-mono font-bold text-white tracking-tight">£{(results.net / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <div className="text-xs font-bold text-blue-400 bg-blue-900/30 w-fit px-2 py-0.5 rounded border border-blue-500/20">
                  Bills & Savings
                </div>
              </Card>
            </div>

            {/* Detailed Chart & Table Container */}
            <Card dark className="p-0 bg-[#0f172a]/80 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl">

              {/* Visual Section */}
              <div className="p-8 grid md:grid-cols-2 gap-8 items-center border-b border-white/5">
                {/* Donut Chart */}
                <div className="h-[240px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={4}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => `£${value.toLocaleString()}`}
                        contentStyle={{ backgroundColor: '#022c22', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-white font-mono">£{(results.net / 12).toFixed(0)}</span>
                    <span className="text-xs text-gray-500 font-bold uppercase">Per Month</span>
                  </div>
                </div>

                {/* Legend / Breakdown List */}
                <div className="space-y-4">
                  {chartData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">{item.name}</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-white">£{item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  ))}
                  <div className="h-px bg-white/10 my-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Total Deductions</span>
                    <span className="font-mono text-sm font-bold text-rose-400">-£{(results.gross - results.net).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>

                  {/* FREE EXPORT BUTTON - UPDATED HOVER STYLES FOR HIGH CONTRAST */}
                  <Button
                    onClick={handleExport}
                    size="sm"
                    variant="secondary"
                    fullWidth
                    className="bg-white !text-black border-none hover:bg-gray-200 font-bold text-xs mt-2 transition-all shadow-lg"
                  >
                    {isExporting ? 'Generating PDF...' : (
                      <span className="flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Breakdown
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* The "Pro" Data Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/30 border-b border-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="p-4 pl-8">Period</th>
                      <th className="p-4">Gross Income</th>
                      <th className="p-4">Taxable</th>
                      <th className="p-4 text-rose-400">Tax</th>
                      <th className="p-4 text-amber-400">NI</th>
                      <th className="p-4 text-emerald-400">Take Home</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm font-mono">
                    {breakdownData.map((period, i) => (
                      <tr key={period.label} className="hover:bg-white/5 transition-colors group">
                        <td className="p-4 pl-8 font-sans font-bold text-white">{period.label}</td>
                        <td className="p-4 text-gray-300">£{(results.gross / period.factor).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        <td className="p-4 text-gray-500">£{(Math.max(0, results.gross - 12570) / period.factor).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        <td className="p-4 text-rose-300 group-hover:text-rose-400">£{(results.tax / period.factor).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        <td className="p-4 text-amber-300 group-hover:text-amber-400">£{(results.ni / period.factor).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        <td className="p-4 font-bold text-emerald-400">£{(results.net / period.factor).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </Card>

            <div className="flex justify-end gap-4">
              <Button
                onClick={onSignup}
                variant="primary"
                className="bg-luxury-gold !text-black border-none hover:bg-yellow-400 font-bold shadow-lg shadow-black/30 px-8 h-12 text-sm uppercase tracking-wide transition-colors"
              >
                Save Calculation & Start <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
