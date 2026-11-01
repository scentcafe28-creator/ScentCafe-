export type ServiceStatus =
  | 'Submitted'
  | 'In Review'
  | 'Awaiting Customer'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export type ServiceCategoryType =
  | 'government'
  | 'careers'
  | 'education'
  | 'business';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: 'customer' | 'admin';
  address?: string;
  city?: string;
  province?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceItem {
  id: string;
  categoryId: ServiceCategoryType;
  categoryName: string;
  title: string;
  shortDescription: string;
  detailedGuide: string;
  officialUrl?: string;
  officialName?: string;
  isExternalOfficial?: boolean;
  requiredDocuments: string[];
  turnaroundTime: string;
  feeZAR: number;
  popular?: boolean;
  badge?: string;
  disclaimer: string;
}

export interface RequestAttachment {
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  uploadedAt: string;
}

export interface ServiceRequest {
  id: string;
  referenceNumber: string;
  serviceId: string;
  serviceTitle: string;
  category: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
  documents?: RequestAttachment[];
  status: ServiceStatus;
  adminNotes?: string;
  customerNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'system';
  relatedId?: string;
  read: boolean;
  createdAt: string;
}
