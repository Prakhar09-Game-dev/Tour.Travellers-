import React from 'react';

interface KashiVishwanathWatermarkProps {
  className?: string;
  opacity?: number; // 0.05 to 0.25 for watermark, up to 1.0 for featured badge
  tint?: 'gold' | 'sandstone' | 'crimson' | 'ivory' | 'horizon';
  size?: number | string;
  showFramingArch?: boolean; // Matches the authentic photograph framing archway
}

export const KashiVishwanathWatermark: React.FC<KashiVishwanathWatermarkProps> = ({
  className = '',
  opacity = 0.09,
  tint = 'gold',
  size = 560,
  showFramingArch = true,
}) => {
  const getTintColors = () => {
    switch (tint) {
      case 'gold':
        return {
          primary: '#F59E0B',
          secondary: '#D97706',
          highlight: '#FEF08A',
          arch: '#B45309',
          flag: '#EA580C',
        };
      case 'horizon':
        return {
          primary: '#D9531E',
          secondary: '#F59E0B',
          highlight: '#FDE047',
          arch: '#7C2D12',
          flag: '#FF6A00',
        };
      case 'sandstone':
        return {
          primary: '#D4A373',
          secondary: '#A94F3D',
          highlight: '#F8ECD5',
          arch: '#8B4513',
          flag: '#E65100',
        };
      case 'ivory':
        return {
          primary: '#FFFDF7',
          secondary: '#E8D5B5',
          highlight: '#FFFFFF',
          arch: '#C69A52',
          flag: '#F59E0B',
        };
      case 'crimson':
      default:
        return {
          primary: '#7C2D12',
          secondary: '#D9531E',
          highlight: '#FDE047',
          arch: '#431407',
          flag: '#EA580C',
        };
    }
  };

  const colors = getTintColors();

  return (
    <div
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 700 700"
        width={size}
        height={size}
        className="max-w-none transform transition-transform"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="kashiWatermarkSunAura" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor={colors.highlight} stopOpacity="0.6" />
            <stop offset="50%" stopColor={colors.primary} stopOpacity="0.3" />
            <stop offset="100%" stopColor={colors.secondary} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="goldShikharaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.highlight} />
            <stop offset="35%" stopColor={colors.primary} />
            <stop offset="70%" stopColor={colors.secondary} />
            <stop offset="100%" stopColor={colors.arch} />
          </linearGradient>
        </defs>

        {/* Aura Circle Behind Spire */}
        <circle cx="350" cy="350" r="330" fill="url(#kashiWatermarkSunAura)" />

        {/* Outer Circular Sacred Engraved Seal Border */}
        <circle cx="350" cy="350" r="325" stroke={colors.primary} strokeWidth="3.5" strokeDasharray="12 4" />
        <circle cx="350" cy="350" r="312" stroke={colors.secondary} strokeWidth="1.5" />
        <circle cx="350" cy="350" r="298" stroke={colors.primary} strokeWidth="1" strokeDasharray="3 3" />

        {/* Sacred Circular Mantras */}
        <path id="kashiArcTop700" d="M 90 350 A 260 260 0 0 1 610 350" fill="none" />
        <text
          fontFamily="'Cinzel', Georgia, serif"
          fontSize="18"
          fontWeight="700"
          fill={colors.primary}
          letterSpacing="4.5"
        >
          <textPath href="#kashiArcTop700" startOffset="50%" textAnchor="middle">
            ★ श्री काशी विश्वनाथ ज्योतिर्लिंग धाम • VARANASI ★
          </textPath>
        </text>

        <path id="kashiArcBottom700" d="M 610 350 A 260 260 0 0 1 90 350" fill="none" />
        <text
          fontFamily="'Cinzel', Georgia, serif"
          fontSize="14"
          fontWeight="600"
          fill={colors.secondary}
          letterSpacing="4"
        >
          <textPath href="#kashiArcBottom700" startOffset="50%" textAnchor="middle">
            • AUTHENTIC GOLDEN SHIKHARA &amp; SACRED CORRIDOR •
          </textPath>
        </text>

        {/* ---------------------------------------------------- */}
        {/* AUTHENTIC PHOTO REPRESENTATION:                      */}
        {/* THE ORNATE CARVED STONE GATEWAY ARCHWAY (IMAGE 8)    */}
        {/* ---------------------------------------------------- */}
        {showFramingArch && (
          <g id="authenticArchwayFrame" opacity="0.95">
            {/* Outer Arch Gateway Pillars */}
            <path
              d="M 120 600 L 120 280 C 120 180 180 120 350 120 C 520 120 580 180 580 280 L 580 600"
              stroke={colors.arch}
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
            />
            {/* Inner Multi-Cusped Islamic-Nagara Arch Molding */}
            <path
              d="M 145 600 L 145 320 
                 Q 145 280 180 260 
                 Q 210 240 240 255 
                 Q 280 220 315 235 
                 Q 350 160 385 235 
                 Q 420 220 460 255 
                 Q 490 240 520 260 
                 Q 555 280 555 320 
                 L 555 600"
              stroke={colors.primary}
              strokeWidth="4"
              fill="none"
            />
            {/* Carved stone rosettes on arch spandrels */}
            <circle cx="170" cy="180" r="14" stroke={colors.secondary} strokeWidth="2" fill="none" />
            <circle cx="170" cy="180" r="6" fill={colors.primary} />
            <circle cx="530" cy="180" r="14" stroke={colors.secondary} strokeWidth="2" fill="none" />
            <circle cx="530" cy="180" r="6" fill={colors.primary} />

            {/* Hanging Ornate Brass Chandelier Silhouette (Visible in Photo) */}
            <g transform="translate(350, 130)">
              <line x1="0" y1="0" x2="0" y2="40" stroke={colors.arch} strokeWidth="2" />
              <ellipse cx="0" cy="46" rx="22" ry="8" stroke={colors.secondary} strokeWidth="1.5" />
              <path d="M -18 46 L -10 65 L 10 65 L 18 46 Z" stroke={colors.primary} strokeWidth="1.5" fill="none" />
              <circle cx="0" cy="72" r="4" fill={colors.highlight} />
            </g>
          </g>
        )}

        {/* ---------------------------------------------------- */}
        {/* FRAMED INSIDE THE ARCH:                              */}
        {/* THE REAL KASHI VISHWANATH SWARNA SHIKHARA (GOLDEN)   */}
        {/* ---------------------------------------------------- */}
        <g id="goldenSwarnaShikhara" transform="translate(40, 20)">
          {/* Subsidiary Stone Shikhara to the left */}
          <g opacity="0.75">
            <polygon points="190,540 265,540 250,330 205,330" fill={colors.secondary} />
            <polygon points="205,330 250,330 240,260 215,260" fill={colors.primary} />
            <ellipse cx="227" cy="255" rx="14" ry="5" fill={colors.highlight} />
            <line x1="227" y1="250" x2="227" y2="235" stroke={colors.primary} strokeWidth="2" />
          </g>

          {/* Subsidiary Small Pavilion Dome to the right */}
          <g opacity="0.65">
            <polygon points="370,540 440,540 425,360 385,360" fill={colors.secondary} />
            <polygon points="385,360 425,360 415,295 395,295" fill={colors.primary} />
            <ellipse cx="405" cy="290" rx="12" ry="4" fill={colors.highlight} />
          </g>

          {/* MAIN TOWERING GOLDEN SHIKHARA (CENTRAL SWARNA SHIKHARA) */}
          {/* Plinth Base */}
          <polygon points="240,540 380,540 370,440 250,440" fill="url(#goldShikharaGrad)" />
          {/* Ribbed Niches & Golden Plates Tier 1 */}
          <polygon points="252,440 368,440 358,350 262,350" fill="url(#goldShikharaGrad)" stroke={colors.highlight} strokeWidth="1" />
          <line x1="265" y1="410" x2="355" y2="410" stroke={colors.highlight} strokeWidth="1" opacity="0.7" />
          <line x1="272" y1="380" x2="348" y2="380" stroke={colors.highlight} strokeWidth="1" opacity="0.7" />

          {/* Golden Shikhara Tier 2 */}
          <polygon points="264,350 356,350 346,260 274,260" fill="url(#goldShikharaGrad)" stroke={colors.highlight} strokeWidth="1" />
          <line x1="276" y1="320" x2="344" y2="320" stroke={colors.highlight} strokeWidth="1" opacity="0.7" />
          <line x1="284" y1="290" x2="336" y2="290" stroke={colors.highlight} strokeWidth="1" opacity="0.7" />

          {/* Golden Shikhara Tier 3 (Pyramidal Peak) */}
          <polygon points="278,260 342,260 330,195 290,195" fill="url(#goldShikharaGrad)" stroke={colors.highlight} strokeWidth="1" />

          {/* Amalaka (Ribbed Sun-Disc Crown) */}
          <ellipse cx="310" cy="188" rx="30" ry="9" fill={colors.highlight} stroke={colors.secondary} strokeWidth="1.5" />
          <ellipse cx="310" cy="184" rx="22" ry="6" fill="#FFFFFF" opacity="0.6" />

          {/* Sacred Golden Kalash (Golden Pitcher) */}
          <ellipse cx="310" cy="172" rx="14" ry="10" fill={colors.highlight} stroke={colors.secondary} strokeWidth="1" />
          <polygon points="303,165 317,165 310,140" fill={colors.highlight} stroke={colors.primary} strokeWidth="1" />

          {/* Sacred Golden Trishul at the Peak */}
          <line x1="310" y1="160" x2="310" y2="120" stroke={colors.highlight} strokeWidth="2.5" />
          <path d="M 302 130 Q 310 138 318 130 L 318 122 Q 310 128 302 122 Z" fill={colors.highlight} />

          {/* Sacred Saffron Triangular Dhwaja (Flag) Billowing in the Sky */}
          <polygon points="310,135 365,148 310,162" fill={colors.flag} stroke="#C2410C" strokeWidth="1.2" />
        </g>

        {/* Sacred River Ganga Wave Steps at the Foundation */}
        <g opacity="0.8">
          <path d="M 180 570 L 520 570 L 520 577 L 180 577 Z" fill={colors.primary} opacity="0.7" />
          <path d="M 200 584 L 500 584 L 500 592 L 200 592 Z" fill={colors.primary} opacity="0.5" />
          <path d="M 160 605 Q 255 595 350 605 T 540 605" stroke={colors.primary} strokeWidth="2.5" fill="none" />
          <path d="M 190 618 Q 270 610 350 618 T 510 618" stroke={colors.secondary} strokeWidth="1.8" fill="none" />
        </g>

        {/* Sacred Inscription */}
        <text
          x="350"
          y="650"
          fontFamily="'Cinzel', Georgia, serif"
          fontSize="17"
          fontWeight="700"
          fill={colors.primary}
          textAnchor="middle"
          letterSpacing="4"
        >
          ।। हर हर महादेव • काशी विश्वनाथ ।।
        </text>
      </svg>
    </div>
  );
};
