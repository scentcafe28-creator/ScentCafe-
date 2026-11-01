# ScentCafe Security Specification & Audit

## Data Invariants
1. **Admins Collection**: Only documented administrators (matching `exists(/databases/$(database)/documents/admins/$(request.auth.uid))`) or authenticated bootstrap admin `somasina1999@gmail.com` can perform privileged operations. Normal users cannot write to the `admins` collection.
2. **User Profiles (`/users/{userId}`)**: A user can only create, read, and update their own document matching `request.auth.uid`. Role privilege escalation is strictly forbidden (users cannot grant themselves admin rights).
3. **Service Requests (`/service_requests/{requestId}`)**: A customer can only create a service request where `userId == request.auth.uid`. A customer can read their own service requests. Admins can read and update all service requests (to update status, assign staff, and add internal notes). Customers cannot alter status or tamper with other customers' requests.
4. **Orders (`/orders/{orderId}`)**: A customer can create and read their own orders where `userId == request.auth.uid`. Admins can read all orders and update statuses.
5. **Products & Services Catalog (`/products/{productId}`, `/services/{serviceId}`, `/local_providers/{providerId}`)**: Publicly readable by all users (customers and visitors). Write access restricted strictly to verified Administrators.
6. **Notifications (`/notifications/{notificationId}`)**: A user can only read and mark as read notifications where `userId == request.auth.uid`. Admins and backend can dispatch notifications.

## The Dirty Dozen Security Payloads (Penetration Test Vectors)
1. **Payload 1 (Privilege Escalation via Profile Write):** Non-admin user attempts to create or update `/users/{uid}` with `role: "admin"`. -> REJECTED: Validation helper forbids client-set admin role.
2. **Payload 2 (Admin Collection Self-Injection):** Unauthenticated or non-admin user attempts `setDoc` on `/admins/{uid}`. -> REJECTED: Only existing admins can write.
3. **Payload 3 (Impersonated Service Request):** User A submits a service request with `userId: "UserB_UID"`. -> REJECTED: Identity integrity helper validates `incoming().userId == request.auth.uid`.
4. **Payload 4 (Cross-Customer Request Inspection):** User A tries to `getDoc` or query `/service_requests` belonging to User B. -> REJECTED: Read rule enforces `resource.data.userId == request.auth.uid || isAdmin()`.
5. **Payload 5 (Status Manipulation by Customer):** Customer attempts to update `status` from "Submitted" to "Completed" directly. -> REJECTED: Customer status updates are forbidden; status updates require `isAdmin()`.
6. **Payload 6 (Shadow Key Injection):** Attacker sends service request payload with arbitrary extra fields (`maliciousPayload: true`). -> REJECTED: Strict key schema enforced via `hasOnly()`.
7. **Payload 7 (Mass Document / DoS Payload):** Attacker sends a 5MB string inside `description`. -> REJECTED: Character length limits (`size() <= 2000`) strictly enforced.
8. **Payload 8 (Product Price Tampering):** Non-admin attempts to edit `/products/{id}` setting price to R0.01. -> REJECTED: `write` on `/products` requires `isAdmin()`.
9. **Payload 9 (Order Forgery):** Attacker places order with `userId: "another_user"`. -> REJECTED: `incoming().userId == request.auth.uid`.
10. **Payload 10 (Notification Snooping):** Attacker lists `/notifications` for all users without filter. -> REJECTED: Query enforcer checks `resource.data.userId == request.auth.uid`.
11. **Payload 11 (Unauthenticated Request Creation):** Guest/unauthenticated user attempts write to `/service_requests`. -> REJECTED: `isSignedIn()` required.
12. **Payload 12 (Admin Override Spoofing):** Non-admin attempts to bypass terminal status lock on completed request. -> REJECTED: State transition gate enforces terminal locking except for verified admins.
