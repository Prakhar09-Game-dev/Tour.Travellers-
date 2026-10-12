import React, { useState } from 'react';

interface GangaSunButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  showSun?: boolean;
  showWaves?: boolean;
  className?: string;
}

export const GangaSunButton: React.FC<GangaSunButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  showSun = true,
  showWaves = true,
  className = '',
  onClick,
  ...props
}) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
    if (onClick) {
      onClick(e);
    }
  };

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm sm:text-base',
    lg: 'px-6 py-3.5 text-base sm:text-lg',
  }[size];

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#821B25] via-[#B5222A] to-[#821B25] text-white shadow-md hover:shadow-lg hover:from-[#B5222A] hover:to-[#821B25] border-t border-white/20',
    secondary:
      'bg-[#FFF9F0] text-[#821B25] border-2 border-[#C69A52]/40 hover:border-[#821B25] hover:bg-[#F3E8D5] shadow-xs',
    outline:
      'bg-transparent text-white border border-[#C69A52] hover:bg-white/10 hover:border-[#F3E8D5] shadow-xs',
    amber:
      'bg-gradient-to-r from-[#B5222A] to-[#821B25] text-white shadow-md hover:brightness-110 border-t border-amber-300/30',
  }[variant];

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`group relative inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 active:scale-98 overflow-hidden cursor-pointer select-none ${sizeClasses} ${variantStyles} ${className}`}
    >
      {/* Sun Radiant Aura */}
      {showSun && variant !== 'secondary' && (
        <span
          className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#FEF08A] to-[#F59E0B] opacity-35 blur-sm group-hover:scale-150 transition-transform pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Stylized Sun Symbol */}
      {showSun && (
        <span className="shrink-0 text-[#FEF08A] group-hover:rotate-45 transition-transform duration-500" aria-hidden="true">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.3" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        </span>
      )}

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </span>

      {/* River Ganga Water Wave Crest on Bottom Edge */}
      {showWaves && (
        <div className="absolute inset-x-0 bottom-0 h-1.5 opacity-60 group-hover:opacity-90 overflow-hidden pointer-events-none transition-opacity">
          <svg
            className="w-[200%] h-full animate-wave-slide"
            viewBox="0 0 1200 12"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 6 Q 75 0 150 6 T 300 6 T 450 6 T 600 6 T 750 6 T 900 6 T 1050 6 T 1200 6 L 1200 12 L 0 12 Z"
              fill={variant === 'secondary' ? '#D9531E' : '#FFFFFF'}
              fillOpacity={variant === 'secondary' ? 0.35 : 0.45}
            />
          </svg>
        </div>
      )}

      {/* Click Water Ripple Splash Effect */}
      {clicked && (
        <span
          className="absolute inset-0 rounded-xl bg-white/30 animate-ping pointer-events-none"
          aria-hidden="true"
        />
      )}
    </button>
  );
};
