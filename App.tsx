import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { Hero } from './components/Hero';
import { Pricing } from './components/Pricing';
import { Calculator } from './components/Calculator';
import { DashboardLayout } from './components/DashboardLayout';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { AboutSupport } from './components/AboutSupport';
import { ViewState, UserPlan, DashboardData, UserProfile, BoardItem, ChatMessage, BoardGroup } from './types';

// Initial Data Imports (Moved from DashboardContent)
const initialIncomeItems: BoardItem[] = [
  { 
    id: '1', name: 'Contract Work - Google', person: 'JD', status: 'Done', priority: 'High', date: 'Oct 25', timelineStart: 'Oct 1', timelineEnd: 'Oct 25', amount: 4500, category: 'Salary', files: 1, updates: 3,
    activity: [{ id: 'a1', user: 'JD', action: 'Changed status to Done', timestamp: '2 mins ago' }]
  },
  { 
    id: '2', name: 'Freelance Project X', person: 'JD', status: 'Review', priority: 'Medium', date: 'Oct 20', timelineStart: 'Oct 10', timelineEnd: 'Oct 20', amount: 1200, category: 'Freelance', files: 2, updates: 0,
    activity: []
  },
];

const initialExpenseItems: BoardItem[] = [
  { id: '4', name: 'MacBook Pro M3', person: 'JD', status: 'Done', priority: 'High', date: 'Oct 15', timelineStart: 'Oct 15', timelineEnd: 'Oct 15', amount: -2400, category: 'Equipment', files: 1, updates: 5 },
  { id: '5', name: 'WeWork Membership', person: 'JD', status: 'Done', priority: 'Medium', date: 'Oct 01', timelineStart: 'Oct 1', timelineEnd: 'Oct 31', amount: -450, category: 'Office', updates: 0 },
];

const initialBanks = [
    { id: 1, name: 'Monzo', account: '•••• 4242', balance: '£12,450.00', status: 'Active', icon: 'M' },
    { id: 2, name: 'Revolut', account: '•••• 8899', balance: '£3,200.50', status: 'Active', icon: 'R' }
];

const initialChat: ChatMessage[] = [
    { id: '1', sender: 'ai', text: 'Hello! I am your Tax Copilot. Ask me anything about UK deductions or VAT.', timestamp: new Date() }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [userPlan, setUserPlan] = useState<UserPlan>('Free');

  // --- GLOBAL STATE (Source of Truth) ---
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    initials: 'JD',
    tax: {
      utr: '',
      niNumber: '',
      taxCode: '1257L',
      vatRegistered: false,
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: false,
      marketingEmails: false,
      hmrcDeadlines: true,
    },
    security: {
      twoFactorEnabled: false,
      biometricLogin: false,
    },
    settings: {
        theme: 'dark',
        currency: 'GBP'
    }
  });

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    incomeItems: initialIncomeItems,
    expenseItems: initialExpenseItems,
    customBoards: [],
    banks: initialBanks,
    chatMessages: initialChat,
    showOnboarding: (() => {
       try {
           return !localStorage.getItem('taxsaver_onboarding_completed');
       } catch { return true; }
    })()
  });

  // State setters to pass down
  const updateDashboardData = (updates: Partial<DashboardData>) => {
    setDashboardData(prev => ({ ...prev, ...updates }));
  };

  const handleLoginSuccess = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setView('dashboard');
  };

  const handleNavigate = (target: ViewState) => {
    setView(target);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleLogout = () => {
    setView('landing');
    setUserPlan('Free');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleUpgradeClick = () => {
    setView('pricing');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handlePlanSelection = (plan: UserPlan) => {
    setUserPlan(plan);
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  if (view === 'dashboard') {
    return (
      <DashboardLayout 
        onLogout={handleLogout} 
        userPlan={userPlan}
        onUpgrade={handleUpgradeClick}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        dashboardData={dashboardData}
        updateDashboardData={updateDashboardData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <TopBar onLogin={() => handleNavigate('login')} onNavigate={handleNavigate} />
      <main className="flex-grow">
        {view === 'landing' && <Hero onStart={() => handleNavigate('register')} />}
        {view === 'pricing' && <Pricing onSelect={handlePlanSelection} />}
        {view === 'calculator' && <Calculator onSignup={() => handleNavigate('register')} />}
        {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />}
        {view === 'register' && <Register onRegisterSuccess={handleLoginSuccess} onNavigate={handleNavigate} />}
        {(view === 'about' || view === 'support') && <AboutSupport section={view} />}
      </main>
      
      <footer className="bg-[#022c22] border-t border-white/10 py-12 shrink-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">© 2025 UK TaxSaver. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => handleNavigate('about')} className="text-gray-500 hover:text-white text-sm transition-colors">About Us</button>
            <button onClick={() => handleNavigate('support')} className="text-gray-500 hover:text-white text-sm transition-colors">Support</button>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;