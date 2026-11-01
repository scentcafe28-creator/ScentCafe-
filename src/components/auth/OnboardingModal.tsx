import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Landmark,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { ScentCafeLogo } from '../common/ScentCafeLogo';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onGetStarted,
}) => {
  const [slide, setSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'FIND IT.',
      subtitle: 'South Africa’s Modern Service & Application Hub',
      description:
        'Discover hassle-free guidance for SARS eFiling, Smart ID & Passport bookings, SASSA SRD, NSFAS bursaries, CV writing, and business registrations.',
      icon: Landmark,
      badge: 'Step 1: Explore',
    },
    {
      title: 'REQUEST IT.',
      subtitle: 'Transparent, Fast & Reliable Facilitation',
      description:
        'Submit your assistance ticket in seconds with confidential document uploads. No standing in endless queues or struggling with complex online portals.',
      icon: FileCheck,
      badge: 'Step 2: Submit',
    },
    {
      title: 'RECEIVE IT.',
      subtitle: 'Real-Time Updates & Document Delivery',
      description:
        'Track every application status in real-time from your dashboard and receive completed documents and confirmation slips directly via email and WhatsApp.',
      icon: CheckCircle2,
      badge: 'Step 3: Receive',
    },
  ];

  const current = slides[slide];
  const Icon = current.icon;

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      onGetStarted();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#0B132B] border border-[#D4AF37]/50 rounded-3xl shadow-2xl p-6 sm:p-8 text-white flex flex-col justify-between min-h-[460px]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-white/5 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo and Brand */}
        <div className="flex justify-center mb-6">
          <ScentCafeLogo showSlogan={false} size="lg" />
        </div>

        {/* Slide Graphic and Content */}
        <div className="text-center space-y-4 my-auto">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1C2541] to-[#0A1128] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center mx-auto shadow-xl">
            <Icon className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5D061] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 inline-block">
              {current.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-wider">
              {current.title}
            </h2>
            <h3 className="text-sm font-semibold text-[#D4AF37]">{current.subtitle}</h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Slide indicators & Button */}
        <div className="mt-8 space-y-4">
          <div className="flex justify-center gap-1.5">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  slide === i ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {slide > 0 && (
              <button
                onClick={() => setSlide(slide - 1)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#E5C158] hover:to-[#F5D061] text-[#0B132B] font-bold text-xs tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{slide === slides.length - 1 ? 'Start Using ScentCafe' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
