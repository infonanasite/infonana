"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions, db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import { Zap, Layout, HardDrive, Download, Eye, Plus, Send } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    const { user, userData } = useAuth();
    const [subject, setSubject] = useState('');
    const [lessonTitle, setLessonTitle] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [infographics, setInfographics] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (!user) return;
        const infographicsRef = ref(db, `infographics/${user.uid}`);
        return onValue(infographicsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.values(data).sort((a, b) => b.createdAt - a.createdAt);
                setInfographics(list);
            }
        });
    }, [user]);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!subject || !lessonTitle) return;

        setIsGenerating(true);
        setMessage({ type: 'info', text: 'AI is thinking... Generating your royal infographic.' });

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject,
                    lessonTitle,
                    teacherName: teacherName || userData?.name || 'الأستاذ منير محمد',
                    uid: user.uid
                })
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            setSubject('');
            setLessonTitle('');
            setMessage({ type: 'success', text: 'Royal Infographic generated successfully!' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: err.message || 'Failed to generate infographic.' });
        } finally {
            setIsGenerating(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-slate-900/50 flex flex-col">
                <div className="p-6 border-b border-white/5 flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black">I</div>
                    <span className="font-bold">Infonana AI</span>
                </div>
                <nav className="p-4 space-y-2 flex-grow">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-indigo-600/10 text-indigo-400 rounded-xl font-medium">
                        <Layout className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link href="/account" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all">
                        <HardDrive className="w-5 h-5" /> My Files
                    </Link>
                    <Link href="/account/billing" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all">
                        <Zap className="w-5 h-5" /> Credits & Plan
                    </Link>
                </nav>
                <div className="p-4 border-t border-white/5">
                    <div className="bg-indigo-600/10 border border-indigo-600/20 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Credits</span>
                            <span className="text-sm font-bold">{userData?.credits || 0} left</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-indigo-500 h-full transition-all duration-500"
                                style={{ width: `${Math.min(((userData?.credits || 0) / 10) * 100, 100)}%` }}
                            />
                        </div>
                        <Link href="/account/billing" className="mt-4 block text-center text-xs font-bold text-indigo-400 hover:text-indigo-300">
                            Upgrade Plan &rarr;
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-10 overflow-y-auto">
                <header className="flex justify-between items-center mb-12 text-right rtl">
                    <div className="w-full">
                        <h1 className="text-3xl font-black tracking-tight mb-2">لوحة التحكم الملكية</h1>
                        <p className="text-slate-400">حول دروسك إلى تصاميم احترافية بضغطة زر</p>
                    </div>
                </header>

                {/* Generator Form */}
                <section className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 mb-12">
                    <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-right">المادة العلمية</label>
                            <input
                                className="bg-slate-950 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-right"
                                placeholder="مثال: تاريخ، علوم..."
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-right">عنوان الدرس</label>
                            <input
                                className="bg-slate-950 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-right"
                                placeholder="مثال: موقع مصر الجغرافي"
                                value={lessonTitle}
                                onChange={(e) => setLessonTitle(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-right">اسم المعلم</label>
                            <input
                                className="bg-slate-950 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-right"
                                placeholder="اتركه فارغاً للافتراضي"
                                value={teacherName}
                                onChange={(e) => setTeacherName(e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-3 flex justify-end items-center gap-4 mt-4">
                            <button
                                disabled={isGenerating || !subject || !lessonTitle}
                                className={`flex items-center gap-3 px-10 py-4 rounded-xl font-black transition-all ${isGenerating || !subject || !lessonTitle
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                    }`}
                            >
                                {isGenerating ? 'جاري التصميم الملكي...' : 'إنشاء الانفوجرافيك'}
                                {!isGenerating && <Send className="w-5 h-5 rtl:rotate-180" />}
                            </button>
                        </div>
                    </form>

                    {message && (
                        <div className={`mt-6 p-4 rounded-xl text-sm font-medium border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                    'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                            }`}>
                            {message.text}
                        </div>
                    )}
                </section>

                {/* Infographics Grid */}
                <section>
                    <h2 className="text-xl font-bold mb-6 text-right">إبداعاتك الأخيرة</h2>
                    {infographics.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                                <Layout className="w-8 h-8 text-slate-600" />
                            </div>
                            <p className="text-slate-500 font-medium">ابدأ بملء البيانات أعلاه لترى إبداعك!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {infographics.map((item) => (
                                <div key={item.id} className="group bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all">
                                    <div className="aspect-[3/4] bg-slate-800 relative">
                                        <img src={item.outputUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all shadow-inner" alt={item.lessonTitle} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                                            <span className="bg-indigo-600/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-lg border border-white/10">
                                                {item.subject || 'NANO PRO'}
                                            </span>
                                            <div className="flex gap-2">
                                                <button className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white/20 transition-all">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="w-9 h-9 bg-indigo-600/20 text-indigo-400 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-indigo-600/40 transition-all">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5 text-right">
                                        <p className="text-sm font-black text-white mb-1">{item.lessonTitle || 'بدون عنوان'}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-[10px] text-slate-500">{new Date(item.createdAt).toLocaleDateString('ar-EG')}</span>
                                            <span className="text-[11px] font-bold text-slate-400">{item.teacherName}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
