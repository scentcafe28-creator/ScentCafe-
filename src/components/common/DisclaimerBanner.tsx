import React, { useState } from 'react';
import { AlertTriangle, Info, ShieldCheck, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-[#0F1E36] to-[#162746] border-y border-[#D4AF37]/25 text-white/90 text-xs px-4 py-2.5 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded bg-[#D4AF37]/20 text-[#D4AF37] shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 leading-snug">
            <span className="font-semibold text-white">South African Consumer & Security Notice: </span>
            <span className="text-slate-200">
              ScentCafe provides independent digital facilitation and administrative assistance. We do not represent SARS, DHA, SASSA, or any state organ, nor guarantee application outcomes.
            </span>
            <span className="hidden md:inline text-[#F5D061] font-medium ml-1">
              Safety rule: Never share your banking PINs, SASSA card PINs, or SMS OTPs with anyone.
            </span>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors shrink-0"
          title="Dismiss notification"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
