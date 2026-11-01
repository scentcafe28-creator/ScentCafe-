import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  Filter,
  Phone,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { subscribeToUserRequests } from '../../services/dbService';
import { ServiceRequest } from '../../types';
import { formatFullTicketWhatsAppMessage, getWhatsAppLink } from '../../utils/whatsapp';

interface MyRequestsViewProps {
  onOpenRequest: (request: ServiceRequest) => void;
  onNavigateToServices: () => void;
  onRequestService: () => void;
}

export const MyRequestsView: React.FC<MyRequestsViewProps> = ({
  onOpenRequest,
  onNavigateToServices,
  onRequestService,
}) => {
  const { userProfile } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const uid = userProfile?.uid || 'guest';
    const unsub = subscribeToUserRequests(uid, (items) => {
      setRequests(items);
    });
    return () => unsub();
  }, [userProfile?.uid]);

  const filteredRequests = requests.filter((req) => {
    const matchSearch =
      req.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0E1A36] to-[#152445] border border-[#D4AF37]/30 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#F5D061] text-[10px] font-bold uppercase tracking-wider">
            <FileText className="w-3 h-3" />
            Customer Ticket Tracker
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            My Service Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Track real-time progress, review administrative notes, and manage your South African service applications.
          </p>
        </div>

        <button
          onClick={onRequestService}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#E5C158] hover:to-[#F5D061] text-[#0B132B] font-bold text-xs tracking-wide shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Service Request</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <span className="text-xs text-slate-300">
          Showing {filteredRequests.length} request{filteredRequests.length === 1 ? '' : 's'}
        </span>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by reference code or service..."
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => onOpenRequest(req)}
              className="p-5 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/50 shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-bold text-[#F5D061] tracking-wide">
                      {req.referenceNumber}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#F5D061] transition-colors leading-snug">
                      {req.serviceTitle}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                  {req.description}
                </p>

                {req.adminNotes && (
                  <div className="mt-3 p-2.5 rounded-xl bg-black/30 border border-white/5 text-[11px] text-slate-200">
                    <span className="text-[#D4AF37] font-semibold block mb-0.5">Staff Note:</span>
                    <span className="line-clamp-2">{req.adminNotes}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                  {req.documents && req.documents.length > 0 && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <FileCheck className="w-3 h-3 text-emerald-400" />
                      {req.documents.length} doc{req.documents.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const url = getWhatsAppLink(
                        formatFullTicketWhatsAppMessage({
                          referenceNumber: req.referenceNumber,
                          serviceTitle: req.serviceTitle,
                          category: req.category,
                          customerName: req.customerName,
                          customerPhone: req.customerPhone,
                          customerEmail: req.customerEmail,
                          description: req.description,
                          documents: req.documents?.map((d) => ({ name: d.name })),
                          status: req.status,
                          createdAt: req.createdAt,
                        })
                      );
                      window.open(url, '_blank');
                    }}
                    className="p-1.5 px-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-semibold text-[11px] flex items-center gap-1 transition-all"
                    title="Send ticket through WhatsApp Business"
                  >
                    <Phone className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>
                  <span className="text-[#D4AF37] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-3xl bg-white/5 border border-white/10 p-8 space-y-4">
          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Service Requests Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't submitted any service requests matching this filter yet. Need help with SARS, SASSA, Home Affairs, or CV writing?
            </p>
          </div>
          <button
            onClick={onNavigateToServices}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[#0B132B] font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Explore Services Directory
          </button>
        </div>
      )}
    </div>
  );
};
