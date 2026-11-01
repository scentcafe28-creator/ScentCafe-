import React from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  FileCheck,
  FileText,
  Info,
  Shield,
  Sparkles,
  X,
} from 'lucide-react';
import { ServiceItem } from '../../types';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestAssistance: (service: ServiceItem) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onRequestAssistance,
}) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#0B132B] border border-[#D4AF37]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Navy & Gold styling */}
        <div className="p-6 bg-gradient-to-r from-[#101C38] to-[#1C2C54] border-b border-[#D4AF37]/30 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#F5D061] border border-[#D4AF37]/40">
              {service.categoryName}
            </span>
            {service.badge && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {service.badge}
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            {service.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            {service.shortDescription}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-slate-300">Turnaround:</span>
              <strong className="text-white">{service.turnaroundTime}</strong>
            </div>
            <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-slate-300">Facilitation Fee:</span>
              <strong className="text-[#F5D061] font-bold text-sm">R {service.feeZAR}.00</strong>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs sm:text-sm">
          {/* Detailed Guide */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Service Overview & How ScentCafe Assists
            </h3>
            <p className="leading-relaxed text-slate-300 text-xs sm:text-sm">
              {service.detailedGuide}
            </p>
          </div>

          {/* Required Documents */}
          {service.requiredDocuments && service.requiredDocuments.length > 0 && (
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" /> Checklist of Required Supporting Documents
              </h3>
              <p className="text-xs text-slate-400">
                Please have clear digital photos or scans of the following documents ready when requesting assistance:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.requiredDocuments.map((doc, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-xl bg-black/20 border border-white/5 text-xs text-slate-300"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* How ScentCafe Facilitation Works */}
          <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 space-y-2">
            <span className="text-[11px] font-bold uppercase text-[#F5D061] tracking-wider block">
              How ScentCafe Facilitates This For You
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="font-bold text-white block mb-0.5">1. Submit Details</span>
                <span>Upload your info securely through our simple ticket request.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="font-bold text-white block mb-0.5">2. Expert Review</span>
                <span>Our facilitation specialists verify and file your application.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="font-bold text-white block mb-0.5">3. Live Tracking</span>
                <span>Track status in real-time and get updates via WhatsApp.</span>
              </div>
            </div>
          </div>

          {/* Legal Non-Affiliation Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200/90 leading-relaxed">
            <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">Important Disclaimer: </strong>
              {service.disclaimer}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#0F1E36] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <span>Standard Turnaround: </span>
            <strong className="text-white">{service.turnaroundTime}</strong>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => onRequestAssistance(service)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#E5C158] hover:to-[#F5D061] text-[#0B132B] font-bold text-xs tracking-wide shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit Request (R {service.feeZAR})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
