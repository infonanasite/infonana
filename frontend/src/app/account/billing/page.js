"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Layout, Zap, Check, ArrowUpRight, CreditCard, Clock } from 'lucide-react';
import Link from 'next/link';

export default function BillingPage() {
    const { userData } = useAuth();

    const plans = [
        {
            name: "Free",
            price: "$0",
            credits: "5 credits/mo",
            features: ["Watermarked exports", "Basic templates", "Standard support"],
            button: "Current Plan",
            current: userData?.plan === 'FREE' || !userData?.plan
        },
        {
            name: "Pro",
            price: "$29",
            credits: "50 credits/mo",
            features: ["No watermarks", "Premium templates", "Priority generation", "SVG Exports"],
            button: "Upgrade to Pro",
            popular: true,
            current: userData?.plan === 'PRO'
        },
        {
            name: "Enterprise",
            price: "$99",
            credits: "500 credits/mo",
            features: ["Mass generation", "API Access", "Team seats", "White-labeling"],
            button: "Contact Sales",
            current: userData?.plan === 'ENTERPRISE'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Sidebar (Reusable Component logic) */}
            <aside className="w-64 border-r border-white/5 bg-slate-900/50 flex flex-col">
                <div className="p-6 border-b border-white/5 flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black">I</div>
                    <span className="font-bold">Infonana AI</span>
                </div>
                <nav className="p-4 space-y-2 flex-grow">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all">
                        <Layout className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link href="/account/billing" className="flex items-center gap-3 px-4 py-3 bg-indigo-600/10 text-indigo-400 rounded-xl font-medium">
                        <Zap className="w-5 h-5" /> Credits & Plan
                    </Link>
                </nav>
            </aside>

            <main className="flex-grow p-10 overflow-y-auto">
                <header className="mb-12">
                    <h1 className="text-3xl font-black tracking-tight">Billing & Plans</h1>
                    <p className="text-slate-400">Manage your subscription and usage on Infonana.</p>
                </header>

                {/* Current Status */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-indigo-600 p-8 rounded-3xl relative overflow-hidden shadow-2xl shadow-indigo-500/20">
                        <div className="relative z-10">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-70">Active Plan</span>
                            <div className="text-4xl font-black mt-2 mb-4">{userData?.plan || 'Free'}</div>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <CreditCard className="w-4 h-4" />
                                <span>{userData?.credits || 0} credits remaining this month</span>
                            </div>
                        </div>
                        <Zap className="absolute -right-10 -bottom-10 w-48 h-48 opacity-10 rotate-12" />
                    </div>

                    <div className="bg-slate-900 border border-white/5 p-8 rounded-3xl flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Next Reset</div>
                                <div className="text-lg font-bold">April 1st, 2024</div>
                            </div>
                        </div>
                        <button className="text-sm font-bold text-indigo-400 flex items-center gap-1 hover:underline">
                            Manage Billing Portal <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Plan Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <div key={i} className={`p-8 rounded-3xl border transition-all ${plan.popular
                                ? 'bg-slate-900 border-indigo-500/50 scale-105 shadow-2xl shadow-indigo-500/10 z-10'
                                : 'bg-slate-900 border-white/5 hover:border-white/10'
                            }`}>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold">{plan.name}</h3>
                                    <p className="text-slate-500 text-sm mt-1">{plan.credits}</p>
                                </div>
                                {plan.popular && (
                                    <span className="bg-indigo-500 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full">Popular</span>
                                )}
                            </div>
                            <div className="mb-8">
                                <span className="text-4xl font-black">{plan.price}</span>
                                <span className="text-slate-500 ml-1">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-10">
                                {plan.features.map((feat, j) => (
                                    <li key={j} className="flex items-center gap-3 text-sm text-slate-400">
                                        <Check className="w-4 h-4 text-indigo-500" /> {feat}
                                    </li>
                                ))}
                            </ul>
                            <button
                                disabled={plan.current}
                                className={`w-full py-4 rounded-xl font-bold transition-all ${plan.current
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        : plan.popular
                                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                            : 'bg-white text-slate-950 hover:bg-indigo-50'
                                    }`}
                            >
                                {plan.button}
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
