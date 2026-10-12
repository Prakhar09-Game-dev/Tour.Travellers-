import fs from 'fs';
import path from 'path';

const VEHICLES_DIR = '/public/assets/vehicles';
const VARANASI_DIR = '/public/assets/varanasi';

// 1. Signature Ganga Aarti Stamp Watermark SVG
const gangaAartiStampSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <!-- Engraving Hatch Patterns -->
    <pattern id="engraveLines" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="6" stroke="#821B25" stroke-width="0.8" opacity="0.35" />
    </pattern>
    <filter id="distressedInk">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>

  <g filter="url(#distressedInk)">
    <!-- Outer Seal Double Ring -->
    <circle cx="300" cy="300" r="280" fill="none" stroke="#821B25" stroke-width="4.5" stroke-dasharray="12 4" />
    <circle cx="300" cy="300" r="268" fill="none" stroke="#B5222A" stroke-width="1.8" />
    <circle cx="300" cy="300" r="256" fill="none" stroke="#C69A52" stroke-width="1.2" stroke-dasharray="3 3" />
    
    <!-- Circular Stamp Typography Arc -->
    <path id="textArcTop" d="M 90 300 A 210 210 0 0 1 510 300" fill="none" stroke="none" />
    <text font-family="'Cinzel', Georgia, serif" font-size="19" font-weight="700" fill="#821B25" letter-spacing="4.5">
      <textPath href="#textArcTop" startOffset="50%" text-anchor="middle">
        ★ UJJAWAL TOUR &amp; TRAVELS • VARANASI ★
      </textPath>
    </text>

    <path id="textArcBottom" d="M 510 300 A 210 210 0 0 1 90 300" fill="none" stroke="none" />
    <text font-family="'Cinzel', Georgia, serif" font-size="16" font-weight="600" fill="#A94F3D" letter-spacing="4">
      <textPath href="#textArcBottom" startOffset="50%" text-anchor="middle">
        • SACRED GANGA AARTI • KASHI HERITAGE •
      </textPath>
    </text>

    <!-- Inner Decorative Circle Border -->
    <circle cx="300" cy="300" r="185" fill="none" stroke="#821B25" stroke-width="2.5" />
    <circle cx="300" cy="300" r="179" fill="none" stroke="#C69A52" stroke-width="0.9" />

    <!-- River Ghat Steps in background -->
    <path d="M 120 440 L 480 440 L 480 447 L 120 447 Z" fill="#821B25" opacity="0.6" />
    <path d="M 135 450 L 465 450 L 465 458 L 135 458 Z" fill="#821B25" opacity="0.5" />
    <path d="M 150 461 L 450 461 L 450 470 L 150 470 Z" fill="#821B25" opacity="0.4" />
    
    <!-- Holy Ganga Waves -->
    <path d="M 120 480 Q 180 470 240 480 T 360 480 T 480 480" fill="none" stroke="#B5222A" stroke-width="2" />
    <path d="M 140 495 Q 200 487 260 495 T 380 495 T 460 495" fill="none" stroke="#C69A52" stroke-width="1.5" />
    <path d="M 180 508 Q 230 502 280 508 T 380 508 T 420 508" fill="none" stroke="#821B25" stroke-width="1.2" stroke-dasharray="4 2" />

    <!-- Riverboat Silhouette on Ganga -->
    <path d="M 370 470 Q 400 476 430 470 L 420 465 L 380 465 Z" fill="#821B25" opacity="0.75" />
    <line x1="400" y1="465" x2="400" y2="452" stroke="#821B25" stroke-width="1.2" />

    <!-- Heritage Temple Spire Silhouettes on Ghat -->
    <path d="M 160 435 L 175 360 L 190 435 Z" fill="#821B25" opacity="0.45" />
    <path d="M 185 435 L 200 380 L 215 435 Z" fill="#821B25" opacity="0.35" />

    <!-- Ceremonial Wooden Aarti Pedestal (Chowki) -->
    <polygon points="230,435 370,435 360,422 240,422" fill="#821B25" />
    <rect x="250" y="422" width="100" height="5" fill="#C69A52" />

    <!-- Priest Performing Aarti Silhouette -->
    <!-- Lower Robes / Dhoti -->
    <path d="M 268 422 Q 285 365 285 325 Q 300 325 315 325 Q 315 365 332 422 Q 300 426 268 422 Z" fill="#821B25" />
    <!-- Stole / Angavastram draped over shoulder -->
    <path d="M 276 315 Q 265 350 260 385 Q 267 386 274 350 Z" fill="#B5222A" />
    <!-- Torso and upper body -->
    <path d="M 283 325 L 285 275 Q 300 270 315 275 L 317 325 Z" fill="#821B25" />
    <!-- Sacred Head in profile with traditional topknot / Shika -->
    <circle cx="300" cy="254" r="14" fill="#821B25" />
    <path d="M 292 248 Q 288 242 290 238 Q 295 240 295 245 Z" fill="#821B25" />

    <!-- Both Arms Raised Upward Holding the Heavy Aarti Lamp -->
    <!-- Left Arm -->
    <path d="M 285 280 Q 270 245 286 215 L 295 220 Q 282 248 293 282 Z" fill="#821B25" />
    <!-- Right Arm -->
    <path d="M 315 280 Q 330 245 314 215 L 305 220 Q 318 248 307 282 Z" fill="#821B25" />

    <!-- Sacred Multi-Tiered Brass Ganga Aarti Lamp (Deepam) -->
    <!-- Base Handle held by hands -->
    <rect x="294" y="212" width="12" height="18" rx="3" fill="#C69A52" />
    <!-- Lower Tier Dish -->
    <path d="M 270 214 Q 300 220 330 214 Q 300 206 270 214 Z" fill="#B5222A" stroke="#C69A52" stroke-width="1" />
    <!-- Middle Tier Dish -->
    <path d="M 278 196 Q 300 202 322 196 Q 300 188 278 196 Z" fill="#B5222A" stroke="#C69A52" stroke-width="1" />
    <!-- Upper Tier Dish -->
    <path d="M 286 178 Q 300 184 314 178 Q 300 172 286 178 Z" fill="#B5222A" stroke="#C69A52" stroke-width="1" />
    <!-- Pinnacle Top Cup -->
    <ellipse cx="300" cy="162" rx="8" ry="4" fill="#C69A52" />

    <!-- Multi-Tiered Sacred Aarti Flames (Agni Shikha) -->
    <!-- Tier 1 Flames (Left, Center, Right) -->
    <path d="M 273 210 Q 271 198 275 190 Q 278 199 276 210 Z" fill="#D74332" />
    <path d="M 285 210 Q 284 195 288 186 Q 291 197 288 210 Z" fill="#C69A52" />
    <path d="M 312 210 Q 315 195 312 186 Q 310 197 310 210 Z" fill="#C69A52" />
    <path d="M 324 210 Q 326 198 322 190 Q 319 199 321 210 Z" fill="#D74332" />

    <!-- Tier 2 Flames -->
    <path d="M 282 192 Q 280 180 284 172 Q 287 182 285 192 Z" fill="#C69A52" />
    <path d="M 293 192 Q 292 176 295 168 Q 298 178 296 192 Z" fill="#D74332" />
    <path d="M 307 192 Q 308 176 305 168 Q 302 178 304 192 Z" fill="#D74332" />
    <path d="M 318 192 Q 320 180 316 172 Q 313 182 315 192 Z" fill="#C69A52" />

    <!-- Central Grand Sacred Flame Rising to the Sky -->
    <path d="M 297 160 Q 288 140 300 115 Q 312 140 303 160 Z" fill="#B5222A" />
    <path d="M 298 158 Q 293 143 300 126 Q 307 143 302 158 Z" fill="#D74332" />
    <path d="M 299 156 Q 296 146 300 135 Q 304 146 301 156 Z" fill="#C69A52" />

    <!-- Holy Rays Radiating from the Aarti Lamp -->
    <line x1="300" y1="110" x2="300" y2="92" stroke="#C69A52" stroke-width="1.8" stroke-dasharray="2 3" />
    <line x1="316" y1="118" x2="330" y2="104" stroke="#C69A52" stroke-width="1.5" stroke-dasharray="2 3" />
    <line x1="284" y1="118" x2="270" y2="104" stroke="#C69A52" stroke-width="1.5" stroke-dasharray="2 3" />
    <line x1="330" y1="135" x2="348" y2="128" stroke="#C69A52" stroke-width="1.2" stroke-dasharray="2 2" />
    <line x1="270" y1="135" x2="252" y2="128" stroke="#C69A52" stroke-width="1.2" stroke-dasharray="2 2" />

    <!-- Floating Lotus Motifs in the Borders -->
    <path d="M 290 540 Q 300 528 310 540 Q 300 546 290 540 Z" fill="#B5222A" />
  </g>
</svg>`;

// Helper function to build high-fidelity vehicle SVGs
function createVehicleSvg({
  title,
  plateText,
  bodyType, // 'sedan' | 'mpv' | 'innova'
  hasRoofCarrier = false,
  badge = 'SUZUKI',
}) {
  const isMpv = bodyType === 'mpv' || bodyType === 'innova';
  const isInnova = bodyType === 'innova';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" width="100%" height="100%">
  <defs>
    <!-- Warm Ivory / Sand Beige Studio Background Gradient -->
    <radialGradient id="studioFloor" cx="50%" cy="65%" r="75%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="55%" stop-color="#FFF9F0" />
      <stop offset="85%" stop-color="#F3E8D5" />
      <stop offset="100%" stop-color="#E8D5B5" />
    </radialGradient>

    <!-- Metallic White Car Body Gradient -->
    <linearGradient id="pearlWhitePaint" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="40%" stop-color="#F8FAFC" />
      <stop offset="75%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>

    <!-- Glossy Windshield & Glass -->
    <linearGradient id="tintedGlass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" stop-opacity="0.95" />
      <stop offset="45%" stop-color="#1E293B" stop-opacity="0.85" />
      <stop offset="70%" stop-color="#334155" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#0F172A" stop-opacity="0.98" />
    </linearGradient>

    <!-- Chrome Trim Gradient -->
    <linearGradient id="chromeShine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#94A3B8" />
      <stop offset="25%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#CBD5E1" />
      <stop offset="75%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#64748B" />
    </linearGradient>

    <!-- Tire Gradient -->
    <radialGradient id="tireRubber" cx="50%" cy="50%" r="50%">
      <stop offset="60%" stop-color="#1E293B" />
      <stop offset="85%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>

    <!-- Alloy Wheel Rim Gradient -->
    <radialGradient id="alloyRim" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="40%" stop-color="#E2E8F0" />
      <stop offset="75%" stop-color="#94A3B8" />
      <stop offset="100%" stop-color="#475569" />
    </radialGradient>

    <!-- Studio Soft Drop Shadow -->
    <filter id="softStudioShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="16" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.1   0 0 0 0 0.1   0 0 0 0 0.1  0 0 0 0.35 0"/>
      <feOffset dx="0" dy="18" />
      <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
    </filter>
  </defs>

  <!-- Studio Backdrop Surface -->
  <rect width="900" height="560" fill="url(#studioFloor)" />
  <line x1="0" y1="390" x2="900" y2="390" stroke="#E8D5B5" stroke-width="1.5" opacity="0.6" />

  <!-- Background Watermark Subtle Stamp Stamp Outline -->
  <g opacity="0.04" transform="translate(680, 80) scale(0.45)">
    <circle cx="200" cy="200" r="180" fill="none" stroke="#B5222A" stroke-width="4" />
    <path d="M 120 300 Q 200 240 280 300" stroke="#B5222A" stroke-width="3" fill="none" />
  </g>

  <!-- Ground Contact Shadow Under Car -->
  <ellipse cx="450" cy="460" rx="350" ry="34" fill="#1C1917" opacity="0.22" filter="blur(14px)" />
  <ellipse cx="450" cy="455" rx="310" ry="18" fill="#0C0A09" opacity="0.4" filter="blur(6px)" />

  <!-- VEHICLE RENDERING GROUP -->
  <g id="vehicle">

    ${hasRoofCarrier ? `
    <!-- Roof-Mounted Luggage Carrier (Toyota Innova Touring Spec) -->
    <g id="roofCarrier">
      <!-- Stanchions / Mount Feet -->
      <rect x="250" y="112" width="14" height="26" rx="2" fill="#334155" />
      <rect x="390" y="108" width="14" height="26" rx="2" fill="#334155" />
      <rect x="530" y="108" width="14" height="26" rx="2" fill="#334155" />
      <rect x="670" y="112" width="14" height="26" rx="2" fill="#334155" />
      
      <!-- Crossbars & Outer Frame -->
      <rect x="220" y="100" width="490" height="15" rx="4" fill="url(#chromeShine)" stroke="#475569" stroke-width="1.5" />
      <rect x="225" y="86" width="480" height="14" rx="4" fill="#1E293B" stroke="#475569" stroke-width="1" />
      
      <!-- Aerodynamic Basket Rails -->
      <line x1="280" y1="88" x2="280" y2="100" stroke="#CBD5E1" stroke-width="2" />
      <line x1="340" y1="88" x2="340" y2="100" stroke="#CBD5E1" stroke-width="2" />
      <line x1="400" y1="88" x2="400" y2="100" stroke="#CBD5E1" stroke-width="2" />
      <line x1="460" y1="88" x2="460" y2="100" stroke="#CBD5E1" stroke-width="2" />
      <line x1="520" y1="88" x2="520" y2="100" stroke="#CBD5E1" stroke-width="2" />
      <line x1="580" y1="88" x2="580" y2="100" stroke="#CBD5E1" stroke-width="2" />
      <line x1="640" y1="88" x2="640" y2="100" stroke="#CBD5E1" stroke-width="2" />
      
      <!-- Covered Luggage Pack under net -->
      <path d="M 260 86 Q 470 65 650 86 Z" fill="#334155" opacity="0.65" />
      <path d="M 270 86 Q 470 68 640 86" stroke="#94A3B8" stroke-width="1.2" stroke-dasharray="8 4" fill="none" />
    </g>
    ` : ''}

    <!-- Wheels (Rear and Front) -->
    <!-- Rear Wheel Left -->
    <g transform="translate(230, 415)">
      <circle cx="0" cy="0" r="62" fill="url(#tireRubber)" />
      <circle cx="0" cy="0" r="44" fill="url(#alloyRim)" stroke="#334155" stroke-width="3" />
      <!-- Multi-Spoke Alloy Design -->
      <circle cx="0" cy="0" r="14" fill="#1E293B" />
      <circle cx="0" cy="0" r="8" fill="#F8FAFC" />
      <line x1="0" y1="-42" x2="0" y2="42" stroke="#F1F5F9" stroke-width="5" />
      <line x1="-42" y1="0" x2="42" y2="0" stroke="#F1F5F9" stroke-width="5" />
      <line x1="-30" y1="-30" x2="30" y2="30" stroke="#F1F5F9" stroke-width="4" />
      <line x1="-30" y1="30" x2="30" y2="-30" stroke="#F1F5F9" stroke-width="4" />
    </g>

    <!-- Front Wheel Right -->
    <g transform="translate(680, 415)">
      <circle cx="0" cy="0" r="62" fill="url(#tireRubber)" />
      <circle cx="0" cy="0" r="44" fill="url(#alloyRim)" stroke="#334155" stroke-width="3" />
      <circle cx="0" cy="0" r="14" fill="#1E293B" />
      <circle cx="0" cy="0" r="8" fill="#F8FAFC" />
      <line x1="0" y1="-42" x2="0" y2="42" stroke="#F1F5F9" stroke-width="5" />
      <line x1="-42" y1="0" x2="42" y2="0" stroke="#F1F5F9" stroke-width="5" />
      <line x1="-30" y1="-30" x2="30" y2="30" stroke="#F1F5F9" stroke-width="4" />
      <line x1="-30" y1="30" x2="30" y2="-30" stroke="#F1F5F9" stroke-width="4" />
    </g>

    <!-- CAR MAIN CHASSIS / BODY -->
    ${isMpv ? `
    <!-- MPV Cabin Profile (Ertiga / Innova) -->
    <!-- Cabin Greenhouse / Windows -->
    <path d="M 180 320 L 230 200 L 460 170 L 630 185 L 720 280 L 760 320 Z" fill="url(#tintedGlass)" />
    <!-- Window Pillars (A, B, C, D) -->
    <path d="M 360 180 L 372 180 L 372 290 L 360 290 Z" fill="#0F172A" />
    <path d="M 500 174 L 512 174 L 512 290 L 500 290 Z" fill="#0F172A" />
    <!-- Chrome Beltline Strip -->
    <path d="M 175 300 L 730 290" stroke="url(#chromeShine)" stroke-width="3.5" />

    <!-- MPV Body Shell -->
    <path d="M 120 375 
             Q 130 310 170 290 
             L 240 180 
             Q 280 155 380 150 
             L 570 155 
             Q 640 165 690 220 
             L 760 290 
             Q 810 320 830 360 
             L 835 410 
             Q 820 425 760 425 
             Q 750 360 680 360 
             Q 610 360 600 425 
             L 310 425 
             Q 300 360 230 360 
             Q 160 360 150 425 
             L 125 415 Z" 
          fill="url(#pearlWhitePaint)" 
          stroke="#94A3B8" 
          stroke-width="1.8" />
    ` : `
    <!-- Sedan Cabin Profile (Dzire / Zest) -->
    <!-- Sedan Greenhouse Windows -->
    <path d="M 210 320 L 280 215 L 530 205 L 670 270 L 730 320 Z" fill="url(#tintedGlass)" />
    <!-- B-Pillar -->
    <path d="M 430 210 L 445 210 L 445 300 L 430 300 Z" fill="#0F172A" />
    <!-- Chrome Window Trim -->
    <path d="M 205 308 L 705 308" stroke="url(#chromeShine)" stroke-width="3" />

    <!-- Sedan Body Shell -->
    <path d="M 110 370 
             Q 120 330 190 325 
             L 270 205 
             Q 330 185 450 185 
             L 535 190 
             Q 610 215 675 270 
             L 770 315 
             Q 820 340 840 370 
             L 842 415 
             Q 830 428 765 428 
             Q 755 360 680 360 
             Q 605 360 595 428 
             L 315 428 
             Q 305 360 230 360 
             Q 155 360 145 428 
             L 115 415 Z" 
          fill="url(#pearlWhitePaint)" 
          stroke="#94A3B8" 
          stroke-width="1.8" />
    `}

    <!-- Character Crease Lines & Door Handles -->
    <path d="M 240 330 Q 500 325 760 328" stroke="#FFFFFF" stroke-width="3" opacity="0.9" />
    <path d="M 240 332 Q 500 327 760 330" stroke="#94A3B8" stroke-width="1.5" opacity="0.7" />
    <!-- Body Side Sculpting -->
    <path d="M 320 395 L 580 395" stroke="#CBD5E1" stroke-width="2.5" />
    <!-- Chrome Door Handles -->
    <rect x="360" y="324" width="34" height="8" rx="4" fill="url(#chromeShine)" stroke="#64748B" stroke-width="1" />
    <rect x="490" y="324" width="34" height="8" rx="4" fill="url(#chromeShine)" stroke="#64748B" stroke-width="1" />

    <!-- Sleek Front Headlamp Cluster -->
    <path d="M 740 320 Q 805 325 835 348 Q 805 365 760 360 Z" fill="#F8FAFC" stroke="url(#chromeShine)" stroke-width="2" />
    <!-- Projector LED Lens & DRL Light Guide -->
    <circle cx="785" cy="342" r="11" fill="#38BDF8" opacity="0.8" />
    <circle cx="785" cy="342" r="6" fill="#FFFFFF" />
    <path d="M 750 330 Q 795 330 825 350" stroke="#E0F2FE" stroke-width="3.5" fill="none" />

    <!-- Sleek Front Grille with Chrome Slats -->
    <path d="M 780 355 L 835 360 L 838 395 L 775 390 Z" fill="#0F172A" stroke="#334155" stroke-width="1.5" />
    <line x1="782" y1="368" x2="835" y2="370" stroke="url(#chromeShine)" stroke-width="2.5" />
    <line x1="780" y1="380" x2="835" y2="382" stroke="url(#chromeShine)" stroke-width="2" />

    <!-- Front Brand Emblem Badge -->
    ${isInnova ? `
    <!-- Toyota Oval Ring Logo -->
    <g transform="translate(805, 373)">
      <ellipse cx="0" cy="0" rx="14" ry="10" fill="none" stroke="url(#chromeShine)" stroke-width="3" />
      <ellipse cx="0" cy="-2" rx="9" ry="6" fill="none" stroke="url(#chromeShine)" stroke-width="2.5" />
      <ellipse cx="0" cy="2" rx="5" ry="7" fill="none" stroke="url(#chromeShine)" stroke-width="2.2" />
    </g>
    ` : badge === 'TATA' ? `
    <!-- Tata Ring Emblem -->
    <g transform="translate(805, 373)">
      <circle cx="0" cy="0" r="11" fill="#0F172A" stroke="url(#chromeShine)" stroke-width="2.5" />
      <path d="M -6 3 Q 0 -6 6 3" stroke="url(#chromeShine)" stroke-width="2.5" fill="none" />
    </g>
    ` : `
    <!-- Suzuki S Emblem -->
    <g transform="translate(805, 373)">
      <rect x="-10" y="-8" width="20" height="16" rx="2" fill="#0F172A" />
      <path d="M -6 -6 L 6 -6 L -4 1 L 6 6 L -6 6 L 4 -1 Z" fill="url(#chromeShine)" />
    </g>
    `}

    <!-- Aerodynamic Front Bumper & Fog Lamp Housing -->
    <path d="M 770 395 L 840 400 L 836 430 L 760 425 Z" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1" />
    <!-- Fog Lamp Recess -->
    <ellipse cx="795" cy="415" rx="8" ry="6" fill="#0F172A" />
    <circle cx="795" cy="415" r="4" fill="#FEF08A" />

    <!-- PROMINENT FRONT LICENSE PLATE WITH DISPLAY NAME -->
    <g id="numberPlate" transform="translate(775, 385)">
      <!-- White Plate Base with Black Border -->
      <rect x="0" y="0" width="62" height="22" rx="2.5" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.8" />
      <!-- IND Blue Strip on Left -->
      <rect x="1" y="1" width="7" height="20" rx="1.5" fill="#1D4ED8" />
      <circle cx="4.5" cy="11" r="2" fill="#FFFFFF" />
      <!-- Bold Registration Text -->
      <text x="35" y="15.5" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10" font-weight="900" fill="#0F172A" text-anchor="middle" letter-spacing="1.2">
        ${plateText}
      </text>
    </g>

    <!-- Side View Mirror -->
    <path d="M 640 270 Q 660 262 670 275 Q 660 286 638 282 Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1.5" />
    <line x1="645" y1="277" x2="665" y2="277" stroke="#F59E0B" stroke-width="2" /> <!-- LED Indicator -->

  </g>

  <!-- Title Ribbon Banner & Heritage Watermark Seal on Top-Left -->
  <g transform="translate(40, 42)">
    <rect x="0" y="0" width="280" height="42" rx="6" fill="#821B25" opacity="0.95" />
    <rect x="2" y="2" width="276" height="38" rx="4" fill="none" stroke="#C69A52" stroke-width="1.2" />
    <text x="140" y="26" font-family="'Cinzel', Georgia, serif" font-size="16" font-weight="700" fill="#FFF9F0" text-anchor="middle" letter-spacing="2">
      ${title}
    </text>
  </g>
</svg>`;
}

// Write the files
fs.writeFileSync(path.join(VARANASI_DIR, 'ganga-aarti-stamp.svg'), gangaAartiStampSvg);
console.log('Created /public/assets/varanasi/ganga-aarti-stamp.svg');

// 1. Maruti Suzuki Dzire
const dzireSvg = createVehicleSvg({
  title: 'MARUTI SUZUKI DZIRE',
  plateText: 'DZIRE',
  bodyType: 'sedan',
  hasRoofCarrier: false,
  badge: 'SUZUKI',
});
fs.writeFileSync(path.join(VEHICLES_DIR, 'maruti-suzuki-dzire.svg'), dzireSvg);
fs.writeFileSync(path.join(VEHICLES_DIR, 'maruti-suzuki-dzire.png'), dzireSvg);

// 2. Maruti Suzuki Ertiga
const ertigaSvg = createVehicleSvg({
  title: 'MARUTI SUZUKI ERTIGA',
  plateText: 'ERTIGA',
  bodyType: 'mpv',
  hasRoofCarrier: false,
  badge: 'SUZUKI',
});
fs.writeFileSync(path.join(VEHICLES_DIR, 'maruti-suzuki-ertiga.svg'), ertigaSvg);
fs.writeFileSync(path.join(VEHICLES_DIR, 'maruti-suzuki-ertiga.png'), ertigaSvg);

// 3. Toyota Innova Reference
const innovaSvg = createVehicleSvg({
  title: 'TOYOTA INNOVA',
  plateText: 'INNOVA',
  bodyType: 'innova',
  hasRoofCarrier: true,
  badge: 'TOYOTA',
});
fs.writeFileSync(path.join(VEHICLES_DIR, 'toyota-innova-reference.svg'), innovaSvg);
fs.writeFileSync(path.join(VEHICLES_DIR, 'toyota-innova-reference.png'), innovaSvg);

// 4. Tata Zest
const zestSvg = createVehicleSvg({
  title: 'TATA ZEST',
  plateText: 'ZEST',
  bodyType: 'sedan',
  hasRoofCarrier: false,
  badge: 'TATA',
});
fs.writeFileSync(path.join(VEHICLES_DIR, 'tata-zest.svg'), zestSvg);
fs.writeFileSync(path.join(VEHICLES_DIR, 'tata-zest.png'), zestSvg);

// 5. Tempo Traveller (additional requested fleet option)
const travellerSvg = createVehicleSvg({
  title: 'FORCE TEMPO TRAVELLER',
  plateText: 'TRAVELLER',
  bodyType: 'innova',
  hasRoofCarrier: true,
  badge: 'TEMPO',
});
fs.writeFileSync(path.join(VEHICLES_DIR, 'force-traveller.svg'), travellerSvg);
fs.writeFileSync(path.join(VEHICLES_DIR, 'force-traveller.png'), travellerSvg);

console.log('Successfully generated all vehicle assets!');
