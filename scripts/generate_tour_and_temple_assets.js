import fs from 'fs';
import path from 'path';

const VARANASI_DIR = './public/assets/varanasi';
if (!fs.existsSync(VARANASI_DIR)) fs.mkdirSync(VARANASI_DIR, { recursive: true });

// 1. KASHI VISHWANATH TEMPLE CORRIDOR ARTWORK
const kashiVishwanathSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
  <defs>
    <linearGradient id="kashiSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3D0C11" />
      <stop offset="35%" stop-color="#6B141C" />
      <stop offset="70%" stop-color="#B5222A" />
      <stop offset="100%" stop-color="#E8D5B5" />
    </linearGradient>
    <radialGradient id="goldenSpireAura" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#FFFBEB" stop-opacity="0.9" />
      <stop offset="25%" stop-color="#FDE047" stop-opacity="0.8" />
      <stop offset="60%" stop-color="#D97706" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#B5222A" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="goldPlate" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="25%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#D97706" />
      <stop offset="75%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="corridorStone" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E8D5B5" />
      <stop offset="50%" stop-color="#D4B996" />
      <stop offset="100%" stop-color="#A94F3D" />
    </linearGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#kashiSky)" />
  <circle cx="600" cy="220" r="320" fill="url(#goldenSpireAura)" />

  <!-- Sacred River Ganga at base of corridor -->
  <rect x="0" y="560" width="1200" height="115" fill="#1C1014" />
  <ellipse cx="600" cy="590" rx="360" ry="14" fill="#F59E0B" opacity="0.3" filter="blur(6px)" />
  <ellipse cx="600" cy="620" rx="280" ry="10" fill="#FEF08A" opacity="0.25" filter="blur(4px)" />

  <!-- Grand Corridor Stone Pavilions & Pillars (Left & Right) -->
  <g fill="url(#corridorStone)">
    <!-- Left Corridor Wing -->
    <rect x="60" y="380" width="380" height="180" />
    <polygon points="40,380 460,380 440,340 60,340" />
    <!-- Pillars Left -->
    <rect x="80" y="380" width="22" height="180" fill="#821B25" opacity="0.6" />
    <rect x="140" y="380" width="22" height="180" fill="#821B25" opacity="0.6" />
    <rect x="200" y="380" width="22" height="180" fill="#821B25" opacity="0.6" />
    <rect x="260" y="380" width="22" height="180" fill="#821B25" opacity="0.6" />
    <rect x="320" y="380" width="22" height="180" fill="#821B25" opacity="0.6" />
    <rect x="380" y="380" width="22" height="180" fill="#821B25" opacity="0.6" />

    <!-- Right Corridor Wing -->
    <rect x="760" y="380" width="380" height="180" />
    <polygon points="740,380 1160,380 1140,340 760,340" />
    <!-- Pillars Right -->
    <rect x="780" y="380" width="22" height="180" fill="#821B25" opacity="0.6" />
    <rect x="840" y="380" width="22" height="180" fill="#821B25" opacity="0.6" />
    <rect x="900" y="380" width="22" height="180" fill="#821B25" opacity="0.6" />
    <rect x="960" y="380" width="22" height="180" fill="#821B25" opacity="0.6" />
    <rect x="1020" y="380" width="22" height="180" fill="#821B25" opacity="0.6" />
    <rect x="1080" y="380" width="22" height="180" fill="#821B25" opacity="0.6" />
  </g>

  <!-- Central Sanctum & Main Temple Base (Garbhagriha) -->
  <polygon points="400,560 800,560 770,380 430,380" fill="#A94F3D" stroke="#C69A52" stroke-width="2" />
  <rect x="450" y="380" width="300" height="30" fill="url(#corridorStone)" />

  <!-- Iconic Kashi Vishwanath Golden Shikhara (Golden Spire) -->
  <g id="goldenShikhara">
    <!-- Tower Body Tier 1 -->
    <polygon points="460,380 740,380 720,290 480,290" fill="url(#goldPlate)" stroke="#B45309" stroke-width="2" />
    <!-- Tower Body Tier 2 -->
    <polygon points="485,290 715,290 690,200 510,200" fill="url(#goldPlate)" stroke="#B45309" stroke-width="2" />
    <!-- Tower Body Tier 3 (Pyramidal Steps) -->
    <polygon points="515,200 685,200 660,130 540,130" fill="url(#goldPlate)" stroke="#B45309" stroke-width="2" />

    <!-- Amalaka (Ribbed Crown Stone) -->
    <ellipse cx="600" cy="120" rx="60" ry="18" fill="url(#goldPlate)" stroke="#78350F" stroke-width="2" />
    <ellipse cx="600" cy="116" rx="48" ry="12" fill="#FEF08A" />

    <!-- Sacred Golden Kalash & Pinnacle -->
    <ellipse cx="600" cy="100" rx="22" ry="16" fill="url(#goldPlate)" stroke="#78350F" stroke-width="1.5" />
    <polygon points="590,92 610,92 600,65" fill="url(#goldPlate)" />
    
    <!-- Sacred Saffron Flag (Dhwaja) Billowing in Wind -->
    <polygon points="600,65 655,78 600,92" fill="#F97316" stroke="#C2410C" stroke-width="1.5" />

    <!-- Sacred Golden Trishul (Trident) at Pinnacle -->
    <line x1="600" y1="90" x2="600" y2="40" stroke="#FDE047" stroke-width="3.5" />
    <path d="M 590 52 Q 600 60 610 52 L 610 44 Q 600 50 590 44 Z" fill="#FDE047" stroke="#B45309" stroke-width="1" />
  </g>

  <!-- Small Subsidiary Golden Spire (Silver/Gold domes) -->
  <polygon points="410,380 470,380 455,270 425,270" fill="url(#goldPlate)" stroke="#B45309" stroke-width="1.5" />
  <ellipse cx="440" cy="265" rx="16" ry="6" fill="url(#goldPlate)" />
  <line x1="440" y1="265" x2="440" y2="245" stroke="#FDE047" stroke-width="2" />

  <polygon points="730,380 790,380 775,270 745,270" fill="url(#goldPlate)" stroke="#B45309" stroke-width="1.5" />
  <ellipse cx="760" cy="265" rx="16" ry="6" fill="url(#goldPlate)" />
  <line x1="760" y1="265" x2="760" y2="245" stroke="#FDE047" stroke-width="2" />

  <!-- Temple Gateway & Devotees -->
  <polygon points="540,560 660,560 660,450 540,450" fill="#292321" />
  <path d="M 540 450 Q 600 410 660 450" fill="#292321" />
  <ellipse cx="600" cy="500" rx="30" ry="40" fill="#FEF08A" opacity="0.4" filter="blur(8px)" />

  <!-- Devotees in Silhouette -->
  <g fill="#1F1519">
    <ellipse cx="570" cy="548" rx="7" ry="14" />
    <circle cx="570" cy="530" r="5" />
    <ellipse cx="600" cy="546" rx="8" ry="15" />
    <circle cx="600" cy="528" r="5.5" />
    <ellipse cx="630" cy="549" rx="7" ry="13" />
    <circle cx="630" cy="532" r="5" />
  </g>

  <!-- Heritage Banner Title Overlay -->
  <g transform="translate(60, 48)">
    <rect x="0" y="0" width="460" height="42" rx="6" fill="#821B25" opacity="0.95" />
    <rect x="2" y="2" width="456" height="38" rx="4" fill="none" stroke="#C69A52" stroke-width="1.2" />
    <text x="230" y="26" font-family="'Cinzel', Georgia, serif" font-size="16" font-weight="700" fill="#FFF9F0" text-anchor="middle" letter-spacing="2">
      SHRI KASHI VISHWANATH CORRIDOR
    </text>
  </g>
</svg>`;

// 2. SARNATH DHAMEK STUPA ARTWORK
const sarnathSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
  <defs>
    <linearGradient id="sarnathSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="45%" stop-color="#334155" />
      <stop offset="75%" stop-color="#CA8A04" />
      <stop offset="100%" stop-color="#FEF08A" />
    </linearGradient>
    <linearGradient id="stupaStone" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="35%" stop-color="#B45309" />
      <stop offset="70%" stop-color="#78350F" />
      <stop offset="100%" stop-color="#451A03" />
    </linearGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#sarnathSky)" />

  <!-- Sacred Deer Park Green Lawns -->
  <rect x="0" y="490" width="1200" height="185" fill="#14532D" />
  <path d="M 0 510 Q 600 480 1200 510 L 1200 675 L 0 675 Z" fill="#166534" />

  <!-- The Great Dhamek Stupa (Massive Cylindrical Ancient Monument) -->
  <g id="dhamekStupa">
    <!-- Stupa Foundation Plinth -->
    <rect x="360" y="470" width="480" height="50" rx="4" fill="#78350F" stroke="#451A03" stroke-width="2" />
    
    <!-- Lower Carved Stone Drum -->
    <rect x="390" y="290" width="420" height="180" rx="8" fill="url(#stupaStone)" stroke="#451A03" stroke-width="2.5" />
    <!-- Intricate Floral & Geometric Carving Bands (Gupta Era) -->
    <rect x="395" y="350" width="410" height="25" fill="#92400E" opacity="0.8" />
    <rect x="395" y="410" width="410" height="20" fill="#92400E" opacity="0.8" />
    <!-- Arched Niches for Buddha Statues -->
    <path d="M 450 400 Q 480 370 510 400 L 510 430 L 450 430 Z" fill="#451A03" />
    <path d="M 570 400 Q 600 370 630 400 L 630 430 L 570 430 Z" fill="#451A03" />
    <path d="M 690 400 Q 720 370 750 400 L 750 430 L 690 430 Z" fill="#451A03" />

    <!-- Upper Cylindrical Brick Dome -->
    <path d="M 420 290 Q 600 240 780 290 L 760 140 Q 600 110 440 140 Z" fill="url(#stupaStone)" stroke="#451A03" stroke-width="2" />
    
    <!-- Stupa Top Harmika & Pinnacle Crown -->
    <rect x="540" y="105" width="120" height="25" fill="#92400E" />
    <ellipse cx="600" cy="105" rx="55" ry="12" fill="#B45309" />
  </g>

  <!-- Buddhist Monks in Saffron Robes Meditating -->
  <g fill="#D97706">
    <ellipse cx="280" cy="540" rx="14" ry="22" />
    <circle cx="280" cy="512" r="9" />
    <ellipse cx="320" cy="545" rx="13" ry="20" />
    <circle cx="320" cy="518" r="8.5" />
    <ellipse cx="880" cy="542" rx="14" ry="22" />
    <circle cx="880" cy="514" r="9" />
  </g>

  <!-- Title Banner -->
  <g transform="translate(60, 48)">
    <rect x="0" y="0" width="460" height="42" rx="6" fill="#821B25" opacity="0.95" />
    <rect x="2" y="2" width="456" height="38" rx="4" fill="none" stroke="#C69A52" stroke-width="1.2" />
    <text x="230" y="26" font-family="'Cinzel', Georgia, serif" font-size="16" font-weight="700" fill="#FFF9F0" text-anchor="middle" letter-spacing="2">
      SARNATH DHAMEK STUPA &amp; DEER PARK
    </text>
  </g>
</svg>`;

// 3. PRAYAGRAJ TRIVENI SANGAM ARTWORK
const sangamSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
  <defs>
    <linearGradient id="sangamSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284C7" />
      <stop offset="50%" stop-color="#38BDF8" />
      <stop offset="85%" stop-color="#BAE6FD" />
      <stop offset="100%" stop-color="#FEF08A" />
    </linearGradient>
    <!-- Deep Greenish-Blue Yamuna Water -->
    <linearGradient id="yamunaWater" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F766E" />
      <stop offset="60%" stop-color="#0E7490" />
      <stop offset="100%" stop-color="#0369A1" />
    </linearGradient>
    <!-- Silt-Rich Golden Pale Ganga Water -->
    <linearGradient id="gangaWater" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#CA8A04" />
      <stop offset="50%" stop-color="#EAB308" />
      <stop offset="100%" stop-color="#FEF08A" />
    </linearGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#sangamSky)" />

  <!-- Sacred Confluence Waters: Confluence Line dividing Yamuna and Ganga -->
  <!-- Left Side: Deep Blue-Green Yamuna -->
  <path d="M 0 350 Q 300 370 560 480 L 0 675 Z" fill="url(#yamunaWater)" />
  <!-- Right Side: Sacred Pale Silt Ganga -->
  <path d="M 0 350 Q 550 360 1200 350 L 1200 675 L 0 675 Z" fill="url(#gangaWater)" opacity="0.85" />
  <!-- Confluence Swirl Center Point -->
  <ellipse cx="600" cy="510" rx="340" ry="60" fill="#0284C7" opacity="0.35" filter="blur(10px)" />

  <!-- Iconic Wooden Pilgrimage Boats at the Sangam Confluence -->
  <g transform="translate(480, 460)">
    <!-- Main Boat -->
    <path d="M -90 30 Q 0 55 120 30 L 105 10 L -75 10 Z" fill="#78350F" stroke="#451A03" stroke-width="2" />
    <!-- Saffron & Red Boat Canopy -->
    <polygon points="-50,10 80,10 65,-25 -35,-25" fill="#EA580C" />
    <line x1="-35" y1="10" x2="-35" y2="-25" stroke="#FDE047" stroke-width="2" />
    <line x1="65" y1="10" x2="65" y2="-25" stroke="#FDE047" stroke-width="2" />
    <!-- Pilgrims on Boat with hands raised -->
    <circle cx="-10" cy="2" r="6" fill="#1C1917" />
    <circle cx="20" cy="0" r="6" fill="#1C1917" />
  </g>

  <!-- Secondary Boats in Distance -->
  <g transform="translate(820, 410) scale(0.65)">
    <path d="M -90 30 Q 0 55 120 30 L 105 10 L -75 10 Z" fill="#78350F" />
    <polygon points="-50,10 80,10 65,-25 -35,-25" fill="#DC2626" />
  </g>
  <g transform="translate(260, 430) scale(0.65)">
    <path d="M -90 30 Q 0 55 120 30 L 105 10 L -75 10 Z" fill="#78350F" />
    <polygon points="-50,10 80,10 65,-25 -35,-25" fill="#F59E0B" />
  </g>

  <!-- Flock of Migratory Siberian Seagulls Flying over Sangam -->
  <g stroke="#FFFFFF" stroke-width="2.5" fill="none">
    <path d="M 450 210 Q 465 195 480 210 Q 495 195 510 210" />
    <path d="M 520 230 Q 532 218 544 230 Q 556 218 568 230" />
    <path d="M 590 190 Q 608 172 626 190 Q 644 172 662 190" />
    <path d="M 680 220 Q 692 208 704 220 Q 716 208 728 220" />
    <path d="M 740 250 Q 750 240 760 250 Q 770 240 780 250" />
  </g>

  <!-- Title Banner -->
  <g transform="translate(60, 48)">
    <rect x="0" y="0" width="460" height="42" rx="6" fill="#821B25" opacity="0.95" />
    <rect x="2" y="2" width="456" height="38" rx="4" fill="none" stroke="#C69A52" stroke-width="1.2" />
    <text x="230" y="26" font-family="'Cinzel', Georgia, serif" font-size="16" font-weight="700" fill="#FFF9F0" text-anchor="middle" letter-spacing="2">
      PRAYAGRAJ TRIVENI SANGAM DARSHAN
    </text>
  </g>
</svg>`;

// 4. AYODHYA SHRI RAM MANDIR ARTWORK
const ayodhyaSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
  <defs>
    <linearGradient id="ayodhyaSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#431407" />
      <stop offset="35%" stop-color="#9A3412" />
      <stop offset="70%" stop-color="#EA580C" />
      <stop offset="100%" stop-color="#FED7AA" />
    </linearGradient>
    <!-- Pink Bansi Paharpur Sandstone Gradient -->
    <linearGradient id="pinkSandstone" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FED7AA" />
      <stop offset="30%" stop-color="#FDBA74" />
      <stop offset="60%" stop-color="#FB923C" />
      <stop offset="100%" stop-color="#C2410C" />
    </linearGradient>
    <radialGradient id="sunAura" cx="50%" cy="28%" r="45%">
      <stop offset="0%" stop-color="#FFFBEB" stop-opacity="0.9" />
      <stop offset="30%" stop-color="#FDE047" stop-opacity="0.7" />
      <stop offset="70%" stop-color="#EA580C" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#9A3412" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#ayodhyaSky)" />
  <circle cx="600" cy="230" r="340" fill="url(#sunAura)" />

  <!-- Temple Plinth & Courtyard Ground -->
  <rect x="0" y="540" width="1200" height="135" fill="#7C2D12" />
  <rect x="120" y="500" width="960" height="50" rx="4" fill="url(#pinkSandstone)" stroke="#7C2D12" stroke-width="2" />

  <!-- Shri Ram Janmabhoomi Mandir Architecture (Nagara Style 3-Storeyed) -->
  <g id="ramMandirArchitecture">
    <!-- Ground Floor Mandapa (Columns & Pillars) -->
    <rect x="220" y="420" width="760" height="90" fill="url(#pinkSandstone)" stroke="#9A3412" stroke-width="2" />
    <!-- First Floor (Rang Mandap & Nritya Mandap) -->
    <rect x="300" y="340" width="600" height="85" fill="url(#pinkSandstone)" stroke="#9A3412" stroke-width="2" />
    <!-- Second Floor -->
    <rect x="380" y="270" width="440" height="75" fill="url(#pinkSandstone)" stroke="#9A3412" stroke-width="2" />

    <!-- Carved Nagara Spire Pillars on Mandapas -->
    <!-- Left Mandap Domes -->
    <polygon points="250,420 340,420 310,310 280,310" fill="url(#pinkSandstone)" stroke="#9A3412" stroke-width="1.5" />
    <ellipse cx="295" cy="305" rx="20" ry="7" fill="#FDBA74" />
    <line x1="295" y1="305" x2="295" y2="285" stroke="#FDE047" stroke-width="2" />

    <!-- Right Mandap Domes -->
    <polygon points="860,420 950,420 920,310 890,310" fill="url(#pinkSandstone)" stroke="#9A3412" stroke-width="1.5" />
    <ellipse cx="905" cy="305" rx="20" ry="7" fill="#FDBA74" />
    <line x1="905" y1="305" x2="905" y2="285" stroke="#FDE047" stroke-width="2" />

    <!-- Grand Garbhagriha Main Shikhara (Height 161 Feet in Scale) -->
    <polygon points="460,270 740,270 710,180 490,180" fill="url(#pinkSandstone)" stroke="#7C2D12" stroke-width="2" />
    <polygon points="495,180 705,180 670,105 530,105" fill="url(#pinkSandstone)" stroke="#7C2D12" stroke-width="2" />
    
    <!-- Amalaka Ribbed Crown -->
    <ellipse cx="600" cy="100" rx="45" ry="12" fill="#FDE047" stroke="#7C2D12" stroke-width="2" />
    <!-- Sacred Kalash -->
    <ellipse cx="600" cy="85" rx="18" ry="12" fill="#FDE047" stroke="#9A3412" stroke-width="1.5" />
    <polygon points="592,78 608,78 600,50" fill="#FDE047" />

    <!-- Grand Sacred Saffron Dhwaja (Sun Dynasty Raghuwansh Flag) -->
    <polygon points="600,50 670,68 600,82" fill="#F97316" stroke="#C2410C" stroke-width="2" />
    <circle cx="625" cy="66" r="6" fill="#FDE047" /> <!-- Surya Symbol on Flag -->
  </g>

  <!-- Title Banner -->
  <g transform="translate(60, 48)">
    <rect x="0" y="0" width="460" height="42" rx="6" fill="#821B25" opacity="0.95" />
    <rect x="2" y="2" width="456" height="38" rx="4" fill="none" stroke="#C69A52" stroke-width="1.2" />
    <text x="230" y="26" font-family="'Cinzel', Georgia, serif" font-size="16" font-weight="700" fill="#FFF9F0" text-anchor="middle" letter-spacing="2">
      AYODHYA SHRI RAM JANMABHOOMI DARSHAN
    </text>
  </g>
</svg>`;

// Write tour package assets
fs.writeFileSync(path.join(VARANASI_DIR, 'kashi-vishwanath-corridor.svg'), kashiVishwanathSvg);
fs.writeFileSync(path.join(VARANASI_DIR, 'kashi-vishwanath-corridor.png'), kashiVishwanathSvg);

fs.writeFileSync(path.join(VARANASI_DIR, 'sarnath-dhamek-stupa.svg'), sarnathSvg);
fs.writeFileSync(path.join(VARANASI_DIR, 'sarnath-dhamek-stupa.png'), sarnathSvg);

fs.writeFileSync(path.join(VARANASI_DIR, 'prayagraj-triveni-sangam.svg'), sangamSvg);
fs.writeFileSync(path.join(VARANASI_DIR, 'prayagraj-triveni-sangam.png'), sangamSvg);

fs.writeFileSync(path.join(VARANASI_DIR, 'ayodhya-ram-mandir.svg'), ayodhyaSvg);
fs.writeFileSync(path.join(VARANASI_DIR, 'ayodhya-ram-mandir.png'), ayodhyaSvg);

console.log('Successfully generated all tour package artwork!');
