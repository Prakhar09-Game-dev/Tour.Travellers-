import React, { useEffect, useRef } from 'react';

interface FlowPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  width: number;
  waveOffset: number;
}

interface WaterDrop {
  x: number;
  y: number;
  initialY: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  gravity: number;
}

interface TouchRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number; // Amplitude
  decay: number;
  speed: number;
  colorType: 'caustic' | 'deep' | 'sun';
}

interface WakeVortex {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  spin: number;
}

export const GangaWaterCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const flowPointsRef = useRef<FlowPoint[]>([]);
  const ripplesRef = useRef<TouchRipple[]>([]);
  const dropsRef = useRef<WaterDrop[]>([]);
  const vorticesRef = useRef<WakeVortex[]>([]);
  const lastMousePosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);
  const timeRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesize realistic soft water droplet splash sound using Web Audio API
  const playWaterDropSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Gentle pitch glide: rapid downward chirp like a water drop plop (680Hz -> 240Hz)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(640 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(220 + Math.random() * 40, now + 0.045);

      // Organic low-pass gentle volume (imperceptible, delicate, ~0.06 volume)
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch {
      // Audio autoplay policy or not supported - seamlessly continue
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 0.035;
      const t = timeRef.current;

      const flowPoints = flowPointsRef.current;
      const ripples = ripplesRef.current;
      const drops = dropsRef.current;
      const vortices = vorticesRef.current;

      // 1. PHYSICAL 2D WATER RIPPLES & CONCENTRIC REFRACTIONS (Touch / Click disturbance)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.radius += rp.speed;
        rp.strength *= rp.decay;

        if (rp.strength <= 0.008 || rp.radius >= rp.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        const ringAlpha = Math.min(1, rp.strength);

        // Outer Refractive Wave Crest (Holy Ganga Azure Water Meniscus)
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha * 0.7})`;
        ctx.lineWidth = Math.max(1.2, 4.2 * rp.strength);
        ctx.stroke();

        // Inner Caustic Glint Ring (Sunlight Refraction Peak)
        if (rp.radius > 4) {
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, Math.max(1, rp.radius - 3.5), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(254, 240, 138, ${ringAlpha * 0.85})`;
          ctx.lineWidth = Math.max(0.8, 2.2 * rp.strength);
          ctx.stroke();
        }

        // Wave Trough Shadow Ring (Gives optical physical depth to the water)
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius + 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(15, 23, 42, ${ringAlpha * 0.28})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.restore();
      }

      // 2. WATER SPLASH DROPLETS (Parabolic 3D arcs with micro secondary splash ripples)
      for (let i = drops.length - 1; i >= 0; i--) {
        const dp = drops[i];
        dp.x += dp.vx;
        dp.y += dp.vy;
        dp.vy += dp.gravity;
        dp.alpha -= 0.02;

        // Droplet hits water surface plane: triggers delicate micro-ripple
        if (dp.vy > 0 && dp.y >= dp.initialY + 6 && Math.random() < 0.25) {
          ripples.push({
            x: dp.x,
            y: dp.y,
            radius: 1,
            maxRadius: 28,
            strength: 0.35,
            decay: 0.94,
            speed: 1.4,
            colorType: 'caustic',
          });
          drops.splice(i, 1);
          continue;
        }

        if (dp.alpha <= 0) {
          drops.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(dp.x, dp.y, dp.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 249, 195, ${dp.alpha * 0.95})`;
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // 3. WAKE VORTICES (Water eddies & micro-bubbles swirling behind the cursor flow)
      for (let i = vortices.length - 1; i >= 0; i--) {
        const vx = vortices[i];
        vx.x += vx.vx;
        vx.y += vx.vy;
        vx.vx *= 0.92;
        vx.vy *= 0.92;
        vx.alpha -= 0.025;
        vx.radius += 0.2;

        if (vx.alpha <= 0) {
          vortices.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(vx.x, vx.y, vx.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(224, 242, 254, ${vx.alpha * 0.65})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Tiny center glint
        ctx.beginPath();
        ctx.arc(vx.x, vx.y, vx.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 240, 138, ${vx.alpha * 0.8})`;
        ctx.fill();
        ctx.restore();
      }

      // 4. CONTINUOUS LIVING HYDRODYNAMIC WATER STREAM (Cursor flow)
      for (let i = flowPoints.length - 1; i >= 0; i--) {
        const pt = flowPoints[i];
        pt.age += 0.024; // Natural smooth dissipation

        // Fluid lateral oscillation simulating wave currents
        pt.x += pt.vx * 0.35 + Math.sin(t * 1.5 + pt.waveOffset) * 0.65;
        pt.y += pt.vy * 0.35 + Math.cos(t * 1.5 + pt.waveOffset) * 0.65;
        pt.vx *= 0.93;
        pt.vy *= 0.93;

        if (pt.age >= 1) {
          flowPoints.splice(i, 1);
        }
      }

      if (flowPoints.length >= 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Layer A: Deep Holy Ganga Cerulean Fluid Body
        for (let i = 0; i < flowPoints.length - 1; i++) {
          const p1 = flowPoints[i];
          const p2 = flowPoints[i + 1];
          const alpha = (1 - p1.age) * 0.42;
          const xc = (p1.x + p2.x) / 2;
          const yc = (p1.y + p2.y) / 2;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
          ctx.strokeStyle = `rgba(14, 116, 144, ${alpha})`;
          ctx.lineWidth = Math.max(2, p1.width * (1 - p1.age * 0.65));
          ctx.stroke();
        }

        // Layer B: Turquoise Meniscus Wave Refraction
        for (let i = 0; i < flowPoints.length - 1; i++) {
          const p1 = flowPoints[i];
          const p2 = flowPoints[i + 1];
          const alpha = (1 - p1.age) * 0.72;
          const xc = (p1.x + p2.x) / 2;
          const yc = (p1.y + p2.y) / 2;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = Math.max(1.2, p1.width * 0.65 * (1 - p1.age * 0.8));
          ctx.stroke();
        }

        // Layer C: Liquid Gold Sunlight Shimmer on the Water Current
        for (let i = 0; i < flowPoints.length - 1; i++) {
          const p1 = flowPoints[i];
          const p2 = flowPoints[i + 1];
          const alpha = (1 - p1.age) * 0.88;
          const xc = (p1.x + p2.x) / 2;
          const yc = (p1.y + p2.y) / 2;
          const displacement = Math.sin(i * 0.5 + t * 2.2) * 2.2;

          ctx.beginPath();
          ctx.moveTo(p1.x + displacement, p1.y + displacement);
          ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
          ctx.strokeStyle = `rgba(254, 240, 138, ${alpha})`;
          ctx.lineWidth = Math.max(0.7, p1.width * 0.3 * (1 - p1.age));
          ctx.stroke();
        }

        // Layer D: Radiant Golden Sparkle Crests
        for (let i = 0; i < flowPoints.length - 1; i += 2) {
          const p = flowPoints[i];
          if (p.age < 0.6 && Math.random() < 0.35) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(1, (1 - p.age) * 2.2), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${(1 - p.age) * 0.9})`;
            ctx.shadowColor = '#F59E0B';
            ctx.shadowBlur = 4;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }

        ctx.restore();
      }

      if (flowPoints.length > 0 || ripples.length > 0 || drops.length > 0 || vortices.length > 0) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        isRunningRef.current = false;
      }
    };

    const startAnimationLoop = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    // PHYSICAL TOUCH / CLICK WATER DISTURBANCE TRIGGER
    const triggerWaterTouch = (x: number, y: number) => {
      // 1. Play realistic water droplet audio cue
      playWaterDropSound();

      // 2. Mobile haptic feedback if available
      try {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(12);
        }
      } catch {
        // ignore
      }

      // 3. Primary expanding water wave ring
      ripplesRef.current.push({
        x,
        y,
        radius: 4,
        maxRadius: 135,
        strength: 0.98,
        decay: 0.962,
        speed: 2.6,
        colorType: 'caustic',
      });

      // 4. Secondary reverberation wave (Surface tension rebound after 70ms)
      setTimeout(() => {
        ripplesRef.current.push({
          x,
          y,
          radius: 2,
          maxRadius: 100,
          strength: 0.72,
          decay: 0.958,
          speed: 2.2,
          colorType: 'sun',
        });
        startAnimationLoop();
      }, 70);

      // 5. Tertiary reverberation wave after 140ms
      setTimeout(() => {
        ripplesRef.current.push({
          x,
          y,
          radius: 1,
          maxRadius: 75,
          strength: 0.45,
          decay: 0.95,
          speed: 1.8,
          colorType: 'deep',
        });
        startAnimationLoop();
      }, 140);

      // 6. Water splash droplets arcing in 3D physics
      const dropCount = 14;
      for (let i = 0; i < dropCount; i++) {
        const angle = (Math.PI * 2 * i) / dropCount + (Math.random() - 0.5) * 0.6;
        const speed = 1.8 + Math.random() * 4.2;
        dropsRef.current.push({
          x,
          y,
          initialY: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.2, // Upward initial splash
          radius: 1.4 + Math.random() * 2.2,
          alpha: 0.95,
          gravity: 0.16,
        });
      }

      startAnimationLoop();
    };

    const handlePointerMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();

      if (!lastMousePosRef.current) {
        lastMousePosRef.current = { x, y, time: now };
        return;
      }

      const dx = x - lastMousePosRef.current.x;
      const dy = y - lastMousePosRef.current.y;
      const dt = Math.max(1, now - lastMousePosRef.current.time);
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (flowPointsRef.current.length > 70) {
        flowPointsRef.current.shift();
      }

      // Dynamic water ribbon width based on hand/paddle displacement speed
      const ribbonWidth = Math.min(26, Math.max(7, speed * 0.55));
      flowPointsRef.current.push({
        x,
        y,
        vx: dx * 0.16,
        vy: dy * 0.16,
        age: 0,
        width: ribbonWidth,
        waveOffset: Math.random() * Math.PI * 2,
      });

      // Shed wake vortices & micro-bubbles behind cursor motion
      if (speed > 8 && Math.random() < 0.45) {
        vorticesRef.current.push({
          x: x - dx * 0.4 + (Math.random() - 0.5) * 6,
          y: y - dy * 0.4 + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: 2 + Math.random() * 3,
          alpha: 0.85,
          spin: (Math.random() - 0.5) * 0.2,
        });
      }

      lastMousePosRef.current = { x, y, time: now };
      startAnimationLoop();
    };

    const handleClick = (e: MouseEvent) => {
      triggerWaterTouch(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        for (let i = 0; i < e.touches.length; i++) {
          const t = e.touches[i];
          triggerWaterTouch(t.clientX, t.clientY);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0];
        const x = t.clientX;
        const y = t.clientY;

        if (flowPointsRef.current.length > 70) {
          flowPointsRef.current.shift();
        }

        flowPointsRef.current.push({
          x,
          y,
          vx: 0,
          vy: 0,
          age: 0,
          width: 16,
          waveOffset: Math.random() * Math.PI * 2,
        });

        startAnimationLoop();
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    />
  );
};
