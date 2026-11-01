import React, { useState } from 'react';
import { MessageCircle, Phone, Sparkles, X } from 'lucide-react';
import {
  formatWhatsAppDisplay,
  getGeneralWhatsAppLink,
} from '../../utils/whatsapp';

export const FloatingWhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2">
      {/* Tooltip bubble on first load */}
      {showTooltip && (
        <div className="relative bg-[#0F1E36] border border-[#D4AF37]/50 text-white rounded-2xl p-3 shadow-2xl max-w-xs animate-in fade-in slide-in-from-bottom-2 text-xs">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-1.5 right-1.5 text-slate-400 hover:text-white p-1"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1.5 text-[#F5D061] font-bold text-[11px] mb-1">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Need Help? Chat on WhatsApp</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-snug">
            Speak to a ScentCafe agent directly at <strong>{formatWhatsAppDisplay()}</strong> for fast service facilitation.
          </p>
        </div>
      )}

      {/* Main WhatsApp Pill Button */}
      <a
        href={getGeneralWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        title={`Message ScentCafe on WhatsApp: ${formatWhatsAppDisplay()}`}
      >
        <div className="relative flex items-center justify-center">
          <Phone className="w-4 h-4 fill-slate-950 text-slate-950" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-ping" />
        </div>
        <span className="hidden sm:inline">WhatsApp</span>
        <span className="font-mono text-xs">{formatWhatsAppDisplay()}</span>
      </a>
    </div>
  );
};
