"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart3, Zap, Globe, Shield, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl overflow-hidden shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              I
            </div>
            <span className="text-xl font-bold tracking-tight">Infonana <span className="text-indigo-400">AI</span></span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Login</Link>
            <Link href="/auth/register" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
              AI-Powered Visualization
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
              Data into <br /> <span className="text-indigo-500">Infographics</span> in seconds.
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Transform your raw data, articles, or prompts into professional, high-impact infographics powered by cutting-edge AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register" className="group bg-white text-slate-950 px-8 py-4 rounded-full text-lg font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all hover:pr-10">
                Start Generating Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link href="#pricing" className="px-8 py-4 rounded-full text-lg font-bold border border-white/10 hover:bg-white/5 transition-all">
                View Pricing
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000"
              alt="Dashboard Preview"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            { icon: Zap, title: "Instant Generation", desc: "No more spending hours in Canva. Just describe what you need, and Infonana does the rest." },
            { icon: BarChart3, title: "Data Driven", desc: "Upload CSVs or paste data tables. We turn numbers into visual stories that stick." },
            { icon: Shield, title: "Production Ready", desc: "Export in high resolution PNG, PDF, or SVG. Perfect for reports and social media." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all"
            >
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-400">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>&copy; 2024 Infonana AI. Built for the future of data visualization.</p>
      </footer>
    </div>
  );
}
