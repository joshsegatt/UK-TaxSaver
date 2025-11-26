"use client";

import React, { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { Hero } from '../components/Hero';
import { Pricing } from '../components/Pricing';
import { Calculator } from '../components/Calculator';
import { AboutSupport } from '../components/AboutSupport';
import { ViewState, UserPlan } from '../types';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const [view, setView] = useState<ViewState>('landing');
    const router = useRouter();

    const handleNavigate = (target: ViewState) => {
        if (target === 'login') {
            router.push('/sign-in');
            return;
        }
        if (target === 'register') {
            router.push('/sign-up');
            return;
        }
        if (target === 'dashboard') {
            router.push('/dashboard');
            return;
        }
        setView(target);
        window.scrollTo({ top: 0, behavior: 'auto' });
    };

    const handlePlanSelection = (plan: UserPlan) => {
        // In a real app, this would redirect to checkout
        router.push('/sign-up');
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <TopBar onLogin={() => router.push('/sign-in')} onNavigate={handleNavigate} />
            <main className="flex-grow">
                {view === 'landing' && <Hero onStart={() => router.push('/sign-up')} />}
                {view === 'pricing' && <Pricing onSelect={handlePlanSelection} />}
                {view === 'calculator' && <Calculator onSignup={() => router.push('/sign-up')} />}
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
}
