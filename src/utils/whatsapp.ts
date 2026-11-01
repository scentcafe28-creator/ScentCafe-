export const DEFAULT_WHATSAPP_NUMBER_RAW = '27646438872';
export const DEFAULT_WHATSAPP_DISPLAY = '064 643 8872';
export const DEFAULT_WHATSAPP_INTERNATIONAL = '+27 64 643 8872';

const STORAGE_KEY_PHONE = 'scentcafe_whatsapp_business_phone';
const STORAGE_KEY_AUTOSEND = 'scentcafe_whatsapp_autosend_tickets';

/**
 * Clean and format South African or international phone number
 */
export function normalizeWhatsAppNumber(input?: string): string {
  if (!input) return DEFAULT_WHATSAPP_NUMBER_RAW;
  const digits = input.replace(/\D/g, '');
  if (!digits) return DEFAULT_WHATSAPP_NUMBER_RAW;

  // If starts with 0 and 10 digits (e.g. 0646438872) -> South Africa country code 27
  if (digits.startsWith('0') && digits.length === 10) {
    return '27' + digits.slice(1);
  }
  // If already starts with 27
  if (digits.startsWith('27')) {
    return digits;
  }
  return digits;
}

/**
 * Format raw WhatsApp number for clean South African user display (e.g. 064 643 8872)
 */
export function formatWhatsAppDisplay(rawNumber?: string): string {
  const norm = normalizeWhatsAppNumber(rawNumber || getWhatsAppBusinessNumber());
  if (norm.startsWith('27') && norm.length === 11) {
    const local = '0' + norm.slice(2);
    return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
  }
  return norm;
}

/**
 * Retrieve current WhatsApp Business phone number (from localStorage or default)
 */
export function getWhatsAppBusinessNumber(): string {
  if (typeof window === 'undefined') return DEFAULT_WHATSAPP_NUMBER_RAW;
  const stored = localStorage.getItem(STORAGE_KEY_PHONE);
  return normalizeWhatsAppNumber(stored || DEFAULT_WHATSAPP_NUMBER_RAW);
}

/**
 * Save customized WhatsApp Business phone number
 */
export function setWhatsAppBusinessNumber(phoneNumber: string): void {
  if (typeof window === 'undefined') return;
  const normalized = normalizeWhatsAppNumber(phoneNumber);
  localStorage.setItem(STORAGE_KEY_PHONE, normalized);
  window.dispatchEvent(new Event('scentcafe_whatsapp_changed'));
}

/**
 * Check if automated WhatsApp ticket forwarding is enabled (default: true)
 */
export function isAutoSendWhatsAppTicketsEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(STORAGE_KEY_AUTOSEND);
  return stored !== 'false';
}

/**
 * Set automated WhatsApp ticket forwarding preference
 */
export function setAutoSendWhatsAppTicketsEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_AUTOSEND, enabled ? 'true' : 'false');
  window.dispatchEvent(new Event('scentcafe_whatsapp_changed'));
}

export const WHATSAPP_BUSINESS_NUMBER_RAW = DEFAULT_WHATSAPP_NUMBER_RAW;
export const WHATSAPP_BUSINESS_DISPLAY = DEFAULT_WHATSAPP_DISPLAY;
export const WHATSAPP_BUSINESS_INTERNATIONAL = DEFAULT_WHATSAPP_INTERNATIONAL;

/**
 * Generate a direct WhatsApp click-to-chat URL with prefilled message
 */
export function getWhatsAppLink(message?: string, customPhone?: string): string {
  const targetPhone = normalizeWhatsAppNumber(customPhone || getWhatsAppBusinessNumber());
  const base = `https://wa.me/${targetPhone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export interface TicketWhatsAppPayload {
  referenceNumber: string;
  serviceTitle: string;
  category?: string;
  feeZAR?: number;
  turnaroundTime?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  description: string;
  documents?: { name: string }[];
  status?: string;
  createdAt?: string;
}

/**
 * Formats a rich, professional, and automated ticket summary for WhatsApp Business
 */
export function formatFullTicketWhatsAppMessage(data: TicketWhatsAppPayload): string {
  const dateStr = data.createdAt
    ? new Date(data.createdAt).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })
    : new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' });

  const docsSection =
    data.documents && data.documents.length > 0
      ? `\n📎 *Attached Documents (${data.documents.length}):*\n${data.documents
          .map((d, i) => `  ${i + 1}. ${d.name}`)
          .join('\n')}`
      : '\n📎 *Attached Documents:* None provided';

  const feeText =
    data.feeZAR !== undefined ? `\n💰 *Facilitation Fee:* R ${data.feeZAR}.00` : '';
  const turnaroundText = data.turnaroundTime
    ? `\n⏱️ *Est. Turnaround:* ${data.turnaroundTime}`
    : '';

  return `🎫 *NEW SERVICE TICKET — SCENTCAFE*
━━━━━━━━━━━━━━━━━━━━━
📋 *Ticket Ref:* ${data.referenceNumber}
🏛️ *Service:* ${data.serviceTitle}${data.category ? `\n📂 *Category:* ${data.category}` : ''}${feeText}${turnaroundText}

👤 *Customer Details:*
• *Name:* ${data.customerName}
• *Cell / WhatsApp:* ${data.customerPhone}
• *Email:* ${data.customerEmail}

📝 *Assistance Description:*
${data.description}
${docsSection}

⏰ *Date:* ${dateStr}
━━━━━━━━━━━━━━━━━━━━━
_Sent automatically via ScentCafe Digital Services Portal_`;
}

/**
 * Generate full automated WhatsApp ticket URL
 */
export function getServiceRequestWhatsAppLink(
  referenceNumber: string,
  serviceTitle: string,
  customerName?: string
): string {
  const greeting = customerName ? `Hello ScentCafe, my name is ${customerName}.` : 'Hello ScentCafe,';
  const text = `${greeting} I am following up on my service ticket:
• Reference: ${referenceNumber}
• Service: ${serviceTitle}

Could you please assist me with the latest status or next steps?`;
  return getWhatsAppLink(text);
}

/**
 * Generate general consultation WhatsApp link
 */
export function getGeneralWhatsAppLink(): string {
  const text = 'Hello ScentCafe, I would like assistance with South African digital services and application facilitation.';
  return getWhatsAppLink(text);
}
