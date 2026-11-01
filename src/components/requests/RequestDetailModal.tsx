import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  FileCheck,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Send,
  ShieldAlert,
  User,
  X,
} from 'lucide-react';
import { updateServiceRequestStatus } from '../../services/dbService';
import { ServiceRequest } from '../../types';
import {
  formatFullTicketWhatsAppMessage,
  formatWhatsAppDisplay,
  getWhatsAppLink,
} from '../../utils/whatsapp';

interface RequestDetailModalProps {
  request: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [copied, setCopied] = useState(false);
  const [customerNoteInput, setCustomerNoteInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !request) return null;

  const copyRef = () => {
    navigator.clipboard.writeText(request.referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddCustomerNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerNoteInput.trim()) return;

    setIsUpdating(true);
    try {
      await updateServiceRequestStatus(
        request.id,
        request.status,
        undefined,
        customerNoteInput.trim()
      );
      setCustomerNoteInput('');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const fullTicketWhatsappHref = getWhatsAppLink(
    formatFullTicketWhatsAppMessage({
      referenceNumber: request.referenceNumber,
      serviceTitle: request.serviceTitle,
      category: request.category,
      customerName: request.customerName,
      customerPhone: request.customerPhone,
      customerEmail: request.customerEmail,
      description: request.description,
      documents: request.documents?.map((d) => ({ name: d.name })),
      status: request.status,
      createdAt: request.createdAt,
    })
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#0B132B] border border-[#D4AF37]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#101C38] to-[#1C2C54] border-b border-[#D4AF37]/30 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/10">
              {request.category}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            {request.serviceTitle}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-[#D4AF37]/30">
              <span className="text-xs text-slate-400">Ref:</span>
              <span className="font-mono text-sm font-bold text-[#F5D061]">
                {request.referenceNumber}
              </span>
              <button
                onClick={copyRef}
                className="p-1 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Copy reference code"
              >
                {copied ? (
                  <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <span className="text-xs text-slate-400">
              Submitted: {new Date(request.createdAt).toLocaleDateString()}
            </span>

            {/* Direct WhatsApp Badge in Header */}
            <a
              href={fullTicketWhatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-all shadow-sm"
              title="Forward Ticket to WhatsApp Business"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Ticket</span>
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs sm:text-sm">
          {/* Quick WhatsApp Action Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-[#0F291E] border border-emerald-500/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                WhatsApp Business Auto-Sync ({formatWhatsAppDisplay()})
              </span>
              <p className="text-slate-300 text-[11px]">
                Forward this ticket transcript, send extra attachments, or chat directly with our specialist.
              </p>
            </div>
            <a
              href={fullTicketWhatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 fill-black text-black" />
              <span>Send Ticket to WhatsApp</span>
            </a>
          </div>

          {/* Customer Assistance Notes */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Assistance Requested by Customer
            </h3>
            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-xs">
              {request.description}
            </p>
          </div>

          {/* Admin Staff Feedback Notes */}
          {request.adminNotes && (
            <div className="bg-[#1C284A] rounded-2xl p-4 border border-[#D4AF37]/40 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5D061] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Staff Internal Status Update & Feedback
              </h3>
              <p className="text-white text-xs leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                {request.adminNotes}
              </p>
            </div>
          )}

          {/* Attached Documents */}
          {request.documents && request.documents.length > 0 && (
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5" /> Uploaded Application Documents (
                {request.documents.length})
              </h3>
              <div className="space-y-1.5">
                {request.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/10 text-xs"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span className="text-white font-medium truncate max-w-[280px]">
                        {doc.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({(doc.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                    {doc.dataUrl && (
                      <a
                        href={doc.dataUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-semibold"
                      >
                        Preview
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Follow-up Message / Response */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Send a Follow-Up Note to ScentCafe Support
            </h3>
            {request.customerNote && (
              <div className="p-2.5 rounded-xl bg-black/20 border border-white/5 text-xs text-slate-300">
                <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                  Your last note:
                </span>
                {request.customerNote}
              </div>
            )}
            <form onSubmit={handleAddCustomerNote} className="flex gap-2">
              <input
                type="text"
                value={customerNoteInput}
                onChange={(e) => setCustomerNoteInput(e.target.value)}
                placeholder="Type additional information or question..."
                className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                disabled={isUpdating || !customerNoteInput.trim()}
                className="px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#0B132B] font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0F1E36] border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Assigned to ScentCafe Support Team
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
