import React from 'react';

interface LogoProps {
  className?: string;
  showSlogan?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export const ScentCafeLogo: React.FC<LogoProps> = ({
  className = '',
  showSlogan = true,
  size = 'md',
  variant = 'light',
}) => {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const sloganSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Premium Emblem: Golden Perfume silhouette with warm aroma arc */}
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1C2541] to-[#0B132B] p-1.5 shadow-md border border-[#D4AF37]/30"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full text-[#D4AF37]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bottle Atomizer Cap */}
          <rect x="17" y="5" width="6" height="4" rx="1.5" fill="currentColor" />
          <rect x="18.5" y="9" width="3" height="3" fill="#E5C158" />
          {/* Bottle Shoulders & Body */}
          <path
            d="M13 12C13 12 11 15 11 18V31C11 33.2091 12.7909 35 15 35H25C27.2091 35 29 33.2091 29 31V18C29 15 27 12 27 12H13Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Inner Golden Scent & Coffee Essence drop */}
          <path
            d="M20 18C18 21 16 23.5 16 26C16 28.2091 17.7909 30 20 30C22.2091 30 24 28.2091 24 26C24 23.5 22 21 20 18Z"
            fill="url(#goldGradient)"
          />
          {/* Sparkle accent */}
          <circle cx="26" cy="15" r="1.5" fill="#FFE58F" />
          <defs>
            <linearGradient id="goldGradient" x1="16" y1="18" x2="24" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F5D061" />
              <stop offset="1" stopColor="#B8860B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <span
          className={`font-serif tracking-wider font-bold ${textSize} ${
            variant === 'dark' ? 'text-[#0B132B]' : 'text-white'
          }`}
        >
          Scent<span className="text-[#D4AF37]">Cafe</span>
        </span>
        {showSlogan && (
          <span
            className={`tracking-widest font-sans font-semibold uppercase ${sloganSize} text-[#D4AF37] opacity-90`}
          >
            FIND IT. REQUEST IT. RECEIVE IT.
          </span>
        )}
      </div>
    </div>
  );
};
