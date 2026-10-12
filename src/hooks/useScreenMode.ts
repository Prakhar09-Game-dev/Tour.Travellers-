import { useState, useEffect } from 'react';

export interface ScreenMode {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmallMobile: boolean;
  orientation: 'portrait' | 'landscape';
}

export function useScreenMode(): ScreenMode {
  const getScreenMode = (): ScreenMode => {
    if (typeof window === 'undefined') {
      return {
        width: 1200,
        height: 800,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isSmallMobile: false,
        orientation: 'landscape',
      };
    }

    const w = window.innerWidth;
    const h = window.innerHeight;

    return {
      width: w,
      height: h,
      isSmallMobile: w < 480,
      isMobile: w < 768,
      isTablet: w >= 768 && w < 1024,
      isDesktop: w >= 1024,
      orientation: w > h ? 'landscape' : 'portrait',
    };
  };

  const [screenMode, setScreenMode] = useState<ScreenMode>(getScreenMode);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      // Immediate update for responsive layout shifts
      setScreenMode(getScreenMode());

      // Debounced follow-up to catch end-of-drag resize on PC
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScreenMode(getScreenMode());
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return screenMode;
}
