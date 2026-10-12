import React from 'react';

interface GangaWaveDividerProps {
  fillColor?: string;
  bgColor?: string;
  inverted?: boolean;
  className?: string;
}

export const GangaWaveDivider: React.FC<GangaWaveDividerProps> = ({
  fillColor = '#FFFDF7',
  bgColor = 'transparent',
  inverted = false,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}
      style={{ backgroundColor: bgColor }}
      aria-hidden="true"
    >
      <svg
        className={`relative block w-[200%] h-8 sm:h-12 md:h-16 animate-wave-slide ${
          inverted ? 'rotate-180' : ''
        }`}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z"
          fill={fillColor}
          fillOpacity="0.4"
        />
        <path
          d="M0,30 C200,120 400,10 600,70 C800,130 1000,20 1200,80 L1200,120 L0,120 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
};
