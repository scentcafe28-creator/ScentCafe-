import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileCheck,
  FileText,
  Loader2,
  Paperclip,
  Phone,
  ShieldAlert,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createServiceRequest, generateReferenceCode } from '../../services/dbService';
import { RequestAttachment, ServiceItem, ServiceRequest } from '../../types';
import {
  formatFullTicketWhatsAppMessage,
  formatWhatsAppDisplay,
  getWhatsAppBusinessNumber,
  getWhatsAppLink,
  isAutoSendWhatsAppTicketsEnabled,
  setAutoSendWhatsAppTicketsEnabled,
} from '../../utils/whatsapp';

interface ServiceRequestModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (request: ServiceRequest) => void;
  onViewMyRequests: () => void;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  service,
  isOpen,
  onClose,
  onSuccess,
  onViewMyRequests,
}) => {
  const { userProfile, currentUser } = useAuth();

  const [customerName, setCustomerName] = useState(userProfile?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(userProfile?.email || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phoneNumber || '');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<RequestAttachment[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const [autoSendWhatsApp, setAutoSendWhatsApp] = useState(isAutoSendWhatsAppTicketsEnabled());
  const [whatsAppUrl, setWhatsAppUrl] = useState('');
  const [autoRedirectSeconds, setAutoRedirectSeconds] = useState(2);
  const [autoOpened, setAutoOpened] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<ServiceRequest | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync profile details if changed
  useEffect(() => {
    if (userProfile) {
      if (!customerName) setCustomerName(userProfile.displayName || '');
      if (!customerEmail) setCustomerEmail(userProfile.email || '');
      if (!customerPhone && userProfile.phoneNumber) setCustomerPhone(userProfile.phoneNumber);
    }
  }, [userProfile]);

  // Handle automatic WhatsApp redirect countdown
  useEffect(() => {
    if (!submittedRequest || !autoSendWhatsApp || !whatsAppUrl) return;

    if (autoRedirectSeconds > 0) {
      const timer = setTimeout(() => {
        setAutoRedirectSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoRedirectSeconds === 0 && !autoOpened) {
      setAutoOpened(true);
      try {
        const opened = window.open(whatsAppUrl, '_blank');
        if (!opened || opened.closed || typeof opened.closed === 'undefined') {
          // If popup is blocked by browser, leave direct clickable button
        }
      } catch (err) {
        console.warn('Auto WhatsApp popup blocked:', err);
      }
    }
  }, [submittedRequest, autoSendWhatsApp, whatsAppUrl, autoRedirectSeconds, autoOpened]);

  if (!isOpen || !service) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
    ];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB limit

    const newAttachments: RequestAttachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedTypes.includes(file.type)) {
        setFileError(`"${file.name}" is not supported. Please upload PDF, PNG, or JPG only.`);
        return;
      }

      if (file.size > maxSizeBytes) {
        setFileError(`"${file.name}" exceeds 5MB size limit.`);
        return;
      }

      const fakeUrl = URL.createObjectURL(file);
      newAttachments.push({
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: fakeUrl,
        uploadedAt: new Date().toISOString(),
      });
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    // Validation
    if (!customerName.trim()) {
      setSubmissionError('Please provide your full customer name.');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setSubmissionError('Please provide a valid contact email address.');
      return;
    }
    if (!customerPhone.trim()) {
      setSubmissionError('Please provide a South African contact cellphone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const referenceNumber = generateReferenceCode('SC');
      const userId = currentUser?.uid || userProfile?.uid || 'guest_' + Date.now();

      const newRequest = await createServiceRequest({
        referenceNumber,
        serviceId: service.id,
        serviceTitle: service.title,
        category: service.categoryName,
        userId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        description: description.trim() || service.shortDescription || `Assistance requested for ${service.title}`,
        documents: attachments,
        status: 'Submitted',
      });

      // Construct automated ticket payload for WhatsApp Business
      const waMsg = formatFullTicketWhatsAppMessage({
        referenceNumber: newRequest.referenceNumber,
        serviceTitle: service.title,
        category: service.categoryName,
        feeZAR: service.feeZAR,
        turnaroundTime: service.turnaroundTime,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        description: newRequest.description,
        documents: attachments.map((a) => ({ name: a.name })),
        status: newRequest.status,
        createdAt: newRequest.createdAt,
      });

      const url = getWhatsAppLink(waMsg);
      setWhatsAppUrl(url);

      // Attempt immediate popup if permitted
      if (autoSendWhatsApp) {
        try {
          const popup = window.open(url, '_blank');
          if (popup && !popup.closed && typeof popup.closed !== 'undefined') {
            setAutoOpened(true);
          } else {
            // Popup blocker flagged, countdown handles fallback
            setAutoRedirectSeconds(2);
          }
        } catch (err) {
          console.warn('Auto WhatsApp popup blocked, countdown active:', err);
        }
      }

      setSubmittedRequest(newRequest);
      onSuccess(newRequest);
    } catch (err: any) {
      console.error('Request submission error:', err);
      setSubmissionError(
        err.message || 'Failed to submit service request. Please check your network connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRefNumber = () => {
    if (submittedRequest) {
      navigator.clipboard.writeText(submittedRequest.referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#0B132B] border border-[#D4AF37]/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#101C38] to-[#172545] border-b border-[#D4AF37]/30 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
            Service Request Ticket
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide mt-0.5">
            {submittedRequest ? 'Request Submitted Successfully!' : service.title}
          </h2>
          {!submittedRequest && (
            <p className="text-xs text-slate-300 mt-1">
              Category: {service.categoryName} • Facilitation Fee: R {service.feeZAR}.00
            </p>
          )}
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-200">
          {submittedRequest ? (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="space-y-5 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg animate-in zoom-in-75">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Your Request has been Queued</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  A ScentCafe digital support specialist has received your application. Your ticket has been saved to your account.
                </p>
              </div>

              {/* AUTOMATED WHATSAPP ROUTING CARD */}
              {autoSendWhatsApp && whatsAppUrl && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-[#0c2419] border border-emerald-500/50 text-left space-y-3 shadow-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                          Automated WhatsApp Business Routing
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          Ticket Routed to {formatWhatsAppDisplay()}
                        </h4>
                      </div>
                    </div>
                    {autoRedirectSeconds > 0 ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] uppercase font-bold border border-amber-500/40 animate-pulse">
                        Auto-opening in {autoRedirectSeconds}s...
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] uppercase font-bold border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Dispatched
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    All application details, customer info, and document summaries were compiled into a structured WhatsApp message ready for instant processing.
                  </p>

                  {/* High visibility WhatsApp launch button */}
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setAutoOpened(true)}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <Phone className="w-4 h-4 fill-slate-950" />
                    <span>Open Ticket in WhatsApp Business ({formatWhatsAppDisplay()})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Reference Code Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-[#D4AF37]/40 max-w-sm mx-auto space-y-1 text-left">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block">
                  Your Unique Reference Number
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xl font-extrabold text-[#F5D061] tracking-wider">
                    {submittedRequest.referenceNumber}
                  </span>
                  <button
                    onClick={copyRefNumber}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Copy reference code"
                  >
                    {copied ? (
                      <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Summary Steps */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-left text-xs space-y-2 text-slate-300">
                <p className="font-semibold text-white flex items-center gap-1.5 text-xs">
                  <FileText className="w-3.5 h-3.5 text-[#D4AF37]" /> What Happens Next:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
                  <li>Your reference number has been recorded in the database.</li>
                  <li>Check "My Requests" in your bottom navigation anytime for real-time progress.</li>
                  <li>Our support team will verify all provided details within {service.turnaroundTime}.</li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Close Window
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onViewMyRequests();
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#E5C158] hover:to-[#F5D061] text-[#0B132B] font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer"
                >
                  View in My Requests
                </button>
              </div>
            </div>
          ) : (
            /* SERVICE REQUEST FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {submissionError && (
                <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submissionError}</span>
                </div>
              )}

              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Customer Full Name <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Siphokazi Mthembu"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Contact Email Address <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. siphokazi@gmail.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  South African Contact Phone / WhatsApp <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 082 123 4567 or +27 71 987 6543"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* AUTOMATED WHATSAPP ROUTING TOGGLE */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-[#0e241b] border border-emerald-500/40 flex items-center justify-between gap-3 shadow-inner">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    Auto-Route Ticket to WhatsApp Business
                  </span>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Automatically sends the full ticket transcript to <strong>{formatWhatsAppDisplay()}</strong> for immediate response.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={autoSendWhatsApp}
                    onChange={(e) => {
                      setAutoSendWhatsApp(e.target.checked);
                      setAutoSendWhatsAppTicketsEnabled(e.target.checked);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Anti-Fraud / Safety Reminder */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Reminder:</strong> Do not include your internet banking PINs, SASSA card PINs, or confidential passwords. ScentCafe will never request these.
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#E5C158] hover:to-[#F5D061] text-[#0B132B] font-bold text-xs tracking-wide shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Request Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
