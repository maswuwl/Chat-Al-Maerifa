
import React, { useState, useEffect } from 'react';
import { ProjectFile } from '../types';
import { translations } from '../translations';
import { monitorLogger, LogEntry } from '../monitoring/Logger';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  project: ProjectFile[];
  onFileSelect: (file: ProjectFile) => void;
  onToolSelect: (toolId: string) => void;
  activeTool: string;
  lang: 'en' | 'ar';
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, project, onFileSelect, onToolSelect, activeTool, lang }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  if (!isOpen) return null;
  const t = translations[lang];

  useEffect(() => {
    const unsubscribe = monitorLogger.subscribe((log) => {
      setLogs(prev => [log, ...prev].slice(0, 10));
    });
    return unsubscribe;
  }, []);

  const tools = [
    { id: 'chat', label: t.codeLab, icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', color: 'text-indigo-400' },
    { id: 'social', label: t.socialConnect, icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14', color: 'text-rose-500' },
    { id: 'appstore', label: t.appStore, icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'text-cyan-400' },
    { id: 'stock', label: t.stockMarket, icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4', color: 'text-emerald-400' },
    { id: 'idcard', label: t.idCards, icon: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14', color: 'text-amber-400' },
    { id: 'email', label: t.emailStudio, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7', color: 'text-blue-400' },
    { id: 'voice', label: t.voiceDub, icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z', color: 'text-emerald-400' },
    { id: 'assetlib', label: t.assetLib, icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14', color: 'text-pink-400' },
  ];

  return (
    <aside className="w-72 bg-[#0d1117] border-r border-white/5 flex flex-col shrink-0 z-50 animate-in slide-in-from-left duration-500">
      <div className="p-6 overflow-y-auto custom-scroll flex-1 space-y-8">
        {/* System Monitor Feed */}
        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl shadow-inner group cursor-crosshair">
           <div className="flex items-center justify-between mb-3">
              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em]">Platform Kernel</span>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
           </div>
           <div className="space-y-1.5">
              {logs.map((log, i) => (
                <div key={i} className="text-[7px] font-mono leading-none flex gap-2 animate-in fade-in duration-300">
                  <span className="text-slate-600">[{log.timestamp}]</span>
                  <span className={`${log.level === 'ERROR' ? 'text-rose-500' : log.level === 'SYSTEM' ? 'text-indigo-400' : 'text-slate-400'} truncate flex-1`}>{log.message}</span>
                </div>
              ))}
              {logs.length === 0 && <p className="text-[7px] text-slate-700 italic">System initialization...</p>}
           </div>
        </div>

        {/* Tools Navigator */}
        <nav className="space-y-1">
          <span className="text-[9px] font-black text-slate-600 uppercase px-4 mb-3 block tracking-widest">{t.tools}</span>
          {tools.map(tool => (
            <button 
              key={tool.id} 
              onClick={() => onToolSelect(tool.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${activeTool === tool.id ? 'bg-indigo-600/10 ring-1 ring-indigo-500/30 text-white shadow-2xl' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
            >
              <div className={`p-2 rounded-xl transition-all ${activeTool === tool.id ? 'bg-indigo-600 shadow-lg' : 'bg-white/5 group-hover:bg-white/10'}`}>
                <svg className={`w-4 h-4 ${activeTool === tool.id ? 'text-white' : tool.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tool.icon} /></svg>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider">{tool.label}</span>
            </button>
          ))}
        </nav>

        {/* Project Context Explorer */}
        <div className="pt-4 border-t border-white/5">
            <span className="text-[9px] font-black text-slate-600 uppercase px-4 mb-3 block tracking-widest">{t.explorer}</span>
            {project.length > 0 ? (
               <div className="space-y-1 px-1">
                  {project.map((file, idx) => (
                    <button key={idx} onClick={() => onFileSelect(file)} className="w-full flex items-center gap-3 px-3 py-2 text-[10px] text-slate-400 hover:bg-indigo-500/5 hover:text-indigo-300 rounded-xl truncate transition-all group">
                      <svg className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      <span className="font-mono">{file.path}</span>
                    </button>
                  ))}
               </div>
            ) : (
               <div className="px-4 py-8 bg-white/[0.01] rounded-3xl border border-dashed border-white/5 text-center">
                  <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">{t.noFiles}</p>
               </div>
            )}
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="p-6 border-t border-white/5 bg-black/40">
         <div className="flex items-center gap-3 p-3 bg-indigo-600/5 rounded-2xl border border-indigo-500/10 hover:bg-indigo-600/10 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-xl">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
               <p className="text-[10px] font-black text-white uppercase tracking-tight">Enterprise Pro</p>
               <p className="text-[8px] text-indigo-500 font-black uppercase">Build 10.5.2</p>
            </div>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;
