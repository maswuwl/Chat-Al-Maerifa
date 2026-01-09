
import React, { useState } from 'react';
import { ChatMessage, MessageRole, ContentType, UserProfile } from '../types';
import { translations } from '../translations';
import VerificationBadge from './VerificationBadge';

interface ChatBubbleProps {
  message: ChatMessage;
  lang: 'en' | 'ar';
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, lang }) => {
  const isAI = message.role === MessageRole.AI;
  const t = translations[lang];
  const [isCopied, setIsCopied] = useState(false);
  
  // Mock User for Displaying Badge in Chat
  const senderProfile: UserProfile = {
    id: '1',
    name: isAI ? 'Studio AI Core' : 'Khalid Al-Muntasir',
    avatar: '',
    level: 100,
    diamonds: 0,
    email: '',
    job: '',
    role: isAI ? 'admin' : 'admin', // AI is admin, user is admin for testing
    joinDate: '2023-01-01',
    isPremium: true
  };

  const escapeHtml = (unsafe: string) => {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  return (
    <div className={`flex w-full group ${isAI ? 'justify-start' : 'justify-end'} mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500`}>
      <div className={`max-w-[90%] flex flex-col gap-3 ${isAI ? 'items-start' : 'items-end'}`}>
        <div className="flex items-center gap-2 px-2">
          <div className={`w-2 h-2 rounded-full ${isAI ? 'bg-indigo-500 animate-pulse' : 'bg-slate-600'}`}></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
            {isAI ? (lang === 'ar' ? 'نواة الاستوديو' : 'Studio AI') : senderProfile.name}
            <VerificationBadge user={senderProfile} size="sm" />
          </span>
        </div>
        
        <div className={`relative p-6 rounded-3xl shadow-2xl transition-all border ${
          isAI ? 'bg-slate-900/60 border-slate-800 text-slate-200 backdrop-blur-xl' 
               : 'bg-indigo-600 border-indigo-500 text-white'
        }`}>
          <div className="prose prose-invert prose-sm max-w-none">
            {message.content.split('\n').map((line, idx) => (
              <p key={idx} className="mb-3 leading-relaxed last:mb-0" dangerouslySetInnerHTML={{ __html: escapeHtml(line) }} />
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className={`absolute -bottom-10 flex gap-2 transition-all duration-300 opacity-0 group-hover:opacity-100 ${isAI ? 'left-0' : 'right-0'}`}>
             <button onClick={() => navigator.clipboard.writeText(message.content)} className="h-8 px-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-2 text-[9px] font-bold uppercase">
               {isCopied ? t.copied : t.copy}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
