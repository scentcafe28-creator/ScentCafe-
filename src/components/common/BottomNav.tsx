import React from 'react';
import { Compass, FileText, Home, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  openRequestsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  openRequestsCount = 0,
}) => {
  const { userProfile } = useAuth();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'services',
      label: 'Explore',
      icon: Compass,
    },
    {
      id: 'requests',
      label: 'My Requests',
      icon: FileText,
      badge: openRequestsCount > 0 ? openRequestsCount : undefined,
    },
    {
      id: userProfile ? 'profile' : 'auth',
      label: userProfile ? 'Account' : 'Sign In',
      icon: User,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B132B]/95 backdrop-blur-lg border-t border-[#D4AF37]/20 pb-safe">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentTab === item.id ||
            (item.id === 'profile' && currentTab === 'settings');

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors cursor-pointer ${
                isActive ? 'text-[#F5D061]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
                  }`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-[#D4AF37] text-[#0B132B] text-[10px] font-bold shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium tracking-tight ${
                  isActive ? 'font-bold text-[#F5D061]' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-[#D4AF37]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
