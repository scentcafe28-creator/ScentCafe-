import React, { useState } from 'react';
import {
  FileText,
  LogOut,
  Search,
  Settings,
  Sparkles,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ScentCafeLogo } from './ScentCafeLogo';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenSearch: () => void;
  onRequestService: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
  onOpenSearch,
  onRequestService,
}) => {
  const { userProfile, signOutUser } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0B132B]/95 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('home')}
          className="cursor-pointer transition-transform hover:scale-[1.01]"
        >
          <ScentCafeLogo showSlogan={true} size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'home'
                ? 'text-[#F5D061] bg-white/10 shadow-sm'
                : 'text-slate-200 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('services')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'services'
                ? 'text-[#F5D061] bg-white/10 shadow-sm'
                : 'text-slate-200 hover:text-white hover:bg-white/5'
            }`}
          >
            Services Directory
          </button>
          <button
            onClick={() => onSelectTab('requests')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'requests'
                ? 'text-[#F5D061] bg-white/10 shadow-sm'
                : 'text-slate-200 hover:text-white hover:bg-white/5'
            }`}
          >
            My Requests
          </button>
        </nav>

        {/* Right Actions Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* WhatsApp Direct Header Link */}
          <a
            href="https://wa.me/27646438872"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 text-xs font-semibold transition-all shadow-sm cursor-pointer"
            title="Chat with ScentCafe WhatsApp Business: 064 643 8872"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>WhatsApp 064 643 8872</span>
          </a>

          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs border border-white/10 transition-all cursor-pointer"
            title="Search services"
          >
            <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">What are you looking for?</span>
          </button>


          {/* Primary Action Button: Request a Service */}
          <button
            onClick={onRequestService}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#E5C158] hover:to-[#F5D061] text-[#0B132B] font-semibold text-xs tracking-wide shadow-md transition-all transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Request a Service</span>
          </button>

          {/* Account Profile Menu */}
          <div className="relative">
            {userProfile ? (
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C7326] text-[#0B132B] font-bold text-xs flex items-center justify-center">
                  {userProfile.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline text-xs text-slate-200 font-medium max-w-[100px] truncate">
                  {userProfile.displayName?.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/10 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Profile Dropdown */}
            {showProfileMenu && userProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0F1A36] border border-[#D4AF37]/30 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-2 border-b border-white/10 mb-2">
                  <p className="text-sm font-semibold text-white truncate">
                    {userProfile.displayName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{userProfile.email}</p>
                  <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-[#D4AF37]/20 text-[#F5D061]">
                    Verified Customer
                  </span>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onSelectTab('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    <span>My Customer Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab('requests');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-[#D4AF37]" />
                    <span>Track My Requests</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#D4AF37]" />
                    <span>Account Settings</span>
                  </button>

                  <div className="pt-2 border-t border-white/10 mt-1">
                    <button
                      onClick={async () => {
                        setShowProfileMenu(false);
                        await signOutUser();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-300 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
