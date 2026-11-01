import React, { useState } from 'react';
import {
  AlertCircle,
  Building,
  CheckCircle,
  FileText,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  Sparkles,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProfileViewProps {
  onNavigateToRequests: () => void;
  onNavigateToSettings: () => void;
  onOpenAuth: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onNavigateToRequests,
  onNavigateToSettings,
  onOpenAuth,
}) => {
  const { userProfile, updateProfileData, signOutUser } = useAuth();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phoneNumber || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [province, setProvince] = useState(userProfile?.province || 'Gauteng');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setPhoneNumber(userProfile.phoneNumber || '');
      setAddress(userProfile.address || '');
      setCity(userProfile.city || '');
      setProvince(userProfile.province || 'Gauteng');
    }
  }, [userProfile]);

  if (!userProfile) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-[#0B132B] border border-white/10 text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
          <User className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <h2 className="text-xl font-bold text-white">Sign In to View Your Profile</h2>
        <p className="text-xs text-slate-400">
          Sign in or register to manage your personal details, tracking addresses, and application history.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[#0B132B] font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer"
        >
          Sign In or Register
        </button>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const ok = await updateProfileData({
      displayName: displayName.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
      city: city.trim(),
      province,
    });

    setIsSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0C152B] to-[#152345] border border-[#D4AF37]/30 shadow-xl flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#D4AF37] to-[#7D6421] text-[#0B132B] font-bold text-3xl flex items-center justify-center shadow-lg border-2 border-white/20">
            {userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>

        <div className="space-y-1 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {userProfile.displayName || 'Customer'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D061] text-[10px] font-bold uppercase tracking-wide">
              Verified Customer
            </span>
          </div>
          <p className="text-xs text-slate-300">{userProfile.email}</p>
          <p className="text-[11px] text-slate-400">
            Registered: {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Active'}
          </p>
        </div>

        <button
          onClick={signOutUser}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#D4AF37]">
            Personal & Delivery Details
          </h2>
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Profile Updated!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Contact Phone / WhatsApp
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="082 123 4567"
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Physical Address / Residential Location
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 25 Oxford Road, Rosebank"
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              City / Metropolitan
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Johannesburg"
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Province
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#0F1E36] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="Gauteng">Gauteng</option>
              <option value="Western Cape">Western Cape</option>
              <option value="KwaZulu-Natal">KwaZulu-Natal</option>
              <option value="Eastern Cape">Eastern Cape</option>
              <option value="Free State">Free State</option>
              <option value="Mpumalanga">Mpumalanga</option>
              <option value="Limpopo">Limpopo</option>
              <option value="North West">North West</option>
              <option value="Northern Cape">Northern Cape</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#E5C158] hover:to-[#F5D061] text-[#0B132B] font-bold text-xs tracking-wide shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
