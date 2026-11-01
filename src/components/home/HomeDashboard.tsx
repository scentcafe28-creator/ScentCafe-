import React from 'react';
import {
  ArrowRight,
  Clock,
  FileText,
  Landmark,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_SERVICES } from '../../data/mockData';
import { ServiceItem, ServiceRequest } from '../../types';

interface HomeDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenSearch: () => void;
  onRequestService: (service?: ServiceItem) => void;
  onSelectService: (service: ServiceItem) => void;
  onOpenRequest?: (request: ServiceRequest) => void;
  onOpenAuth: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onOpenSearch,
  onRequestService,
  onSelectService,
  onOpenRequest,
  onOpenAuth,
}) => {
  const { userProfile } = useAuth();

  // High demand services for quick action
  const popularServices = INITIAL_SERVICES.filter((s) => s.popular).slice(0, 4);

  return (
    <div className="space-y-8 pb-16">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B132B] via-[#142347] to-[#080E21] border border-[#D4AF37]/30 shadow-2xl p-6 sm:p-10 text-white">
        {/* Subtle gold ambient orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          {/* Slogan Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-[#D4AF37]/40 text-[#F5D061] text-[11px] font-bold tracking-widest uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            FIND IT. REQUEST IT. RECEIVE IT.
          </div>

          {/* Customer Welcome & Main Title */}
          <div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight">
              {userProfile ? (
                <>
                  Sawubona, <span className="text-[#F5D061]">{userProfile.displayName?.split(' ')[0]}</span>.
                </>
              ) : (
                <>South Africa’s Trusted Digital Facilitator.</>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Convenient access to official government assistance, career and bursary applications, and professional digital administration.
            </p>
          </div>

          {/* Search Bar: "What are you looking for?" */}
          <div className="pt-2">
            <div
              onClick={onOpenSearch}
              className="group flex items-center justify-between p-2 sm:p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all duration-300 shadow-xl cursor-pointer max-w-xl backdrop-blur-md"
            >
              <div className="flex items-center gap-3 px-3">
                <Search className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                <span className="text-slate-300 group-hover:text-white text-xs sm:text-sm">
                  What are you looking for? (e.g. PSIRA, Home Affairs, First Home Finance, UIF, NATIS, CIPC...)
                </span>
              </div>
              <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[#0B132B] font-bold text-xs tracking-wide shadow-md hidden sm:inline">
                Search
              </span>
            </div>
          </div>

          {/* Primary Quick CTA buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onRequestService()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#E5C158] hover:to-[#F5D061] text-[#0B132B] font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-[#D4AF37]/25 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Request a Service</span>
            </button>
            <button
              onClick={() => onNavigate('services')}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK SHORTCUT HUBS (Browse Services, My Requests, My Account) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div
          onClick={() => onNavigate('services')}
          className="p-4 sm:p-5 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/50 shadow-md cursor-pointer transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-3">
            <Landmark className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-[#F5D061] transition-colors">
              Browse Services
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              SARS, Home Affairs, SASSA, CVs & Business
            </p>
          </div>
        </div>

        <div
          onClick={() => onNavigate('requests')}
          className="p-4 sm:p-5 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/50 shadow-md cursor-pointer transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-[#F5D061] transition-colors">
              My Requests
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Track your submitted application tickets
            </p>
          </div>
        </div>

        <div
          onClick={() => (userProfile ? onNavigate('profile') : onOpenAuth())}
          className="p-4 sm:p-5 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/50 shadow-md cursor-pointer transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-3">
            <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-[#F5D061] transition-colors">
              My Account
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {userProfile ? 'Manage profile & contact details' : 'Sign in or register customer account'}
            </p>
          </div>
        </div>
      </div>


      {/* FEATURED SERVICES DIRECTORY TEASER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
              Facilitation Services
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Most Requested Assistance
            </h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs text-[#D4AF37] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All ({INITIAL_SERVICES.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularServices.map((svc) => (
            <div
              key={svc.id}
              className="group rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/50 p-5 transition-all shadow-md flex flex-col justify-between"
            >
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-[#F5D061]">
                  {svc.categoryName}
                </span>
                <h3 className="text-sm font-bold text-white group-hover:text-[#F5D061] transition-colors mt-2 leading-snug">
                  {svc.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {svc.shortDescription}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{svc.turnaroundTime}</span>
                  <span className="font-extrabold text-[#F5D061]">R {svc.feeZAR}.00</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectService(svc);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold text-center cursor-pointer transition-colors"
                >
                  Details
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestService(svc);
                  }}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#E5C158] hover:to-[#F5D061] text-[#0B132B] text-xs font-bold text-center shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Request Service</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* WHY SCENTCAFE TRUST PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Bank-Grade Confidentiality</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            We never store government passwords or banking PINs. All uploaded supporting files are handled securely under POPIA guidelines.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Fast South African Turnaround</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Application bookings, CV formatting, and digital filings submitted within 24 to 48 hours by dedicated administrative staff.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Direct Business Contact</h3>
          <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
            <p>
              <strong className="text-white">Business Email: </strong>
              <a href="mailto:scentcafe@gmail.com" className="text-[#F5D061] hover:underline font-medium">
                scentcafe@gmail.com
              </a>
            </p>
            <p>
              <strong className="text-white">WhatsApp Business: </strong>
              <a
                href="https://wa.me/27646438872"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 font-semibold hover:underline"
              >
                064 643 8872
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
