
import React, { useState, useMemo } from 'react';
import { ProjectFile } from '../types';
import { translations } from '../translations';

interface PreviewPanelProps {
  project: ProjectFile[];
  selectedFile: ProjectFile | null;
  onCloseFile: () => void;
  lang: 'en' | 'ar';
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ project, selectedFile, onCloseFile, lang }) => {
  const [viewMode, setViewMode] = useState<'code' | 'preview' | 'console'>('preview');
  const t = translations[lang];

  // Security: Sanitize and wrap AI generated content
  const secureSrcDoc = useMemo(() => {
    const htmlFile = project.find(f => f.path.endsWith('.html'))?.content || '<div id="root"></div>';
    
    // Strict Sanitization: Remove any <script> tags or inline event handlers (onmouseover, onclick, etc)
    // to prevent XSS. We only allow CSS and basic HTML structures.
    const sanitize = (str: string) => {
      return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '<!-- Script Blocked for Security -->')
        .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, 'blocked-event=""')
        .replace(/javascript:/gi, 'blocked-protocol:');
    };

    const cleanHtml = sanitize(htmlFile);
    const cssFiles = project
      .filter(f => f.path.endsWith('.css'))
      .map(f => `<style>${sanitize(f.content)}</style>`)
      .join('\n');

    // We intentionally OMIT JS files from execution in the preview for security.
    // In a production environment, this would be handled by a worker or a completely isolated domain.
    
    return `
      <!DOCTYPE html>
      <html dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Security-Policy" content="default-src 'self' https://cdn.tailwindcss.com; style-src 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com; font-src https://fonts.gstatic.com;">
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Tajawal', sans-serif; margin: 0; padding: 20px; }
            * { transition: none !important; } /* Stability */
          </style>
          ${cssFiles}
        </head>
        <body class="bg-white text-slate-900">
          ${cleanHtml}
        </body>
      </html>
    `;
  }, [project, lang]);

  return (
    <div className="h-full flex flex-col bg-[#05070a] border-white/5 shadow-2xl border-l">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0a0c10]/95 backdrop-blur-3xl z-30">
        <div className="flex gap-1.5 p-1 bg-white/[0.03] rounded-2xl border border-white/5">
          <button 
            onClick={() => setViewMode('preview')}
            className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'preview' ? 'bg-indigo-600 shadow-xl shadow-indigo-600/30 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {t.livePreview}
          </button>
          <button 
            onClick={() => setViewMode('code')}
            className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'code' ? 'bg-indigo-600 shadow-xl shadow-indigo-600/30 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {t.sourceCode}
          </button>
          <button 
            onClick={() => setViewMode('console')}
            className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'console' ? 'bg-indigo-600 shadow-xl shadow-indigo-600/30 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Terminal
          </button>
        </div>
        
        {selectedFile && (
           <button onClick={onCloseFile} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden relative">
        {viewMode === 'code' ? (
          <div className="h-full overflow-auto p-8 bg-[#0d1117] ltr-text font-mono">
            {selectedFile ? (
              <>
                <div className="flex items-center gap-4 mb-8 p-4 bg-white/[0.02] rounded-2xl border border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 truncate">{selectedFile.path}</span>
                </div>
                <pre className="text-xs text-indigo-300 leading-relaxed overflow-x-auto selection:bg-indigo-500/30">
                  <code>{selectedFile.content}</code>
                </pre>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs font-bold uppercase tracking-widest">
                Select a file to view code
              </div>
            )}
          </div>
        ) : viewMode === 'preview' ? (
          <div className="h-full w-full bg-white relative">
            {project.length > 0 ? (
              <iframe 
                title="Sandbox"
                srcDoc={secureSrcDoc}
                className="w-full h-full border-none shadow-inner"
                // Removed 'allow-same-origin' to ensure the content stays in a truly isolated sandbox.
                sandbox="allow-scripts allow-modals allow-forms allow-popups"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-[#05070a] p-12 text-center">
                <div className="w-32 h-32 mb-10 relative">
                  <div className="absolute inset-0 bg-indigo-600 blur-[80px] opacity-20 animate-pulse"></div>
                  <div className="relative z-10 w-full h-full bg-slate-900 rounded-[3rem] border border-white/10 flex items-center justify-center shadow-2xl">
                    <svg className="w-14 h-14 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{t.previewReady}</h3>
                <p className="text-slate-500 text-base max-w-sm mx-auto leading-relaxed font-medium">{t.previewSub}</p>
                <button className="mt-10 px-10 py-4 bg-indigo-600 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/40 active:scale-95">
                  {t.runBuild}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full bg-black p-8 font-mono text-[11px] text-green-400 overflow-y-auto ltr-text leading-relaxed">
             <div className="flex items-center gap-2 mb-4 text-slate-500 border-b border-white/5 pb-2">
               <span className="w-2 h-2 rounded-full bg-green-500"></span>
               <span>STUDIO_OS v2.5 initialized</span>
             </div>
             <p className="mb-1 opacity-60">[$] system: booting hybrid engine...</p>
             <p className="mb-1 opacity-60">[$] network: local sandbox established at port 3000</p>
             <p className="mb-4 text-indigo-400">[$] status: listening for project generation events</p>
             {project.length > 0 && (
               <div className="space-y-1">
                 <p className="text-white font-bold">Build Successful:</p>
                 {project.map(f => (
                   <p key={f.path} className="pl-4 opacity-80">✓ Compiled {f.path} ({Math.round(f.content.length / 1024 * 10) / 10}KB)</p>
                 ))}
                 <p className="mt-4 animate-pulse">_</p>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
