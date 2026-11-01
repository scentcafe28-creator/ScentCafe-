import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Info,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'register' | 'reset';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'signin',
}) => {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    authError,
    clearError,
    loginAsDemoCustomer,
    loginAsDemoAdmin,
  } = useAuth();

  const [tab, setTab] = useState<'signin' | 'register' | 'reset'>(defaultTab);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleTabChange = (newTab: 'signin' | 'register' | 'reset') => {
    setTab(newTab);
    clearError();
    setResetSent(false);
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    const success = await signInWithGoogle();
    setIsSubmitting(false);
    if (success) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    if (tab === 'signin') {
      const ok = await signInWithEmail(email, password);
      if (ok) onClose();
    } else if (tab === 'register') {
      const ok = await signUpWithEmail(email, password, displayName, phoneNumber);
      if (ok) onClose();
    } else if (tab === 'reset') {
      const ok = await resetPassword(email);
      if (ok) setResetSent(true);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#0B132B] border border-[#D4AF37]/50 rounded-3xl shadow-2xl p-6 sm:p-7 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
            ScentCafe Customer Portal
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide mt-0.5">
            {tab === 'signin'
              ? 'Sign In to Your Account'
              : tab === 'register'
              ? 'Create Customer Account'
              : 'Reset Forgotten Password'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Access your government assistance tickets and digital service requests
          </p>
        </div>

        {/* Auth Error Banner */}
        {authError && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span>{authError}</span>
            </div>
          </div>
        )}

        {/* Tabs switcher */}
        <div className="flex rounded-xl bg-white/5 p-1 mb-5 border border-white/10">
          <button
            onClick={() => handleTabChange('signin')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === 'signin'
                ? 'bg-[#D4AF37] text-[#0B132B] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleTabChange('register')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-[#D4AF37] text-[#0B132B] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => handleTabChange('reset')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              tab === 'reset'
                ? 'bg-[#D4AF37] text-[#0B132B] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Reset
          </button>
        </div>

        {/* Google Sign In Button */}
        {tab !== 'reset' && (
          <div className="space-y-3 mb-5">
            <button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#0B132B] px-3 text-[10px] text-slate-400 uppercase tracking-wider">
                Or with email
              </span>
            </div>
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Customer Name <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Sindi Ndlovu"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  South African Cellphone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="082 123 4567"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Address <span className="text-[#D4AF37]">*</span>
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sindi@gmail.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {tab !== 'reset' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Password <span className="text-[#D4AF37]">*</span>
                </label>
                {tab === 'signin' && (
                  <button
                    type="button"
                    onClick={() => handleTabChange('reset')}
                    className="text-[10px] text-[#D4AF37] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          )}

          {resetSent && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Password reset instructions sent to {email}. Check your inbox!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#E5C158] hover:to-[#F5D061] text-[#0B132B] font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {isSubmitting
              ? 'Processing...'
              : tab === 'signin'
              ? 'Sign In to ScentCafe'
              : tab === 'register'
              ? 'Register Customer Account'
              : 'Send Reset Link'}
          </button>
        </form>

        {/* Fast Test / Instant Demo Account Switcher */}
        <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center">
            Instant Test Profiles (One-Click)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                loginAsDemoCustomer();
                onClose();
              }}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Customer Demo</span>
            </button>
            <button
              onClick={() => {
                loginAsDemoAdmin();
                onClose();
              }}
              className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-[#F5D061] border border-amber-500/30 text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Staff Admin Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
