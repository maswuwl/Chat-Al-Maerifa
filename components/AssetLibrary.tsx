
import React, { useState } from 'react';
import { translations } from '../translations';

interface AssetLibraryProps {
  lang: 'en' | 'ar';
}

const AssetLibrary: React.FC<AssetLibraryProps> = ({ lang }) => {
  const t = translations[lang];
  const [activeCat, setActiveCat] = useState('all');

  const assets = [
    { id: '1', type: 'icon', url: 'https://cdn-icons-png.flaticon.com/512/3064/3064197.png', name: 'AI Core' },
    { id: '2', type: 'bg', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', name: 'Abstract Blue' },
    { id: '3', type: 'ui', url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400', name: 'Dark Panel' },
    { id: '4', type: 'icon', url: 'https://cdn-icons-png.flaticon.com/512/4359/4359961.png', name: 'Vision' },
    { id: '5', type: 'bg', url: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=400', name: 'Mesh Gradient' },
    { id: '6', type: 'ui', url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400', name: 'Glass Card' },
  ];

  const categories = [
    { id: 'all', label: t.allAssets },
    { id: 'icon', label: t.icons },
    { id: 'bg', label: t.backgrounds },
    { id: 'ui', label: t.uiElements },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05070a] overflow-hidden">
      <header className="p-8 border-b border-white/5 space-y-6">
        <div className="flex justify-between items-center">
           <div className="space-y-1">
             <h2 className="text-3xl font-black text-white">{t.assetTitle}</h2>
             <p className="text-slate-500 font-medium text-sm">{t.assetSub}</p>
           </div>
           <div className="relative w-80">
              <input 
                placeholder={t.searchAssets}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-3 text-xs text-white focus:outline-none focus:border-pink-500/50"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
        </div>

        <div className="flex gap-3">
           {categories.map(cat => (
             <button 
               key={cat.id}
               onClick={() => setActiveCat(cat.id)}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCat === cat.id ? 'bg-pink-600 text-white shadow-xl shadow-pink-600/20' : 'bg-white/5 text-slate-500 hover:text-slate-300'}`}
             >
               {cat.label}
             </button>
           ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scroll">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
           {assets.filter(a => activeCat === 'all' || a.type === activeCat).map(asset => (
             <div key={asset.id} className="group relative aspect-square bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden p-4 flex flex-col items-center justify-center hover:border-pink-500/50 transition-all cursor-pointer">
                <img src={asset.url} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                   <button className="px-4 py-2 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest">Add to Project</button>
                </div>
                <div className="absolute top-4 left-4">
                   <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">{asset.name}</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default AssetLibrary;
