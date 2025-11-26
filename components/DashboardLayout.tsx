"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  Settings,
  LogOut,
  ShieldCheck,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Plus,
  Landmark,
  Crown,
  ExternalLink
} from 'lucide-react';
import { DashboardTab, UserPlan, UserProfile, DashboardData } from '../types';
import { DashboardContent } from './DashboardContent';
import { Button } from './ui/Button';

interface DashboardLayoutProps {
  onLogout: () => void;
  userPlan: UserPlan;
  onUpgrade: () => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  dashboardData: DashboardData;
  updateDashboardData: (data: Partial<DashboardData>) => void;
}

import { useStackApp } from "@stackframe/stack";

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onLogout,
  userPlan,
  onUpgrade,
  userProfile,
  setUserProfile,
  dashboardData,
  updateDashboardData
}) => {
  const stackApp = useStackApp();
  const handleLogout = async () => {
    await stackApp.signOut();
    // onLogout prop might be redundant if we handle it here, but keeping for compatibility
    if (onLogout) onLogout();
  };

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollTarget, setScrollTarget] = useState<string | null>(null); // For Smart Board Navigation

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Tax Return Due', msg: 'Your Self Assessment is due in 30 days.', type: 'alert', time: '2 hrs ago' },
    { id: 2, title: 'Refund Approved', msg: 'HMRC has approved your rebate of £1,200.', type: 'success', time: '1 day ago' },
    { id: 3, title: 'New Feature', msg: 'Try the new Bank Connect integration.', type: 'info', time: '2 days ago' },
  ]);
  const notificationRef = useRef<HTMLDivElement>(null);

  const navItems: { icon: any; label: string; id: DashboardTab }[] = [
    { icon: LayoutDashboard, label: 'Home', id: 'overview' },
    { icon: Wallet, label: 'Transactions', id: 'transactions' },
    { icon: PieChart, label: 'Reports', id: 'reports' },
    { icon: Landmark, label: 'Linked Banks', id: 'banks' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  const handleNavClick = (id: DashboardTab) => {
    setActiveTab(id);
    setScrollTarget(null); // Reset scroll target on normal nav
    setIsMobileMenuOpen(false);
  };

  // Smart Board Navigation
  const handleSmartBoardClick = (targetId: string) => {
    setActiveTab('overview');
    setScrollTarget(targetId);
    setIsMobileMenuOpen(false);
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#022c22] overflow-hidden font-sans">

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-50 w-[260px] bg-[#022c22] border-r border-white/5 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Workspace Switcher */}
          <div className="h-[64px] flex items-center px-6 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex-1 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-luxury-gold to-yellow-700 flex items-center justify-center text-black font-bold shadow-lg shadow-luxury-gold/10">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-white text-sm font-bold truncate">TaxSaver OS</div>
                <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                  {userPlan} Workspace
                  {userPlan === 'Free' && <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />}
                  {userPlan === 'Pro' && <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold shadow-[0_0_5px_gold]" />}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <button className="md:hidden text-gray-400 ml-2" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${activeTab === item.id
                  ? 'bg-[#115e59] text-white shadow-inner'
                  : 'text-gray-400 hover:bg-[#134e4a] hover:text-gray-200'
                  }`}
              >
                <item.icon className={`w-4 h-4 transition-colors ${activeTab === item.id ? 'text-luxury-gold' : 'text-gray-500 group-hover:text-gray-300'}`} />
                <span className="text-sm font-medium">{item.label}</span>
                {item.id === 'banks' && userPlan === 'Free' && (
                  <LockIcon />
                )}
              </button>
            ))}

            {/* Smart Boards Navigation */}
            <div className="mt-8 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="px-3 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex justify-between items-center">
                <span>Smart Boards</span>
                <Plus className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => handleNavClick('overview')} />
              </div>

              <button
                onClick={() => handleSmartBoardClick('board-income')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:bg-[#134e4a] hover:text-gray-200 transition-all text-left group"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform"></div>
                <span className="text-sm font-medium">Income Streams</span>
              </button>

              <button
                onClick={() => handleSmartBoardClick('board-expenses')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:bg-[#134e4a] hover:text-gray-200 transition-all text-left group"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] group-hover:scale-110 transition-transform"></div>
                <span className="text-sm font-medium">Expenses</span>
              </button>

              {dashboardData.customBoards.map(board => (
                <button
                  key={board.id}
                  onClick={() => handleSmartBoardClick(board.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:bg-[#134e4a] hover:text-gray-200 transition-all text-left group"
                >
                  <div className="w-2 h-2 rounded-full shadow-sm group-hover:scale-110 transition-transform" style={{ backgroundColor: board.color }}></div>
                  <span className="text-sm font-medium truncate">{board.title}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Upgrade Card (If Free) */}
          {userPlan === 'Free' && (
            <div className="px-3 mb-4">
              <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-luxury-gold/30 rounded-xl p-4 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-12 h-12 bg-luxury-gold/10 rounded-bl-full -mr-2 -mt-2"></div>
                <div className="relative z-10">
                  <h4 className="text-white font-bold text-sm mb-1">Upgrade to Pro</h4>
                  <p className="text-xs text-gray-400 mb-3">Unlock bank sync & reports.</p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full h-8 text-xs bg-luxury-gold !text-black border-none font-bold hover:!bg-[#F3C600] transition-colors"
                    onClick={onUpgrade}
                  >
                    Unlock Features
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="p-4 border-t border-white/5 space-y-2">
            {/* HMRC Quick Link */}
            <a
              href="https://www.access.service.gov.uk/login/signin/creds"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group text-gray-400 hover:text-white"
            >
              <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center border border-purple-500/30 group-hover:border-purple-400 transition-colors">
                <Crown className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold">Gov Gateway</div>
                <div className="text-[10px] opacity-70">HMRC Login</div>
              </div>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>

            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors" onClick={handleLogout}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-black">
                {userProfile.initials}
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-white">{userProfile.firstName} {userProfile.lastName}</div>
                <div className="text-[10px] text-gray-400">{userPlan} Plan</div>
              </div>
              <LogOut className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-1 h-full relative flex flex-col overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#115e59] to-[#042f2e]">

        {/* Header */}
        <header className="h-[72px] px-6 flex items-center justify-between shrink-0 border-b border-white/5 bg-[#022c22]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Current View</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white capitalize">{activeTab}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workspace..."
                className="h-9 pl-10 pr-4 bg-[#134e4a]/50 border border-transparent hover:border-white/10 rounded-full text-xs text-white placeholder-gray-500 focus:outline-none focus:bg-[#115e59] focus:ring-1 focus:ring-luxury-gold/50 transition-all w-48 focus:w-64"
              />
            </div>

            <div className="h-6 w-px bg-white/10 hidden md:block" />

            <div className="relative" ref={notificationRef}>
              <button
                className={`relative p-2 transition-colors ${showNotifications ? 'text-white bg-white/10 rounded-full' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-luxury-gold rounded-full border-2 border-[#0F0F0F] animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                    <span className="text-sm font-bold text-white">Notifications</span>
                    {notifications.length > 0 && <span className="text-[10px] text-gray-400 bg-black/40 px-2 py-0.5 rounded-full border border-white/5">{notifications.length} New</span>}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-xs">No new notifications</div>
                    ) : (
                      notifications.map((notif, i) => (
                        <div
                          key={i}
                          onClick={() => handleNotificationClick(notif.id)}
                          className="px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 cursor-pointer transition-colors group"
                        >
                          <div className="flex gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.type === 'alert' ? 'bg-rose-500' : notif.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                            <div>
                              <div className="text-sm font-bold text-gray-200 group-hover:text-white">{notif.title}</div>
                              <div className="text-xs text-gray-400 leading-snug">{notif.msg}</div>
                              <div className="text-[10px] text-gray-600 mt-1">{notif.time}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-2 border-t border-white/10 bg-black/20 text-center">
                      <button onClick={clearNotifications} className="text-xs font-bold text-luxury-gold hover:text-white transition-colors">Mark all as read</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8 pb-20 relative scroll-smooth">
          <DashboardContent
            activeTab={activeTab}
            userPlan={userPlan}
            onUpgrade={onUpgrade}
            searchQuery={searchQuery}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            dashboardData={dashboardData}
            updateDashboardData={updateDashboardData}
            scrollTarget={scrollTarget}
          />
        </div>
      </main>
    </div>
  );
};

const LockIcon = () => (
  <svg className="w-3 h-3 text-luxury-gold ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);