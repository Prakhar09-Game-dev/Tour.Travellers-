import React, { useEffect, useRef } from 'react';

export type SunPhase = 'dawn' | 'rising' | 'day' | 'sunset';

interface GangaRiverBackgroundProps {
  sunPhase: SunPhase;
  onCycleSunPhase?: () => void;
  className?: string;
  isFixed?: boolean;
}

// Color palettes for atmospheric sky and holy water reflection
const SKY_PALETTES = {
  dawn: {
    top: '#24060A',
    mid: '#631E0D',
    horizon: '#D9531E',
    glow: '#F59E0B',
    sunColor: '#F97316',
    sunAura: 'rgba(245, 158, 11, 0.55)',
    sunAuraOuter: 'rgba(217, 83, 30, 0.2)',
    waterTop: '#4E190A',
    waterMid: '#381308',
    waterDeep: '#111827',
    reflectionColor: 'rgba(245, 158, 11, 0.45)',
    causticColor: 'rgba(254, 240, 138, 0.35)',
    sunYOffset: 12, // Right at horizon edge
    sunRadius: 36,
  },
  rising: {
    top: '#3E1005',
    mid: '#87270D',
    horizon: '#EA580C',
    glow: '#FEF08A',
    sunColor: '#FEF08A',
    sunAura: 'rgba(254, 240, 138, 0.75)',
    sunAuraOuter: 'rgba(245, 158, 11, 0.35)',
    waterTop: '#68220A',
    waterMid: '#4D1A0A',
    waterDeep: '#0F172A',
    reflectionColor: 'rgba(254, 240, 138, 0.65)',
    causticColor: 'rgba(254, 249, 195, 0.5)',
    sunYOffset: -65, // Ascending in morning glow
    sunRadius: 44,
  },
  day: {
    top: '#4E1508',
    mid: '#9A3412',
    horizon: '#D9531E',
    glow: '#FBBF24',
    sunColor: '#FFFBEB',
    sunAura: 'rgba(254, 240, 138, 0.6)',
    sunAuraOuter: 'rgba(245, 158, 11, 0.25)',
    waterTop: '#5C1D08',
    waterMid: '#3D1508',
    waterDeep: '#0A1120',
    reflectionColor: 'rgba(254, 240, 138, 0.55)',
    causticColor: 'rgba(56, 189, 248, 0.35)',
    sunYOffset: -105, // High in radiant midday sky
    sunRadius: 40,
  },
  sunset: {
    top: '#1E0B1A',
    mid: '#5B0E1E',
    horizon: '#C2410C',
    glow: '#F97316',
    sunColor: '#EA580C',
    sunAura: 'rgba(234, 88, 12, 0.85)',
    sunAuraOuter: 'rgba(107, 17, 35, 0.4)',
    waterTop: '#3D0F18',
    waterMid: '#240A10',
    waterDeep: '#0B0509',
    reflectionColor: 'rgba(234, 88, 12, 0.75)',
    causticColor: 'rgba(251, 146, 60, 0.45)',
    sunYOffset: 16, // Dipping into holy waters
    sunRadius: 46,
  },
};

export const GangaRiverBackground: React.FC<GangaRiverBackgroundProps> = ({
  sunPhase,
  onCycleSunPhase,
  className = '',
  isFixed = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  // Smooth interpolation state for natural sunrise and sunset transitions
  const currentSunYRef = useRef<number>(200);
  const currentSunRadiusRef = useRef<number>(36);
  const currentAuraAlphaRef = useRef<number>(0.5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = isFixed ? window.innerWidth : canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = isFixed ? window.innerHeight : canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    // Authentic traditional Varanasi wooden boats (bajras / naavs)
    const boats = [
      {
        x: width * 0.14,
        baseY: 0.66,
        size: 0.85,
        phase: 0,
        speed: 0.22,
        hasSails: false,
        name: 'Kashi Naav 1',
        oarAngle: 0,
        hasLantern: true,
      },
      {
        x: width * 0.42,
        baseY: 0.73,
        size: 1.18,
        phase: 1.8,
        speed: -0.16,
        hasSails: true,
        name: 'Ganga Bajra',
        oarAngle: 0,
        hasLantern: true,
      },
      {
        x: width * 0.72,
        baseY: 0.68,
        size: 0.92,
        phase: 3.5,
        speed: 0.18,
        hasSails: false,
        name: 'Assi Shikara',
        oarAngle: 0,
        hasLantern: false,
      },
      {
        x: width * 0.88,
        baseY: 0.76,
        size: 0.78,
        phase: 5.1,
        speed: 0.14,
        hasSails: false,
        name: 'Dashashwamedh Naav',
        oarAngle: 0,
        hasLantern: true,
      },
      {
        x: width * 0.28,
        baseY: 0.84,
        size: 1.35,
        phase: 2.7,
        speed: -0.25,
        hasSails: true,
        name: 'Ghat Chhatri Bajra',
        oarAngle: 0,
        hasLantern: true,
      },
    ];

    // Floating sacred earthen Diyas with flower petals during sunset Aarti
    const diyas = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      yFraction: 0.62 + Math.random() * 0.36,
      speed: 0.25 + Math.random() * 0.45,
      size: 3 + Math.random() * 3.5,
      sparkle: Math.random() * Math.PI * 2,
      driftAngle: Math.random() * 0.3,
    }));

    const render = () => {
      time += 0.022;
      ctx.clearRect(0, 0, width, height);

      // Horizon line separating Varanasi sky from Holy River Ganga
      const horizonY = isFixed ? Math.min(height * 0.42, 380) : height * 0.58;

      const palette = SKY_PALETTES[sunPhase] || SKY_PALETTES.dawn;

      // 1. DYNAMIC LIVING SKY GRADIENT
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, palette.top);
      skyGrad.addColorStop(0.42, palette.mid);
      skyGrad.addColorStop(0.82, palette.horizon);
      skyGrad.addColorStop(1, palette.glow);

      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY);

      // 2. DISTANT VARANASI GHAT SILHOUETTE (Temple Spires & Chhatris on Horizon)
      ctx.save();
      ctx.fillStyle = sunPhase === 'sunset' ? 'rgba(30, 11, 26, 0.7)' : 'rgba(45, 10, 14, 0.45)';
      ctx.beginPath();
      ctx.moveTo(0, horizonY);

      // Distant ghat stone stairs and temple shikhara outlines
      for (let gx = 0; gx <= width; gx += 35) {
        let gh = 4 + Math.sin(gx * 0.02) * 3;
        // Temple spires at specific intervals
        if (Math.abs(gx - width * 0.22) < 20 || Math.abs(gx - width * 0.65) < 25 || Math.abs(gx - width * 0.85) < 18) {
          gh = 16 + Math.sin(gx * 0.1) * 8; // Shikhara spire
        }
        ctx.lineTo(gx, horizonY - gh);
      }
      ctx.lineTo(width, horizonY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 3. THE SACRED SUN (Smooth physical interpolation between dawn, rising, and sunset)
      const targetSunY = horizonY + palette.sunYOffset;
      const targetSunRadius = palette.sunRadius;

      currentSunYRef.current += (targetSunY - currentSunYRef.current) * 0.035;
      currentSunRadiusRef.current += (targetSunRadius - currentSunRadiusRef.current) * 0.035;

      const sunX = width * 0.58;
      const curSunY = currentSunYRef.current;
      const curRadius = currentSunRadiusRef.current;

      // Sun Atmospheric Aura Rays (Golden Radiance)
      const sunAuraRadius = 220;
      const sunAura = ctx.createRadialGradient(sunX, curSunY, 12, sunX, curSunY, sunAuraRadius);
      sunAura.addColorStop(0, palette.sunAura);
      sunAura.addColorStop(0.38, palette.sunAuraOuter);
      sunAura.addColorStop(0.75, 'rgba(217, 83, 30, 0.08)');
      sunAura.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = sunAura;
      ctx.beginPath();
      ctx.arc(sunX, curSunY, sunAuraRadius, 0, Math.PI * 2);
      ctx.fill();

      // Sun Disc
      ctx.beginPath();
      ctx.arc(sunX, curSunY, curRadius, 0, Math.PI * 2);
      ctx.fillStyle = palette.sunColor;
      ctx.shadowColor = palette.glow;
      ctx.shadowBlur = 40;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 4. HOLY RIVER GANGA WATER BODY (Uttaravahini Deep Sacred River)
      const waterGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      waterGrad.addColorStop(0, palette.waterTop);
      waterGrad.addColorStop(0.28, palette.waterMid);
      waterGrad.addColorStop(0.75, palette.waterDeep);
      waterGrad.addColorStop(1, '#050B14');

      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // 5. VERTICAL SUNBEAM REFLECTION PATH ON WATER (Liquid Gold Column)
      const beamHalfWidth = Math.max(120, width * 0.12);
      const beamGrad = ctx.createLinearGradient(sunX - beamHalfWidth, 0, sunX + beamHalfWidth, 0);
      beamGrad.addColorStop(0, 'rgba(245, 158, 11, 0)');
      beamGrad.addColorStop(0.3, palette.reflectionColor);
      beamGrad.addColorStop(0.5, sunPhase === 'sunset' ? 'rgba(251, 146, 60, 0.7)' : 'rgba(254, 240, 138, 0.75)');
      beamGrad.addColorStop(0.7, palette.reflectionColor);
      beamGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');

      ctx.fillStyle = beamGrad;
      ctx.fillRect(sunX - beamHalfWidth, horizonY, beamHalfWidth * 2, height - horizonY);

      // 6. LIVING FLOWING GANGA WAVE CURRENTS & SHIMMERING CAUSTICS
      const waveCount = 22;
      for (let i = 0; i < waveCount; i++) {
        const rowFraction = i / waveCount;
        const rowY = horizonY + rowFraction * (height - horizonY);
        const waveAmp = 2.0 + rowFraction * 7.5;
        const waveSpeed = 0.75 + i * 0.08;
        const alpha = 0.12 + rowFraction * 0.38;

        // Wave Current Layer 1: Liquid Sun Crests
        ctx.beginPath();
        for (let x = 0; x <= width; x += 18) {
          const y = rowY + Math.sin(x * 0.012 - time * waveSpeed + i * 1.4) * waveAmp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.8})`;
        ctx.lineWidth = 1.0 + rowFraction * 1.8;
        ctx.stroke();

        // Wave Current Layer 2: Holy Ganga River Cyan/Azure Refraction
        ctx.beginPath();
        for (let x = 0; x <= width; x += 22) {
          const y = rowY + Math.cos(x * 0.016 + time * 0.55 + i * 0.9) * (waveAmp * 0.65);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.32})`;
        ctx.lineWidth = 0.85 + rowFraction * 1.1;
        ctx.stroke();

        // Wave Layer 3: Caustic Glints on Sun Path
        if (Math.abs(sunX - (width * 0.58)) < beamHalfWidth) {
          const glintCount = 5;
          for (let g = 0; g < glintCount; g++) {
            const gx = sunX - beamHalfWidth * 0.7 + (g / glintCount) * beamHalfWidth * 1.4 + Math.sin(time + g) * 15;
            const gy = rowY + Math.sin(gx * 0.02 + time * 2) * (waveAmp * 0.5);
            ctx.beginPath();
            ctx.ellipse(gx, gy, 8 + rowFraction * 12, 1.2 + rowFraction * 1.8, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(254, 249, 195, ${alpha * 0.9})`;
            ctx.fill();
          }
        }
      }

      // 7. AUTHENTIC TRADITIONAL WOODEN GANGA BOATS (BOBBING & DRIFTING)
      boats.forEach(b => {
        b.x += b.speed;
        if (b.x > width + 120) b.x = -120;
        if (b.x < -120) b.x = width + 120;

        const boatY = horizonY + b.baseY * (height - horizonY);
        const bobY = boatY + Math.sin(time * 1.7 + b.phase) * 4.5;
        const pitchAngle = Math.cos(time * 1.7 + b.phase) * 0.045;
        b.oarAngle = Math.sin(time * 2.2 + b.phase) * 0.35;

        ctx.save();
        ctx.translate(b.x, bobY);
        ctx.rotate(pitchAngle);
        ctx.scale(b.size, b.size);

        // V-Shaped Boat Wake in Water
        ctx.beginPath();
        const wakeDir = b.speed > 0 ? -1 : 1;
        ctx.moveTo(0, 10);
        ctx.lineTo(wakeDir * 55, 18);
        ctx.moveTo(0, 10);
        ctx.lineTo(wakeDir * 45, 6);
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.25)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Boat Hull (Carved Sal/Teak Wood naav with elegant curve)
        ctx.fillStyle = '#220E08';
        ctx.beginPath();
        ctx.moveTo(-48, 0);
        ctx.quadraticCurveTo(0, 18, 52, 0);
        ctx.lineTo(44, -6);
        ctx.quadraticCurveTo(0, 6, -40, -6);
        ctx.closePath();
        ctx.fill();

        // Wooden Hull Planking Trim
        ctx.strokeStyle = '#D9531E';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Boat Interior Floor Ribs
        ctx.strokeStyle = '#7C2D12';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(-20, -2);
        ctx.lineTo(-20, 8);
        ctx.moveTo(0, -2);
        ctx.lineTo(0, 11);
        ctx.moveTo(20, -2);
        ctx.lineTo(20, 8);
        ctx.stroke();

        // Boat Rowing Oars (Animated stroke dipping into the holy water)
        ctx.save();
        ctx.translate(-8, 2);
        ctx.rotate(b.oarAngle);
        ctx.strokeStyle = '#9A3412';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(16, 26);
        ctx.stroke();
        // Oar Blade
        ctx.fillStyle = '#D9531E';
        ctx.beginPath();
        ctx.ellipse(16, 26, 4, 1.8, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Boat Mast Pole
        ctx.beginPath();
        ctx.moveTo(-10, -5);
        ctx.lineTo(-10, -35);
        ctx.strokeStyle = '#5B1A0A';
        ctx.lineWidth = 2.4;
        ctx.stroke();

        // Sacred Saffron Flag on Mast (Waving in River Breeze)
        const flagWave = Math.sin(time * 3 + b.phase) * 3;
        ctx.beginPath();
        ctx.moveTo(-10, -35);
        ctx.lineTo(10 + flagWave, -28);
        ctx.lineTo(-10, -21);
        ctx.closePath();
        ctx.fillStyle = '#EA580C';
        ctx.fill();

        // Brass Lantern on Bow (Glowing warm light)
        if (b.hasLantern) {
          ctx.beginPath();
          ctx.arc(42, -9, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#FEF08A';
          ctx.shadowColor = '#F59E0B';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Boat Cloth Canopy Awning (Chhatri for passengers)
        if (b.hasSails) {
          ctx.beginPath();
          ctx.moveTo(-28, -6);
          ctx.quadraticCurveTo(0, -26, 28, -6);
          ctx.lineTo(24, -22);
          ctx.quadraticCurveTo(0, -30, -24, -22);
          ctx.closePath();
          ctx.fillStyle = '#B45309';
          ctx.fill();
          ctx.strokeStyle = '#FEF08A';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Boat Reflection Ripple in Water
        ctx.beginPath();
        ctx.ellipse(0, 14, 45, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10, 4, 8, 0.45)';
        ctx.fill();

        ctx.restore();
      });

      // 8. FLOATING SACRED DIYAS (Evening Aarti Lamps during Sunset Phase)
      if (sunPhase === 'sunset') {
        diyas.forEach(d => {
          d.x += d.speed;
          if (d.x > width + 60) d.x = -60;
          d.sparkle += 0.09;

          const diyaY = horizonY + d.yFraction * (height - horizonY) + Math.sin(time * 2 + d.driftAngle) * 3;
          const flameGlow = 0.65 + Math.sin(d.sparkle) * 0.35;

          // Clay / Marigold Leaf Cup
          ctx.beginPath();
          ctx.ellipse(d.x, diyaY, d.size * 1.5, d.size * 0.65, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#78350F';
          ctx.fill();

          // Marigold Flower Ring Petals
          ctx.beginPath();
          ctx.arc(d.x, diyaY, d.size * 1.1, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(234, 88, 12, 0.7)';
          ctx.fill();

          // Golden Sacred Aarti Flame
          ctx.beginPath();
          ctx.arc(d.x, diyaY - 3, d.size * 0.75, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(254, 240, 138, ${flameGlow})`;
          ctx.shadowColor = '#F59E0B';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Water Reflection under Diya
          ctx.beginPath();
          ctx.ellipse(d.x, diyaY + 4, d.size * 2.2, d.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 158, 11, ${flameGlow * 0.5})`;
          ctx.fill();
        });
      }

      const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        animRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [sunPhase, isFixed]);

  return (
    <div className={`relative w-full overflow-hidden select-none pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Sun Cycle Interactive Controller (Permits user to experience Dawn, Rising, & Sunset Aarti anytime!) */}
      {onCycleSunPhase && !isFixed && (
        <button
          onClick={onCycleSunPhase}
          className="pointer-events-auto absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/25 text-white text-[11px] font-bold flex items-center gap-2 transition-all shadow-lg cursor-pointer hover:scale-105 active:scale-95"
          title="Click to cycle Sun & River Ganga time of day (Dawn -> Sunrise -> Day -> Sunset)"
        >
          <span>
            {sunPhase === 'dawn' && '🌅 Dawn (उषाकाल)'}
            {sunPhase === 'rising' && '☀️ Sunrise (सूर्योदय)'}
            {sunPhase === 'day' && '🌞 Midday (दोपहर)'}
            {sunPhase === 'sunset' && '🌇 Sunset Aarti (संध्या आरती)'}
          </span>
          <span className="text-[10px] text-[#FEF08A] bg-white/20 px-2 py-0.5 rounded-full font-extrabold">
            Cycle Time ↺
          </span>
        </button>
      )}
    </div>
  );
};
