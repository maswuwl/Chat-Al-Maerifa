
import React, { useState } from 'react';
import { translations } from '../translations';

interface AppStoreProps {
  lang: 'en' | 'ar';
}

interface MarketApp {
  id: string;
  name: string;
  icon: string;
  category: 'web' | 'tools' | 'ai' | 'games';
  developer: string;
  rating: number;
  downloads: string;
  description: string;
  color: string;
}

const AppStore: React.FC<AppStoreProps> = ({ lang }) => {
  const t = translations[lang];
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [installingId, setInstallingId] = useState<string | null>(null);

  const apps: MarketApp[] = [
    { id: '1', name: 'NeuroFlow UI', icon: '🧠', category: 'tools', developer: 'StudioAI', rating: 4.9, downloads: '12K', description: 'Next-gen glassmorphic components generator.', color: 'from-indigo-600 to-purple-600' },
    { id: '2', name: 'Cinematic Gen v2', icon: '🎬', category: 'ai', developer: 'VideoLabs', rating: 4.8, downloads: '50K', description: 'High-fidelity video synthesis orchestration.', color: 'from-rose-600 to-pink-600' },
    { id: '3', name: 'CyberDash', icon: '⚡', category: 'web', developer: 'WebMaster', rating: 4.7, downloads: '5K', description: 'Performance optimized monitoring dashboard.', color: 'from-cyan-600 to-blue-600' },
    { id: '4', name: 'AI Storyteller', icon: '📖', category: 'ai', developer: 'GenNexus', rating: 4.9, downloads: '100K', description: 'Interactive long-form fiction generator.', color: 'from-amber-600 to-orange-600' },
    { id: '5', name: 'PixelQuest', icon: '🎮', category: 'games', developer: 'PlayAI', rating: 4.6, downloads: '25K', description: 'Retro RPG built entirely with AI assets.', color: 'from-emerald-600 to-teal-600' },
    { id: '6', name: 'VoiceSync Pro', icon: '🎙️', category: 'tools', developer: 'AudioFlow', rating: 4.8, downloads: '8K', description: 'Professional dubbing and voice cloning tool.', color: 'from-violet-600 to-purple-600' },
  ];

  const categories = [
    { id: 'all', label: t.allAssets },
    { id: 'web', label: t.categories.web },
    { id: 'tools', label: t.categories.tools },
    { id: 'ai', label: t.categories.ai },
    { id: 'games', label: t.categories.games },
  ];

  const handleInstall = (id: string) => {
    setInstallingId(id);
    setTimeout(() => {
      setInstallingId(null);
      alert(lang === 'ar' ? 'تمت إضافة التطبيق إلى مشروعك الحالي!' : 'App added to your current project!');
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05070a] overflow-hidden">
      {/* Marketplace Header */}
      <header className="p-10 border-b border-white/5 space-y-8 bg-gradient-to-b from-[#0a0c10] to-[#05070a]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="space-y-2">
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                <h2 className="text-4xl font-black text-white tracking-tighter">{t.storeTitle}</h2>
             </div>
             <p className="text-slate-500 font-medium text-lg opacity-80">{t.storeSub}</p>
           </div>
           
           <div className="relative w-full md:w-96 group">
              <input 
                placeholder={lang === 'ar' ? 'ابحث عن تطبيقات، قوالب، أدوات...' : 'Search apps, templates, tools...'}
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-14 py-4 text-xs text-white focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all"
              />
              <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
        </div>

        <nav className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
           {categories.map(cat => (
             <button 
               key={cat.id}
               onClick={() => setActiveCategory(cat.id)}
               className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat.id ? 'bg-cyan-600 border-cyan-500 text-white shadow-xl shadow-cyan-600/20' : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/10'}`}
             >
               {cat.label}
             </button>
           ))}
        </nav>
      </header>

      {/* Grid of Apps */}
      <div className="flex-1 overflow-y-auto p-10 custom-scroll">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {apps.filter(a => activeCategory === 'all' || a.category === activeCategory).map(app => (
             <div 
              key={app.id} 
              className="group bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 hover:bg-slate-800/50 hover:border-cyan-500/30 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden"
             >
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${app.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                
                <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-tr ${app.color} flex items-center justify-center text-5xl mb-6 shadow-2xl shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-500`}>
                   {app.icon}
                </div>

                <div className="space-y-2 mb-6">
                   <h4 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors">{app.name}</h4>
                   <div className="flex items-center justify-center gap-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{app.developer}</span>
                      <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                      <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                         <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                         {app.rating}
                      </span>
                   </div>
                </div>

                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 opacity-70 group-hover:opacity-100 transition-opacity">
                   {app.description}
                </p>

                <div className="mt-auto w-full flex flex-col gap-3">
                   <button 
                    onClick={() => handleInstall(app.id)}
                    disabled={installingId === app.id}
                    className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${installingId === app.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 border border-white/10 hover:bg-cyan-600 hover:text-white hover:border-cyan-500 shadow-lg hover:shadow-cyan-600/30'}`}
                   >
                      {installingId === app.id ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          {lang === 'ar' ? 'تثبيت...' : 'Installing...'}
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          {t.install}
                        </>
                      )}
                   </button>
                   <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{app.downloads} {lang === 'ar' ? 'تحميل' : 'Downloads'}</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default AppStore;
