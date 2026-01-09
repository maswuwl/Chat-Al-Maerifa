
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import PreviewPanel from './components/PreviewPanel';
import IDCardCreator from './components/IDCardCreator';
import SocialStudio from './components/SocialStudio';
import VoiceStudio from './components/VoiceStudio';
import AssetLibrary from './components/AssetLibrary';
import AppStore from './components/AppStore';
import EmailStudio from './components/EmailStudio';
import StockMarket from './components/StockMarket';
import AuthModal from './components/AuthModal';
import { ChatMessage, MessageRole, ContentType, ProjectFile, UserProfile } from './types';
import { generateStudioResponse } from './services/geminiService';
import { translations } from './translations';
import { safeJsonParse } from './utils';
import { monitorLogger } from './monitoring/Logger';

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ar'>('ar');
  const t = translations[lang];
  
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('studio_user');
    return safeJsonParse<UserProfile>(saved, {
      id: 'GUEST-' + Math.floor(Math.random() * 1000),
      name: 'Guest User',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      level: 1,
      diamonds: 500, 
      email: '',
      job: 'Explorer',
      role: 'user',
      joinDate: new Date().toISOString(),
      isPremium: false
    });
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectFile[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTool, setActiveTool] = useState<string>('chat');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('studio_user', JSON.stringify(user));
  }, [lang, user]);

  // Logic to trigger Auth if trying to use certain tools as guest
  useEffect(() => {
    if ((activeTool === 'stock' || activeTool === 'social') && user.name === 'Guest User') {
      setIsAuthOpen(true);
    }
  }, [activeTool, user]);

  const handleLogin = (provider: string) => {
    monitorLogger.log('SYSTEM', `Auth: Attempting login via ${provider}`);
    // Simulate Firebase Auth success
    setUser({
      ...user,
      id: 'USR-REAL-' + Math.floor(Math.random() * 1000),
      name: 'Khalid Al-Muntasir', // In real app, this comes from provider
      role: 'admin',
      isPremium: true,
      diamonds: 1000000
    });
    setIsAuthOpen(false);
    monitorLogger.log('INFO', 'Auth: Handshake successful. Identity verified.');
  };

  const parseProjectFiles = useCallback((text: string): ProjectFile[] => {
    const files: ProjectFile[] = [];
    const regex = /\/([a-zA-Z0-9._\-/]+)\n```(?:\w+)?\n([\s\S]*?)```/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      files.push({ 
        path: match[1], 
        content: match[2], 
        language: match[1].split('.').pop() || 'html' 
      });
    }
    return files;
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), role: MessageRole.USER, content: text, type: ContentType.TEXT }]);
    setIsGenerating(true);

    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMsgId, role: MessageRole.AI, content: '', type: ContentType.TEXT, isStreaming: true }]);

    try {
      const fullContent = await generateStudioResponse(text, (chunk) => {
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: chunk } : m));
      });

      const query = text.toLowerCase();
      const routes: Record<string, string[]> = {
        idcard: ['بطاقة', 'هوية', 'id', 'card', 'identity'],
        stock: ['بورصة', 'سهم', 'stock', 'market', 'بورصه'],
        social: ['بث', 'لايف', 'live', 'social', 'تواصل', 'هدية', 'diamonds'],
        appstore: ['متجر', 'تطبيق', 'store', 'app', 'تحميل'],
        email: ['بريد', 'إيميل', 'email', 'رسالة'],
        voice: ['صوت', 'دبلجة', 'voice', 'dub'],
        assetlib: ['أصول', 'مكتبة', 'assets', 'icon', 'أيقونة']
      };

      let detectedTool = 'chat';
      for (const [tool, keywords] of Object.entries(routes)) {
        if (keywords.some(k => query.includes(k))) {
          detectedTool = tool;
          break;
        }
      }
      
      if (detectedTool !== 'chat') setActiveTool(detectedTool);

      const extractedFiles = parseProjectFiles(fullContent);
      const isProject = extractedFiles.length > 0;

      setMessages(prev => prev.map(m => 
        m.id === aiMsgId ? { 
          ...m, 
          type: isProject ? ContentType.PROJECT : ContentType.TEXT,
          isStreaming: false,
          metadata: { files: isProject ? extractedFiles : undefined }
        } : m
      ));

      if (isProject) {
        monitorLogger.log('SYSTEM', `Core Engine: Deployed ${extractedFiles.length} files successfully.`);
        setCurrentProject(extractedFiles);
        setSelectedFile(extractedFiles[0]);
      }
    } catch (error) {
      monitorLogger.log('ERROR', 'Studio Kernel Link Failure. Retrying sync...');
      setIsGenerating(false);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`flex h-screen w-full bg-[#05070a] text-slate-100 overflow-hidden font-sans select-none ${lang === 'ar' ? 'font-tajawal' : ''}`}>
      <AuthModal 
        lang={lang} 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={handleLogin} 
      />
      
      <Sidebar 
        isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}
        project={currentProject} onFileSelect={setSelectedFile}
        onToolSelect={setActiveTool} activeTool={activeTool} lang={lang}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 border-b border-white/5 flex items-center px-6 bg-[#0a0c10]/80 backdrop-blur-3xl z-40">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 hover:bg-white/5 rounded-xl transition-all active:scale-90">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </button>
          
          <div className="flex-1 px-6 flex items-center gap-4">
             <div className="flex flex-col">
                <h1 className="text-[11px] font-black uppercase tracking-[0.3em] bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400 bg-clip-text text-transparent">{t.studioTitle}</h1>
                <div className="flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none">{activeTool} engine initialized</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4">
            {user.name === 'Guest User' ? (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="px-5 py-2 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
              >
                {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-1.5 rounded-2xl border border-amber-500/20 shadow-lg shadow-amber-500/5 transition-all hover:scale-105 group">
                <span className="text-[11px] font-black text-amber-500 tabular-nums group-hover:animate-bounce">💎 {user.diamonds.toLocaleString()}</span>
              </div>
            )}
            
            <div className="h-8 w-px bg-white/5 mx-2"></div>
            
            <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-[10px] font-black hover:bg-white/10 transition-all hover:border-indigo-500/50">
               {lang === 'en' ? 'AR' : 'EN'}
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {activeTool === 'chat' ? (
            <>
              <div className="flex-1 flex flex-col relative border-r border-white/5">
                <ChatWindow messages={messages} onSend={handleSendMessage} isGenerating={isGenerating} lang={lang} />
              </div>
              <div className="hidden xl:block w-[550px] shadow-2xl bg-[#05070a] animate-in slide-in-from-right duration-500">
                <PreviewPanel project={currentProject} selectedFile={selectedFile} onCloseFile={() => setSelectedFile(null)} lang={lang} />
              </div>
            </>
          ) : activeTool === 'idcard' ? (
            <IDCardCreator lang={lang} user={user} />
          ) : activeTool === 'social' ? (
            <SocialStudio lang={lang} user={user} onUpdateUser={setUser} onSwitchTool={setActiveTool} />
          ) : activeTool === 'stock' ? (
            <StockMarket lang={lang} user={user} onUpdateUser={setUser} />
          ) : activeTool === 'email' ? (
            <EmailStudio lang={lang} user={user} />
          ) : activeTool === 'voice' ? (
            <VoiceStudio lang={lang} />
          ) : activeTool === 'assetlib' ? (
            <AssetLibrary lang={lang} />
          ) : activeTool === 'appstore' ? (
            <AppStore lang={lang} />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#05070a]">
               <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Switching Kernel...</p>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
