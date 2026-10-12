import React from 'react';

interface GangaAartiWatermarkProps {
  className?: string;
  opacity?: number; // 0.05 to 0.15
  tint?: 'crimson' | 'gold' | 'sepia' | 'cream' | 'horizon';
  size?: number | string;
}

export const GangaAartiWatermark: React.FC<GangaAartiWatermarkProps> = ({
  className = '',
  opacity = 0.08,
  tint = 'crimson',
  size = 520,
}) => {
  const getTintColor = () => {
    switch (tint) {
      case 'gold':
        return '#C69A52';
      case 'horizon':
        return '#D9531E';
      case 'cream':
        return '#FFF9F0';
      case 'sepia':
        return '#A94F3D';
      case 'crimson':
      default:
        return '#821B25';
    }
  };

  const color = getTintColor();

  return (
    <div
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 600 600"
        width={size}
        height={size}
        className="max-w-none transform transition-transform"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Distressed Stamp Border */}
        <circle cx="300" cy="300" r="280" stroke={color} strokeWidth="4.5" strokeDasharray="14 5" />
        <circle cx="300" cy="300" r="268" stroke={color} strokeWidth="1.8" />
        <circle cx="300" cy="300" r="256" stroke={color} strokeWidth="1.2" strokeDasharray="3 3" />

        {/* Circular Stamp Text Arc */}
        <path id="watermarkArcTop" d="M 90 300 A 210 210 0 0 1 510 300" fill="none" />
        <text
          fontFamily="'Cinzel', Georgia, serif"
          fontSize="18"
          fontWeight="700"
          fill={color}
          letterSpacing="4.5"
        >
          <textPath href="#watermarkArcTop" startOffset="50%" textAnchor="middle">
            ★ UJJAWAL TOUR &amp; TRAVELS • VARANASI ★
          </textPath>
        </text>

        <path id="watermarkArcBottom" d="M 510 300 A 210 210 0 0 1 90 300" fill="none" />
        <text
          fontFamily="'Cinzel', Georgia, serif"
          fontSize="15"
          fontWeight="600"
          fill={color}
          letterSpacing="4"
        >
          <textPath href="#watermarkArcBottom" startOffset="50%" textAnchor="middle">
            • SACRED GANGA AARTI • KASHI HERITAGE •
          </textPath>
        </text>

        {/* Inner Decorative Seal Circle */}
        <circle cx="300" cy="300" r="185" stroke={color} strokeWidth="2.5" />
        <circle cx="300" cy="300" r="179" stroke={color} strokeWidth="0.8" />

        {/* River Ghat Steps */}
        <path d="M 120 440 L 480 440 L 480 447 L 120 447 Z" fill={color} opacity="0.6" />
        <path d="M 135 450 L 465 450 L 465 458 L 135 458 Z" fill={color} opacity="0.5" />
        <path d="M 150 461 L 450 461 L 450 470 L 150 470 Z" fill={color} opacity="0.4" />

        {/* River Ganga Water Waves */}
        <path d="M 120 480 Q 180 470 240 480 T 360 480 T 480 480" stroke={color} strokeWidth="2" fill="none" />
        <path d="M 140 495 Q 200 487 260 495 T 380 495 T 460 495" stroke={color} strokeWidth="1.5" fill="none" />
        <path d="M 180 508 Q 230 502 280 508 T 380 508 T 420 508" stroke={color} strokeWidth="1.2" strokeDasharray="4 2" fill="none" />

        {/* Wooden Boat on River */}
        <path d="M 370 470 Q 400 476 430 470 L 420 465 L 380 465 Z" fill={color} opacity="0.75" />
        <line x1="400" y1="465" x2="400" y2="452" stroke={color} strokeWidth="1.2" />

        {/* Heritage Temple Silhouettes on Ghat */}
        <path d="M 160 435 L 175 360 L 190 435 Z" fill={color} opacity="0.45" />
        <path d="M 185 435 L 200 380 L 215 435 Z" fill={color} opacity="0.35" />

        {/* Ceremonial Wooden Aarti Pedestal (Chowki) */}
        <polygon points="230,435 370,435 360,422 240,422" fill={color} />

        {/* Priest Silhouette Performing Aarti */}
        {/* Dhoti & Robes */}
        <path
          d="M 268 422 Q 285 365 285 325 Q 300 325 315 325 Q 315 365 332 422 Q 300 426 268 422 Z"
          fill={color}
        />
        {/* Torso */}
        <path d="M 283 325 L 285 275 Q 300 270 315 275 L 317 325 Z" fill={color} />
        {/* Head in profile with traditional topknot / Shika */}
        <circle cx="300" cy="254" r="14" fill={color} />
        <path d="M 292 248 Q 288 242 290 238 Q 295 240 295 245 Z" fill={color} />

        {/* Both Arms Raised Upward Holding the Multi-Tiered Aarti Lamp */}
        <path d="M 285 280 Q 270 245 286 215 L 295 220 Q 282 248 293 282 Z" fill={color} />
        <path d="M 315 280 Q 330 245 314 215 L 305 220 Q 318 248 307 282 Z" fill={color} />

        {/* Multi-Tiered Aarti Lamp (Deepam) */}
        <rect x="294" y="212" width="12" height="18" rx="3" fill={color} />
        {/* Lower Tier Dish */}
        <path d="M 270 214 Q 300 220 330 214 Q 300 206 270 214 Z" fill={color} />
        {/* Middle Tier Dish */}
        <path d="M 278 196 Q 300 202 322 196 Q 300 188 278 196 Z" fill={color} />
        {/* Upper Tier Dish */}
        <path d="M 286 178 Q 300 184 314 178 Q 300 172 286 178 Z" fill={color} />
        {/* Pinnacle Cup */}
        <ellipse cx="300" cy="162" rx="8" ry="4" fill={color} />

        {/* Sacred Flames */}
        <path d="M 297 160 Q 288 140 300 115 Q 312 140 303 160 Z" fill={color} />
        <path d="M 273 210 Q 271 198 275 190 Q 278 199 276 210 Z" fill={color} />
        <path d="M 324 210 Q 326 198 322 190 Q 319 199 321 210 Z" fill={color} />
        <path d="M 282 192 Q 280 180 284 172 Q 287 182 285 192 Z" fill={color} />
        <path d="M 318 192 Q 320 180 316 172 Q 313 182 315 192 Z" fill={color} />

        {/* Radiating Holy Light Rays */}
        <line x1="300" y1="110" x2="300" y2="92" stroke={color} strokeWidth="1.8" strokeDasharray="2 3" />
        <line x1="316" y1="118" x2="330" y2="104" stroke={color} strokeWidth="1.5" strokeDasharray="2 3" />
        <line x1="284" y1="118" x2="270" y2="104" stroke={color} strokeWidth="1.5" strokeDasharray="2 3" />
      </svg>
    </div>
  );
};
