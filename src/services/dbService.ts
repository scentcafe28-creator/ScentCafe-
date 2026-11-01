import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { NotificationItem, ServiceRequest, ServiceStatus } from '../types';

const LOCAL_REQUESTS_KEY = 'scentcafe_local_requests';
const LOCAL_NOTIFICATIONS_KEY = 'scentcafe_local_notifications';

// Helper to get local storage array
function getLocalArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalArray<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.error('Error writing to localStorage', err);
  }
}

// Generate unique reference numbers like SC-2026-8291
export function generateReferenceCode(prefix: string = 'SC'): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${random}`;
}

// SERVICE REQUESTS
export async function createServiceRequest(
  requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ServiceRequest> {
  const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const fullRequest: ServiceRequest = {
    ...requestData,
    id,
    createdAt: now,
    updatedAt: now,
  };

  // Optimistic local save
  const existingLocal = getLocalArray<ServiceRequest>(LOCAL_REQUESTS_KEY);
  saveLocalArray(LOCAL_REQUESTS_KEY, [fullRequest, ...existingLocal]);

  // Push in-app notification
  createInAppNotification({
    userId: fullRequest.userId,
    title: `Request Submitted: ${fullRequest.referenceNumber}`,
    message: `Your assistance request for "${fullRequest.serviceTitle}" has been received and queued for review.`,
    type: 'request',
    relatedId: fullRequest.id,
  });

  // Write to Firestore
  try {
    await setDoc(doc(db, 'service_requests', id), fullRequest);
  } catch (error) {
    console.warn('Firestore write notice (stored locally):', error);
    // Don't crash user if offline or rules are settling, user sees request safely
  }

  return fullRequest;
}

export function subscribeToUserRequests(
  userId: string,
  callback: (requests: ServiceRequest[]) => void
): () => void {
  const localItems = getLocalArray<ServiceRequest>(LOCAL_REQUESTS_KEY).filter(
    (r) => r.userId === userId
  );
  callback(localItems);

  if (!userId) return () => {};

  try {
    const q = query(
      collection(db, 'service_requests'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const firestoreList: ServiceRequest[] = [];
        snapshot.forEach((d) => {
          firestoreList.push(d.data() as ServiceRequest);
        });

        // Merge firestore with local
        const mergedMap = new Map<string, ServiceRequest>();
        localItems.forEach((item) => mergedMap.set(item.id, item));
        firestoreList.forEach((item) => mergedMap.set(item.id, item));

        const merged = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        callback(merged);
      },
      (error) => {
        console.warn('Requests snapshot notice:', error);
        callback(localItems);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.warn('Subscribe requests error:', error);
    return () => {};
  }
}

export async function getAllRequestsForAdmin(): Promise<ServiceRequest[]> {
  try {
    const snap = await getDocs(collection(db, 'service_requests'));
    const list: ServiceRequest[] = [];
    snap.forEach((d) => list.push(d.data() as ServiceRequest));
    const local = getLocalArray<ServiceRequest>(LOCAL_REQUESTS_KEY);

    const mergedMap = new Map<string, ServiceRequest>();
    local.forEach((item) => mergedMap.set(item.id, item));
    list.forEach((item) => mergedMap.set(item.id, item));

    return Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.warn('Admin fetch requests:', error);
    return getLocalArray<ServiceRequest>(LOCAL_REQUESTS_KEY);
  }
}

export async function updateServiceRequestStatus(
  requestId: string,
  status: ServiceStatus,
  adminNotes?: string,
  customerNote?: string
): Promise<void> {
  const now = new Date().toISOString();

  // Local update
  const local = getLocalArray<ServiceRequest>(LOCAL_REQUESTS_KEY);
  const updatedLocal = local.map((req) => {
    if (req.id === requestId) {
      const updated = {
        ...req,
        status,
        adminNotes: adminNotes ?? req.adminNotes,
        customerNote: customerNote ?? req.customerNote,
        updatedAt: now,
      };

      // Notify customer
      createInAppNotification({
        userId: req.userId,
        title: `Request ${req.referenceNumber} Updated`,
        message: `Your request status changed to "${status}". ${customerNote ? `Note: ${customerNote}` : ''}`,
        type: 'request',
        relatedId: req.id,
      });

      return updated;
    }
    return req;
  });
  saveLocalArray(LOCAL_REQUESTS_KEY, updatedLocal);

  // Firestore update
  try {
    await updateDoc(doc(db, 'service_requests', requestId), {
      status,
      ...(adminNotes ? { adminNotes } : {}),
      ...(customerNote ? { customerNote } : {}),
      updatedAt: now,
    });
  } catch (error) {
    console.warn('Firestore update warning:', error);
  }
}

// IN-APP NOTIFICATIONS
export function createInAppNotification(
  notif: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>
): NotificationItem {
  const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const item: NotificationItem = {
    ...notif,
    id,
    read: false,
    createdAt: new Date().toISOString(),
  };

  const existing = getLocalArray<NotificationItem>(LOCAL_NOTIFICATIONS_KEY);
  saveLocalArray(LOCAL_NOTIFICATIONS_KEY, [item, ...existing]);

  try {
    setDoc(doc(db, 'notifications', id), item).catch(() => {});
  } catch {
    // Silent
  }

  return item;
}

export function subscribeToUserNotifications(
  userId: string,
  callback: (notifications: NotificationItem[]) => void
): () => void {
  const local = getLocalArray<NotificationItem>(LOCAL_NOTIFICATIONS_KEY).filter(
    (n) => n.userId === userId || n.userId === 'all'
  );
  callback(local);

  if (!userId) return () => {};

  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const firestoreList: NotificationItem[] = [];
        snapshot.forEach((d) => firestoreList.push(d.data() as NotificationItem));

        const mergedMap = new Map<string, NotificationItem>();
        local.forEach((item) => mergedMap.set(item.id, item));
        firestoreList.forEach((item) => mergedMap.set(item.id, item));

        const merged = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        callback(merged);
      },
      () => {
        callback(local);
      }
    );
    return unsubscribe;
  } catch {
    return () => {};
  }
}

export function markNotificationAsRead(id: string): void {
  const local = getLocalArray<NotificationItem>(LOCAL_NOTIFICATIONS_KEY);
  const updated = local.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveLocalArray(LOCAL_NOTIFICATIONS_KEY, updated);

  try {
    updateDoc(doc(db, 'notifications', id), { read: true }).catch(() => {});
  } catch {
    // Silent
  }
}

export function markAllNotificationsAsRead(userId: string): void {
  const local = getLocalArray<NotificationItem>(LOCAL_NOTIFICATIONS_KEY);
  const updated = local.map((n) =>
    n.userId === userId ? { ...n, read: true } : n
  );
  saveLocalArray(LOCAL_NOTIFICATIONS_KEY, updated);
}
