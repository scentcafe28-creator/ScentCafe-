import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Landmark,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { INITIAL_SERVICES } from '../../data/mockData';
import { ServiceItem } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (service: ServiceItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) {
      return INITIAL_SERVICES.slice(0, 6);
    }

    return INITIAL_SERVICES.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.categoryName.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-12 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-[#0B132B] border border-[#D4AF37]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-white/5">
          <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search PSIRA, Home Affairs, First Home Finance, UIF, NATIS, CIPC, CSD, SARS, University..."
            autoFocus
            className="w-full bg-transparent text-white placeholder-slate-400 text-base focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-lg border border-white/10 cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#0F1E36] overflow-x-auto text-xs border-b border-white/5 text-slate-300 scrollbar-none">
          <span className="text-[#D4AF37] font-semibold flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3" /> Quick:
          </span>
          {[
            'PSIRA',
            'Home Affairs',
            'First Home Finance',
            'UIF',
            'NATIS',
            'BizPortal',
            'Matric Results',
            'CIPC',
            'CSD',
            'University',
            'SARS',
            'College',
            'Bursary',
            'eLearning',
            'Job Portals',
            'Professional CV',
          ].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 shrink-0 cursor-pointer transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="overflow-y-auto p-5 space-y-6">
          {/* Services Results */}
          {filtered.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5" /> Digital & Government Services (
                  {filtered.length})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filtered.map((svc) => (
                  <div
                    key={svc.id}
                    onClick={() => {
                      onSelectService(svc);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/50 cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-medium text-[#F5D061] uppercase tracking-wide">
                          {svc.categoryName}
                        </span>
                        <span className="text-xs font-bold text-white">R {svc.feeZAR}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-[#F5D061] transition-colors">
                        {svc.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                        {svc.shortDescription}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-[#D4AF37]">
                      <span>{svc.turnaroundTime}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-300 text-sm font-medium">No results found for "{searchTerm}"</p>
              <p className="text-slate-500 text-xs mt-1">
                Try searching for SARS, SASSA, Home Affairs, CVs, or Business Registration.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
