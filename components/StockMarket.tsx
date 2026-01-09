
import React, { useState, useEffect, useMemo } from 'react';
import { translations } from '../translations';
import { UserProfile } from '../types';

interface StockMarketProps {
  lang: 'en' | 'ar';
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
}

const StockMarket: React.FC<StockMarketProps> = ({ lang, user, onUpdateUser }) => {
  const t = translations[lang];
  const [price, setPrice] = useState(145.20);
  const [prevPrice, setPrevPrice] = useState(145.20);
  const [history, setHistory] = useState<number[]>([140, 142, 138, 145, 143, 148, 145, 142, 146, 145.20]);
  const [sharesOwned, setSharesOwned] = useState(0);
  const [transactions, setTransactions] = useState<{ id: string; type: 'buy' | 'sell'; amount: number; price: number; date: string }[]>([]);
  const [orderAmount, setOrderAmount] = useState<number>(1);

  // Simulate Live Price Action
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevPrice(price);
      const change = (Math.random() - 0.48) * 2; // Slight upward bias
      const newPrice = Math.max(10, price + change);
      setPrice(newPrice);
      setHistory(prev => [...prev.slice(-29), newPrice]);
    }, 3000);
    return () => clearInterval(interval);
  }, [price]);

  const marketTrend = price >= prevPrice ? 'up' : 'down';

  const handleBuy = () => {
    const totalCost = orderAmount * price;
    if (user.diamonds < totalCost) {
      alert(lang === 'ar' ? 'رصيد الملسات غير كافٍ!' : 'Insufficient diamonds!');
      return;
    }
    onUpdateUser({ ...user, diamonds: user.diamonds - totalCost });
    setSharesOwned(prev => prev + orderAmount);
    setTransactions(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      type: 'buy',
      amount: orderAmount,
      price: price,
      date: new Date().toLocaleTimeString()
    }, ...prev].slice(0, 10));
  };

  const handleSell = () => {
    if (sharesOwned < orderAmount) {
      alert(lang === 'ar' ? 'لا تملك أسهم كافية!' : 'Not enough shares!');
      return;
    }
    const gain = orderAmount * price;
    onUpdateUser({ ...user, diamonds: user.diamonds + gain });
    setSharesOwned(prev => prev - orderAmount);
    setTransactions(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      type: 'sell',
      amount: orderAmount,
      price: price,
      date: new Date().toLocaleTimeString()
    }, ...prev].slice(0, 10));
  };

  // SVG Chart Generation
  const chartPoints = useMemo(() => {
    const max = Math.max(...history) + 5;
    const min = Math.min(...history) - 5;
    const range = max - min;
    const width = 800;
    const height = 300;
    return history.map((val, i) => ({
      x: (i / (history.length - 1)) * width,
      y: height - ((val - min) / range) * height
    }));
  }, [history]);

  const pathD = `M ${chartPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05070a] overflow-hidden">
      {/* Exchange Header */}
      <header className="p-8 border-b border-white/5 bg-[#0a0c10]/50 backdrop-blur-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-6">
           <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
           </div>
           <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">{t.stockMarket}</h2>
              <div className="flex items-center gap-2">
                 <span className={`text-xl font-mono font-black ${marketTrend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                   ${price.toFixed(2)}
                 </span>
                 <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${marketTrend === 'up' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                   {marketTrend === 'up' ? '▲' : '▼'} {((price - prevPrice) / prevPrice * 100).toFixed(2)}%
                 </span>
              </div>
           </div>
        </div>

        <div className="flex gap-8">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.exchange.marketCap}</p>
              <p className="text-sm font-black text-white">$4.2B</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.exchange.volume}</p>
              <p className="text-sm font-black text-white">1.2M STX</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.diamonds}</p>
              <p className="text-sm font-black text-amber-500">💎 {user.diamonds.toLocaleString()}</p>
           </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chart Area */}
        <main className="flex-1 flex flex-col p-8 overflow-y-auto custom-scroll">
           <div className="bg-[#0d1117] border border-white/5 rounded-[2.5rem] p-10 mb-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              </div>
              
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">{t.exchange.chartTitle}</h3>
                 <div className="flex gap-2">
                    {['1M', '5M', '15M', '1H', '1D'].map(tf => (
                      <button key={tf} className={`px-3 py-1 rounded-lg text-[10px] font-bold ${tf === '5M' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-white/5'}`}>{tf}</button>
                    ))}
                 </div>
              </div>

              <div className="relative h-[300px] w-full">
                 <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                       <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={marketTrend === 'up' ? '#10b981' : '#f43f5e'} stopOpacity="0.3" />
                          <stop offset="100%" stopColor={marketTrend === 'up' ? '#10b981' : '#f43f5e'} stopOpacity="0" />
                       </linearGradient>
                    </defs>
                    <path d={`${pathD} V 300 H 0 Z`} fill="url(#chartGradient)" />
                    <path d={pathD} fill="none" stroke={marketTrend === 'up' ? '#10b981' : '#f43f5e'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300" />
                    
                    {/* Pulsing end point */}
                    <circle cx={chartPoints[chartPoints.length - 1].x} cy={chartPoints[chartPoints.length - 1].y} r="5" fill={marketTrend === 'up' ? '#10b981' : '#f43f5e'} className="animate-pulse" />
                 </svg>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Portfolio Card */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                 <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">{t.exchange.portfolio}</h3>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                       <p className="text-[9px] font-black text-slate-500 uppercase mb-1">{t.exchange.sharesOwned}</p>
                       <p className="text-xl font-black text-white">{sharesOwned} STX</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                       <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Portfolio Value</p>
                       <p className="text-xl font-black text-emerald-400">${(sharesOwned * price).toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 col-span-2">
                       <div className="flex justify-between items-center">
                          <div>
                             <p className="text-[9px] font-black text-slate-500 uppercase mb-1">{t.exchange.dividends}</p>
                             <p className="text-lg font-black text-amber-500">${(sharesOwned * 0.45).toFixed(2)} / Monthly</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Yield</p>
                             <p className="text-lg font-black text-white">4.2%</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Transaction History */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 flex flex-col">
                 <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">{t.exchange.history}</h3>
                 <div className="flex-1 space-y-3">
                    {transactions.length === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-[10px]">No trades yet</div>
                    ) : (
                       transactions.map(tx => (
                          <div key={tx.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                             <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black uppercase ${tx.type === 'buy' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                                   {tx.type === 'buy' ? 'B' : 'S'}
                                </div>
                                <div>
                                   <p className="text-[11px] font-black text-white">{tx.amount} STX</p>
                                   <p className="text-[9px] font-medium text-slate-500">{tx.date}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[11px] font-black text-white">${(tx.amount * tx.price).toFixed(2)}</p>
                                <p className="text-[9px] font-bold text-slate-500">@ ${tx.price.toFixed(2)}</p>
                             </div>
                          </div>
                       ))
                    )}
                 </div>
              </div>
           </div>
        </main>

        {/* Trade Panel */}
        <aside className="w-80 bg-[#0a0c10] border-l border-white/5 p-8 flex flex-col gap-8 shadow-2xl z-10">
           <div className="space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Execution Panel</h3>
              
              <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                 <button className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/30">Market Order</button>
                 <button className="flex-1 py-3 text-slate-500 text-[10px] font-black uppercase tracking-widest opacity-50">Limit Order</button>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount (STX)</label>
                 <div className="relative">
                    <input 
                       type="number" 
                       value={orderAmount}
                       onChange={(e) => setOrderAmount(Math.max(1, parseInt(e.target.value) || 0))}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-emerald-500/50"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                       <button onClick={() => setOrderAmount(prev => Math.max(1, prev - 1))} className="p-1 hover:bg-white/10 rounded text-slate-400">-</button>
                       <button onClick={() => setOrderAmount(prev => prev + 1)} className="p-1 hover:bg-white/10 rounded text-slate-400">+</button>
                    </div>
                 </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                 <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500 font-bold uppercase">Estimated Cost:</span>
                    <span className="text-white font-mono font-black">${(orderAmount * price).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500 font-bold uppercase">Diamonds Req:</span>
                    <span className="text-amber-500 font-black">💎 {(orderAmount * price).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                 <button onClick={handleBuy} className="py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-emerald-600/30 transition-all active:scale-95">
                    {t.exchange.buy}
                 </button>
                 <button onClick={handleSell} className="py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-rose-600/30 transition-all active:scale-95">
                    {t.exchange.sell}
                 </button>
              </div>
           </div>

           <div className="mt-auto space-y-4">
              <div className="flex items-center justify-between px-2">
                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Order Book</span>
                 <span className="text-[8px] text-emerald-500 animate-pulse">● LIVE</span>
              </div>
              <div className="space-y-1 font-mono text-[9px]">
                 {[...Array(5)].map((_, i) => (
                   <div key={i} className="flex justify-between items-center opacity-60">
                      <span className="text-emerald-500">{(price + (i+1)*0.05).toFixed(2)}</span>
                      <span className="text-slate-400">{(Math.random()*100).toFixed(1)}</span>
                   </div>
                 ))}
                 <div className="py-2 border-y border-white/5 text-center text-white font-black text-xs">
                    {price.toFixed(2)}
                 </div>
                 {[...Array(5)].map((_, i) => (
                   <div key={i} className="flex justify-between items-center opacity-60">
                      <span className="text-rose-500">{(price - (i+1)*0.05).toFixed(2)}</span>
                      <span className="text-slate-400">{(Math.random()*100).toFixed(1)}</span>
                   </div>
                 ))}
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default StockMarket;
