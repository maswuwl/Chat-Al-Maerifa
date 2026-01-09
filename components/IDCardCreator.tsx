
import React, { useState, useRef } from 'react';
import { translations } from '../translations';
import { UserProfile } from '../types';

interface IDCardCreatorProps {
  lang: 'en' | 'ar';
  user: UserProfile;
}

type CardType = 'student' | 'teacher' | 'doctor' | 'admin' | 'association' | 'restaurant' | 'vip' | 'security';

const IDCardCreator: React.FC<IDCardCreatorProps> = ({ lang, user }) => {
  const t = translations[lang];
  const [step, setStep] = useState<'register' | 'preview'>('register');
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardType, setCardType] = useState<CardType>('student');

  const cardConfig = {
    student: { label: lang === 'ar' ? 'بطاقة طالب' : 'Student Card', color: 'bg-indigo-600', textColor: 'text-indigo-600', code: 'STU', icon: '🎓', extraLabel: lang === 'ar' ? 'القسم الدراسي' : 'Academic Dept' },
    teacher: { label: lang === 'ar' ? 'بطاقة هيئة تدريس' : 'Faculty Card', color: 'bg-blue-700', textColor: 'text-blue-700', code: 'TCH', icon: '📚', extraLabel: lang === 'ar' ? 'المادة العلمية' : 'Subject' },
    doctor: { label: lang === 'ar' ? 'بطاقة كادر طبي' : 'Medical Staff', color: 'bg-cyan-600', textColor: 'text-cyan-600', code: 'DOC', icon: '🩺', extraLabel: lang === 'ar' ? 'التخصص الطبي' : 'Specialization' },
    admin: { label: lang === 'ar' ? 'بطاقة مدير إداري' : 'Manager ID', color: 'bg-slate-800', textColor: 'text-slate-800', code: 'MNG', icon: '💼', extraLabel: lang === 'ar' ? 'الإدارة' : 'Management' },
    association: { label: lang === 'ar' ? 'بطاقة عضوية جمعية' : 'Association Member', color: 'bg-emerald-600', textColor: 'text-emerald-600', code: 'ASC', icon: '🤝', extraLabel: lang === 'ar' ? 'نوع العضوية' : 'Membership' },
    restaurant: { label: lang === 'ar' ? 'بطاقة طاقم الضيافة' : 'Hospitality Staff', color: 'bg-orange-600', textColor: 'text-orange-600', code: 'RST', icon: '🍽️', extraLabel: lang === 'ar' ? 'المنصب' : 'Position' },
    security: { label: lang === 'ar' ? 'بطاقة أمن' : 'Security Clearance', color: 'bg-red-700', textColor: 'text-red-700', code: 'SEC', icon: '🛡️', extraLabel: lang === 'ar' ? 'نطاق التصريح' : 'Access Level' },
    vip: { label: lang === 'ar' ? 'بطاقة عضوية VIP' : 'VIP Member', color: 'bg-amber-600', textColor: 'text-amber-600', code: 'VIP', icon: '💎', extraLabel: lang === 'ar' ? 'المستوى' : 'VIP Tier' },
  };

  const generateUniqueID = (type: CardType) => {
    const prefix = cardConfig[type].code;
    const timestamp = Date.now().toString().slice(-6);
    const rand = Math.floor(Math.random() * 900 + 100);
    return `${prefix}-${timestamp}${rand}`;
  };

  const [formData, setFormData] = useState({
    idNumber: generateUniqueID('student'),
    birthDay: '01',
    birthMonth: '01',
    birthYear: '2000',
    bloodType: 'O+',
    gender: lang === 'ar' ? 'ذكر' : 'Male',
    city: lang === 'ar' ? 'الرياض' : 'Riyadh',
    extraField: '', 
    idPhoto: user.avatar,
    logoPhoto: '', 
    stampPhoto: '',
    issueDate: new Date().toLocaleDateString(),
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toLocaleDateString()
  });

  const photoRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const stampRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, [field]: url }));
    }
  };

  const fullBirthDate = `${formData.birthDay}/${formData.birthMonth}/${formData.birthYear}`;

  if (step === 'preview') {
    const theme = cardConfig[cardType];
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#020408] overflow-hidden">
        <div className="mb-12 flex flex-wrap justify-center gap-4 z-50 no-print">
           <button onClick={() => setStep('register')} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-slate-300">
             {lang === 'ar' ? 'رجوع للتعديل' : 'Back to Edit'}
           </button>
           <button onClick={() => setIsFlipped(!isFlipped)} className={`px-8 py-3 ${theme.color} rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl transition-all text-white flex items-center gap-2 hover:brightness-110`}>
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             {t.rotateCard}
           </button>
           <button onClick={() => window.print()} className="px-8 py-3 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
             {lang === 'ar' ? 'طباعة البطاقة' : 'Print ID Card'}
           </button>
        </div>

        <div className="perspective-1000">
          <div className={`relative w-[540px] h-[340px] preserve-3d id-card-inner shadow-[0_50px_100px_rgba(0,0,0,0.6)] rounded-[1.5rem] ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-[1.5rem] overflow-hidden border border-slate-300 flex flex-col shadow-inner">
               <div className={`absolute inset-0 opacity-[0.04] pointer-events-none ${theme.color}`} style={{backgroundImage: `url('https://www.transparenttextures.com/patterns/hexellence.png')`}}></div>
               
               <div className={`h-24 ${theme.color} px-8 flex items-center justify-between text-white relative`}>
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-lg border border-white/20 p-1.5">
                        {formData.logoPhoto ? (
                           <img src={formData.logoPhoto} className="w-full h-full object-contain" />
                        ) : (
                           <span className="text-3xl">{theme.icon}</span>
                        )}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[14px] font-black tracking-tight uppercase leading-none mb-1">{theme.label}</span>
                        <span className="text-[9px] font-bold opacity-70 uppercase tracking-[0.2em]">{lang === 'ar' ? 'نظام الإصدار الذكي' : 'SMART ISSUANCE'}</span>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-[22px] font-black block tracking-tighter">{theme.code}</span>
                     <span className="text-[8px] font-mono opacity-60">ID: {formData.idNumber.split('-')[1]}</span>
                  </div>
               </div>

               <div className="flex-1 flex px-8 py-6 gap-8 relative z-10">
                  <div className="w-32 h-40 bg-slate-100 rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm relative shrink-0">
                     <img src={formData.idPhoto} className="w-full h-full object-cover grayscale-[0.1]" />
                     <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${theme.color}`}></div>
                  </div>

                  <div className="flex-1 flex flex-col gap-4 text-slate-800 min-w-0">
                     <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.cardName}</span>
                        <p className="text-[19px] font-black leading-tight text-slate-900 truncate">{user.name}</p>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-0.5">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.cardJob}</span>
                           <p className={`text-[12px] font-bold truncate ${theme.textColor}`}>{user.job}</p>
                        </div>
                        <div className="space-y-0.5">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{theme.extraLabel}</span>
                           <p className="text-[12px] font-bold text-slate-700 truncate">{formData.extraField || 'N/A'}</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 mt-auto">
                        <div className="space-y-0.5">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{lang === 'ar' ? 'رقم السجل' : 'Serial NO'}</span>
                           <p className="text-[14px] font-mono font-black tracking-tighter text-slate-900">{formData.idNumber}</p>
                        </div>
                        <div className="space-y-0.5">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.cardCity}</span>
                           <p className="text-[12px] font-black">{formData.city}</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="h-14 border-t border-slate-100 px-8 flex items-center justify-between bg-slate-50/60 relative">
                  <div className="flex items-center gap-3">
                     <div className={`w-10 h-10 rounded-full ${theme.color} opacity-10 flex items-center justify-center`}>
                        <svg className={`w-6 h-6 ${theme.textColor}`} fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.523 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                     </div>
                     <span className="text-[8px] font-black text-slate-400 tracking-[0.2em] uppercase">Security Verified</span>
                  </div>
                  <div className="w-32 h-8 border-b border-slate-300 flex items-end justify-center relative">
                     {formData.stampPhoto && (
                        <img src={formData.stampPhoto} className="absolute -top-16 -right-4 w-28 h-28 object-contain opacity-70 rotate-[-12deg] pointer-events-none mix-blend-multiply" />
                     )}
                     <span className="text-[8px] italic text-slate-300 mb-1">{lang === 'ar' ? 'توقيع رسمي' : 'Official Sign'}</span>
                  </div>
               </div>
            </div>

            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#f9fafb] rounded-[1.5rem] overflow-hidden border border-slate-300 flex flex-col p-8">
               <div className={`absolute top-10 left-0 right-0 h-14 ${theme.color} opacity-90`}></div>
               
               <div className="mt-20 flex-1 flex flex-col gap-6">
                  <div className="grid grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
                     <div className="space-y-1">
                        <span className="text-[8px] font-black text-slate-400 uppercase">{lang === 'ar' ? 'تاريخ الميلاد' : 'Birth Date'}</span>
                        <p className="text-[11px] font-bold text-slate-700">{fullBirthDate}</p>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[8px] font-black text-slate-400 uppercase">{t.cardGender}</span>
                        <p className="text-[11px] font-bold text-slate-700">{formData.gender}</p>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[8px] font-black text-slate-400 uppercase">{t.cardBlood}</span>
                        <p className="text-[11px] font-bold text-rose-600">{formData.bloodType}</p>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[8px] font-black text-slate-400 uppercase">{t.cardIssue}</span>
                        <p className="text-[11px] font-bold text-slate-700">{formData.issueDate}</p>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[8px] font-black text-slate-400 uppercase">{t.cardExpiry}</span>
                        <p className={`text-[11px] font-bold ${theme.textColor}`}>{formData.expiryDate}</p>
                     </div>
                  </div>

                  <div className="flex justify-between items-end gap-6">
                     <div className="flex-1 space-y-4">
                        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                           <p className="text-[8px] text-slate-500 leading-relaxed font-medium">
                              {t.cardLegal} {lang === 'ar' ? 'يمنع استخدام هذه البطاقة من غير صاحبها تحت طائلة المسؤولية.' : 'Unauthorized use of this card is strictly prohibited.'}
                           </p>
                        </div>
                        <div className="h-8 w-full flex gap-[1.5px] items-end px-2">
                           {Array(75).fill(0).map((_, i) => (
                              <div key={i} className={`h-${Math.floor(Math.random() * 6 + 2)} w-[1px] bg-slate-900 opacity-80`}></div>
                           ))}
                        </div>
                     </div>
                     <div className="w-24 h-24 bg-white p-2 border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center">
                        <div className="w-full h-full bg-slate-50 grid grid-cols-8 gap-0.5 p-0.5">
                           {Array(64).fill(0).map((_, i) => (
                              <div key={i} className={`rounded-[1px] ${Math.random() > 0.4 ? 'bg-slate-900' : 'bg-transparent'}`}></div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center opacity-30">
                  <span className="text-[8px] font-mono font-bold tracking-[0.2em] text-slate-500 uppercase">
                    {`ID<CORE<${theme.code}<<${user.name.split(' ')[0].toUpperCase()}<<${formData.idNumber.replace('-','')}<<${formData.birthYear}`}
                  </span>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-6 bg-[#05070a] overflow-y-auto custom-scroll">
       <div className="w-full max-w-4xl bg-slate-900 border border-white/5 rounded-[3.5rem] p-12 shadow-2xl space-y-12 my-10 animate-in slide-in-from-bottom-8 duration-700">
          <header className="text-center space-y-8">
             <div className="flex flex-wrap justify-center gap-3">
                {Object.entries(cardConfig).map(([key, config]) => (
                   <button 
                    key={key} 
                    onClick={() => {
                      setCardType(key as CardType);
                      setFormData(prev => ({...prev, idNumber: generateUniqueID(key as CardType)}));
                    }} 
                    className={`w-16 h-16 rounded-[1.5rem] flex flex-col items-center justify-center transition-all ${cardType === key ? `${config.color} scale-110 shadow-xl ring-4 ring-white/10` : 'bg-white/5 hover:bg-white/10 opacity-30'}`}
                    title={config.label}
                   >
                     <span className="text-2xl">{config.icon}</span>
                     <span className="text-[7px] font-black uppercase mt-1 text-white">{config.code}</span>
                   </button>
                ))}
             </div>
             <div className="space-y-2">
                <h2 className="text-4xl font-black text-white uppercase tracking-tight">{lang === 'ar' ? 'مصنع الهويات المتعدد' : 'Multipurpose ID Factory'}</h2>
                <p className="text-sm text-indigo-400 font-bold uppercase tracking-[0.3em]">{cardConfig[cardType].label}</p>
             </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{t.cardCity}</label>
                <input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all" />
             </div>
             
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{cardConfig[cardType].extraLabel}</label>
                <input value={formData.extraField} placeholder={lang === 'ar' ? 'أدخل البيانات هنا...' : 'Enter data here...'} onChange={e => setFormData({...formData, extraField: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-sm focus:border-indigo-500 outline-none transition-all" />
             </div>

             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{t.cardBlood}</label>
                <select value={formData.bloodType} onChange={e => setFormData({...formData, bloodType: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-sm outline-none focus:border-indigo-500">
                   {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => <option key={b} value={b} className="bg-slate-900">{b}</option>)}
                </select>
             </div>

             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{lang === 'ar' ? 'تاريخ الميلاد' : 'Birth Date'}</label>
                <div className="flex gap-2">
                  <select value={formData.birthDay} onChange={e => setFormData({...formData, birthDay: e.target.value})} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-2 py-4 text-white text-xs outline-none">
                    {Array.from({length: 31}, (_, i) => i + 1).map(d => <option key={d} value={d.toString().padStart(2, '0')} className="bg-slate-900">{d.toString().padStart(2, '0')}</option>)}
                  </select>
                  <select value={formData.birthMonth} onChange={e => setFormData({...formData, birthMonth: e.target.value})} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-2 py-4 text-white text-xs outline-none">
                    {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m.toString().padStart(2, '0')} className="bg-slate-900">{m.toString().padStart(2, '0')}</option>)}
                  </select>
                  <select value={formData.birthYear} onChange={e => setFormData({...formData, birthYear: e.target.value})} className="flex-2 bg-white/5 border border-white/10 rounded-xl px-2 py-4 text-white text-xs outline-none">
                    {Array.from({length: 80}, (_, i) => 2024 - i).map(y => <option key={y} value={y.toString()} className="bg-slate-900">{y}</option>)}
                  </select>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-white/5">
             <button onClick={() => photoRef.current?.click()} className="p-8 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center gap-4 hover:bg-white/10 hover:border-indigo-500 transition-all h-44 group">
                {formData.idPhoto ? <img src={formData.idPhoto} className="h-20 w-20 object-cover rounded-2xl shadow-2xl" /> : <div className="text-4xl grayscale group-hover:grayscale-0 transition-all">👤</div>}
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{lang === 'ar' ? 'الصورة الشخصية' : 'Photo'}</span>
             </button>
             <button onClick={() => logoRef.current?.click()} className="p-8 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center gap-4 hover:bg-white/10 hover:border-amber-500 transition-all h-44 group">
                {formData.logoPhoto ? <img src={formData.logoPhoto} className="h-20 w-20 object-contain shadow-2xl" /> : <div className="text-4xl grayscale group-hover:grayscale-0 transition-all">🏛️</div>}
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{lang === 'ar' ? 'شعار المنظمة' : 'Logo'}</span>
             </button>
             <button onClick={() => stampRef.current?.click()} className="p-8 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center gap-4 hover:bg-white/10 hover:border-emerald-500 transition-all h-44 group">
                {formData.stampPhoto ? <img src={formData.stampPhoto} className="h-20 w-20 object-contain shadow-2xl" /> : <div className="text-4xl grayscale group-hover:grayscale-0 transition-all">💮</div>}
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{lang === 'ar' ? 'الختم الرسمي' : 'Stamp'}</span>
             </button>
             <input ref={photoRef} type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'idPhoto')} />
             <input ref={logoRef} type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'logoPhoto')} />
             <input ref={stampRef} type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'stampPhoto')} />
          </div>
          
          <button onClick={() => setStep('preview')} className={`w-full py-7 ${cardConfig[cardType].color} rounded-[2.5rem] text-[13px] font-black uppercase tracking-[0.4em] text-white shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all`}>
             {lang === 'ar' ? 'إصدار ومعاينة الهوية' : 'Issue & Preview ID'}
          </button>
       </div>
    </div>
  );
};

export default IDCardCreator;
