import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle,
  Clock,
  ExternalLink,
  GraduationCap,
  Landmark,
  Layers,
  Search,
  Shield,
  Sparkles,
} from 'lucide-react';
import { INITIAL_SERVICES } from '../../data/mockData';
import { ServiceCategoryType, ServiceItem } from '../../types';

interface ServicesDirectoryProps {
  onSelectService: (service: ServiceItem) => void;
  onRequestAssistance: (service: ServiceItem) => void;
}

export const ServicesDirectory: React.FC<ServicesDirectoryProps> = ({
  onSelectService,
  onRequestAssistance,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Services', icon: Layers },
    { id: 'government', label: 'Government & Public', icon: Landmark },
    { id: 'careers', label: 'Jobs & Careers', icon: Briefcase },
    { id: 'education', label: 'Education & Admissions', icon: GraduationCap },
    { id: 'business', label: 'Business & Digital Admin', icon: BookOpen },
  ];

  const filteredServices = useMemo(() => {
    return INITIAL_SERVICES.filter((svc) => {
      const matchCategory =
        selectedCategory === 'all' || svc.categoryId === selectedCategory;
      const matchSearch =
        svc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        svc.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        svc.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0E1A36] via-[#16274D] to-[#0A1224] p-6 sm:p-8 border border-[#D4AF37]/30 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D061] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Digital Facilitation Directory
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-wide">
            South African Digital Services & Application Assistance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Convenient, verified assistance with government portals, career documentation, university bursaries, and business compliance.
          </p>
        </div>

        {/* Decorative ambient blur */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4AF37] text-[#0B132B] shadow-md shadow-[#D4AF37]/20'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter services..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="group relative rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/50 p-5 sm:p-6 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#D4AF37]/5 flex flex-col justify-between"
          >
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-[#F5D061] border border-white/10">
                  {service.categoryName}
                </span>
                {service.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {service.badge}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-white group-hover:text-[#F5D061] transition-colors leading-snug">
                {service.title}
              </h3>
              <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                {service.shortDescription}
              </p>

              {/* Meta details */}
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Turnaround:
                  </span>
                  <span className="font-medium text-white">{service.turnaroundTime}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="text-slate-400">Facilitation Fee:</span>
                  <span className="font-extrabold text-[#F5D061] text-sm">
                    R {service.feeZAR}.00
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 flex items-center gap-2">
              <button
                onClick={() => onSelectService(service)}
                className="flex-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all text-center cursor-pointer"
              >
                View Details
              </button>
              <button
                onClick={() => onRequestAssistance(service)}
                className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#E5C158] hover:to-[#F5D061] text-[#0B132B] text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="py-16 text-center rounded-3xl bg-white/5 border border-white/10 p-8">
          <Shield className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <h3 className="text-base font-semibold text-white">No services found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different category tab.
          </p>
        </div>
      )}
    </div>
  );
};
