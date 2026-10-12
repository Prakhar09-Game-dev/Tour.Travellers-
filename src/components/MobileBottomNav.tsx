import React, { useState, useEffect } from 'react';
import { Calculator, Car, Compass, Camera, Phone, Settings } from 'lucide-react';
import type { Language } from '../i18n/translations.js';

interface MobileBottomNavProps {
  onNavigate: (sectionId: string) => void;
  primaryPhone: string;
  lang: Language;
  onOpenThreeBarsDrawer?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onNavigate,
  primaryPhone,
  lang,
  onOpenThreeBarsDrawer,
}) => {
  const [activeSection, setActiveSection] = useState<string>('calculator');

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['calculator', 'fleet', 'packages', 'heritage-gallery', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      id: 'calculator',
      labelEn: 'Fare Calc',
      labelHi: 'किराया',
      icon: Calculator,
      target: 'calculator',
    },
    {
      id: 'fleet',
      labelEn: 'Cars',
      labelHi: 'गाड़ियाँ',
      icon: Car,
      target: 'fleet',
    },
    {
      id: 'packages',
      labelEn: 'Packages',
      labelHi: 'पैकेज',
      icon: Compass,
      target: 'packages',
    },
    {
      id: 'heritage-gallery',
      labelEn: 'Places',
      labelHi: 'तीर्थ स्थल',
      icon: Camera,
      target: 'heritage-gallery',
    },
    {
      id: 'settings',
      labelEn: '3-Bars & Set',
      labelHi: '३-बार/सेटिंग्स',
      icon: Settings,
      action: () => {
        if (onOpenThreeBarsDrawer) {
          onOpenThreeBarsDrawer();
        }
      },
    },
    {
      id: 'contact',
      labelEn: 'Call Desk',
      labelHi: 'कॉल करें',
      icon: Phone,
      action: () => {
        window.location.href = `tel:+91${primaryPhone}`;
      },
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom App Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-xl border-t border-[#D4A373]/30 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-1.5 px-2 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))] md:hidden"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const label = lang === 'hi' ? item.labelHi : item.labelEn;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else if (item.target) {
                  setActiveSection(item.id);
                  onNavigate(item.target);
                }
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer min-w-[56px] ${
                isActive
                  ? 'text-[#7C2D12] font-bold scale-105'
                  : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-[#F8ECD5] text-[#D9531E]' : 'text-stone-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-tight mt-0.5 tracking-tight truncate max-w-[64px]">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
