import React, { useState } from 'react';
import {
  FileText,
  HelpCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AccountSettingsView } from './components/auth/AccountSettingsView';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { ProfileView } from './components/auth/ProfileView';
import { BottomNav } from './components/common/BottomNav';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { FloatingWhatsAppButton } from './components/common/FloatingWhatsAppButton';
import { Navbar } from './components/common/Navbar';
import { ScentCafeLogo } from './components/common/ScentCafeLogo';
import { SearchModal } from './components/common/SearchModal';
import { HomeDashboard } from './components/home/HomeDashboard';
import { MyRequestsView } from './components/requests/MyRequestsView';
import { RequestDetailModal } from './components/requests/RequestDetailModal';
import { ServiceDetailModal } from './components/services/ServiceDetailModal';
import { ServiceRequestModal } from './components/services/ServiceRequestModal';
import { ServicesDirectory } from './components/services/ServicesDirectory';
import { AuthProvider, useAuth } from './context/AuthContext';
import { INITIAL_SERVICES } from './data/mockData';
import { ServiceItem, ServiceRequest } from './types';

const MainApp: React.FC = () => {
  const { userProfile, isAdmin } = useAuth();

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    return !localStorage.getItem('scentcafe_onboarded');
  });

  // Service modals
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<ServiceItem | null>(null);
  const [selectedServiceForRequest, setSelectedServiceForRequest] = useState<ServiceItem | null>(null);

  // Request inspecting modal
  const [selectedRequestForInspect, setSelectedRequestForInspect] = useState<ServiceRequest | null>(null);

  const handleOpenRequestService = (service?: ServiceItem) => {
    setSelectedServiceForRequest(service || INITIAL_SERVICES[0]);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('scentcafe_onboarded', 'true');
    setIsOnboardingOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#0B132B]">
      {/* Top Disclaimer & Consumer Protection Banner */}
      <DisclaimerBanner />

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onRequestService={() => handleOpenRequestService()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'home' && (
          <HomeDashboard
            onNavigate={setCurrentTab}
            onOpenSearch={() => setIsSearchOpen(true)}
            onRequestService={handleOpenRequestService}
            onSelectService={setSelectedServiceForDetail}
            onOpenRequest={setSelectedRequestForInspect}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentTab === 'services' && (
          <ServicesDirectory
            onSelectService={setSelectedServiceForDetail}
            onRequestAssistance={handleOpenRequestService}
          />
        )}

        {currentTab === 'requests' && (
          <MyRequestsView
            onOpenRequest={setSelectedRequestForInspect}
            onNavigateToServices={() => setCurrentTab('services')}
            onRequestService={() => handleOpenRequestService()}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            onNavigateToRequests={() => setCurrentTab('requests')}
            onNavigateToSettings={() => setCurrentTab('settings')}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentTab === 'settings' && <AccountSettingsView />}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-[#040814] border-t border-[#D4AF37]/20 py-12 pb-24 lg:pb-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <ScentCafeLogo size="md" />
            <p className="text-slate-400 text-xs leading-relaxed">
              FIND IT. REQUEST IT. RECEIVE IT. Convenient digital facilitation and online application assistance across South Africa.
            </p>
            <div className="text-xs text-slate-300 space-y-1">
              <div>
                <strong className="text-white">Business Email: </strong>
                <a href="mailto:scentcafe@gmail.com" className="text-[#F5D061] hover:underline">
                  scentcafe@gmail.com
                </a>
              </div>
              <div>
                <strong className="text-white">WhatsApp Business: </strong>
                <a
                  href="https://wa.me/27646438872"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  064 643 8872 (+27 64 643 8872)
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">
              Digital Services
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setCurrentTab('services')}
                  className="hover:text-white transition-colors"
                >
                  SARS eFiling & Compliance
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('services')}
                  className="hover:text-white transition-colors"
                >
                  PSIRA Security Officer Assistance
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('services')}
                  className="hover:text-white transition-colors"
                >
                  Home Affairs Smart ID & Passports
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('services')}
                  className="hover:text-white transition-colors"
                >
                  First Home Finance (FLISP) Subsidies
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('services')}
                  className="hover:text-white transition-colors"
                >
                  UIF & Department of Labour uFiling
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('services')}
                  className="hover:text-white transition-colors"
                >
                  eNaTIS Licence Cards & Disc Renewals
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('services')}
                  className="hover:text-white transition-colors"
                >
                  CIPC & BizPortal Company Registration
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('services')}
                  className="hover:text-white transition-colors"
                >
                  CSD National Treasury Master Registration
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('services')}
                  className="hover:text-white transition-colors"
                >
                  University & College Admissions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('services')}
                  className="hover:text-white transition-colors"
                >
                  Professional South African CVs
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">
              Trust & Transparency
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              ScentCafe provides independent digital facilitation and application document formatting. We do not represent any government department or guarantee approval.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#F5D061]">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#D4AF37]" />
              <span>POPIA Compliant • Secure Uploads</span>
            </div>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer pt-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How ScentCafe Works</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>&copy; {new Date().getFullYear()} ScentCafe (Pty) Ltd. South Africa. All rights reserved.</span>
          <span>FIND IT. REQUEST IT. RECEIVE IT.</span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'auth') setIsAuthOpen(true);
          else setCurrentTab(tab);
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectService={(svc) => {
          setSelectedServiceForDetail(svc);
        }}
      />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedServiceForDetail}
        isOpen={!!selectedServiceForDetail}
        onClose={() => setSelectedServiceForDetail(null)}
        onRequestAssistance={(svc) => {
          setSelectedServiceForDetail(null);
          setSelectedServiceForRequest(svc);
        }}
      />

      {/* Service Request Ticket Creation Modal */}
      <ServiceRequestModal
        service={selectedServiceForRequest}
        isOpen={!!selectedServiceForRequest}
        onClose={() => setSelectedServiceForRequest(null)}
        onSuccess={(req) => {
          // User can inspect under My Requests
        }}
        onViewMyRequests={() => {
          setSelectedServiceForRequest(null);
          setCurrentTab('requests');
        }}
      />

      {/* Request Inspection Modal */}
      <RequestDetailModal
        request={selectedRequestForInspect}
        isOpen={!!selectedRequestForInspect}
        onClose={() => setSelectedRequestForInspect(null)}
        onRefresh={() => {
          // Triggered via snapshot
        }}
      />

      {/* Customer Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Onboarding Welcome Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onGetStarted={handleOnboardingComplete}
      />

      {/* Floating WhatsApp Support Button */}
      <FloatingWhatsAppButton />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
