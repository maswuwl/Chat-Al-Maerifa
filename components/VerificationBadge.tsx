
import React from 'react';
import { UserProfile } from '../types';

interface VerificationBadgeProps {
  user: UserProfile;
  size?: 'sm' | 'md' | 'lg';
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ user, size = 'md' }) => {
  const nameLower = user.name.toLowerCase();
  
  // Logic for Special Badges
  const isMuntasir = nameLower.endsWith('المنتصر') || 
                     nameLower.endsWith('al-muntasir') || 
                     nameLower.endsWith('almuntasir') ||
                     nameLower.includes('منتصر');

  const isAdmin = user.role === 'admin';
  
  const joinDate = new Date(user.joinDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - joinDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isFreeBluePeriod = diffDays <= 30;

  let colorClasses = "";
  let glowColor = "";
  let tooltip = "";

  if (isMuntasir) {
    colorClasses = "text-amber-400 fill-amber-500";
    glowColor = "drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]";
    tooltip = "Founder / Royal Class / المنتصر";
  } else if (isAdmin) {
    colorClasses = "text-rose-500 fill-rose-600";
    glowColor = "drop-shadow-[0_0_10px_rgba(244,63,94,0.7)]";
    tooltip = "Official Admin";
  } else if (isFreeBluePeriod || user.isPremium) {
    colorClasses = "text-blue-500 fill-blue-600";
    glowColor = "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]";
    tooltip = isFreeBluePeriod ? "Verified (Free Month)" : "Verified Business";
  } else {
    return null;
  }

  const iconSizes = { 
    sm: 'w-3.5 h-3.5', 
    md: 'w-5 h-5', 
    lg: 'w-7 h-7' 
  };

  return (
    <div className="badge-3d-container inline-block align-middle ml-1" title={tooltip}>
      <div className={`badge-3d-body ${iconSizes[size]} ${glowColor}`}>
        <svg 
          className="w-full h-full" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* دائرة الخلفية (الشكل الأول المفضل) */}
          <circle cx="12" cy="12" r="10" className={colorClasses} fill="currentColor" />
          {/* علامة الصح فقط - تم حذف أي أيقونات أخرى */}
          <path 
            d="M8 12.5L10.5 15L16 9" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
        {/* تأثير اللمعان المتحرك فوق الدائرة */}
        <div className="badge-shine rounded-full"></div>
      </div>
    </div>
  );
};

export default VerificationBadge;
