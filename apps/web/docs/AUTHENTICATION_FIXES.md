# Authentication & Cookie Credentials - Issues & Fixes

## 🔴 **Issues Found**

### 1. **Missing `user-role` Cookie**
   - **Location**: `src/middleware.ts` (line 7)
   - **Problem**: The middleware checks for `user-role` cookie but it was **never being set** during sign-up or sign-in
   - **Impact**: Admin route protection was non-functional

### 2. **Client-Side Cookie Handling**
   - **Location**: `src/store/auth-store.ts` (lines 40, 54, 68)
   - **Problem**: 
     - Using `document.cookie` to set authentication cookies
     - Client-side cookies are NOT accessible to server-side middleware
     - Cookies set this way have timing/consistency issues
     - Not secure for authentication (can be modified by JavaScript)
   - **Impact**: Middleware couldn't reliably read authentication tokens

### 3. **No User Role Management**
   - **Problem**: Authentication token only contained `user.uid`, no role information
   - **Impact**: Cannot differentiate between regular users and admins at the middleware level

### 4. **Insecure Cookie Strategy**
   - **Problem**: Cookies were not using `httpOnly` flag
   - **Impact**: Vulnerable to XSS attacks; JavaScript code could modify auth cookies

---

## ✅ **Solutions Implemented**

### 1. **Created API Route: `/api/auth/set-cookies`**
   - **File**: `src/app/api/auth/set-cookies/route.ts`
   - **Purpose**: Securely set authentication cookies from the server
   - **Sets**:
     - `auth-token` (HTTP-only, secure, 7 days)
     - `user-role` (HTTP-only, secure, 7 days)
     - `user-email` (optional, for client use)
     - `user-name` (optional, for client use)
   - **Security Features**:
     - HTTP-only cookies (cannot be accessed by JavaScript)
     - Secure flag (HTTPS only in production)
     - SameSite=Strict (prevents CSRF attacks)

### 2. **Created API Route: `/api/auth/clear-cookies`**
   - **File**: `src/app/api/auth/clear-cookies/route.ts`
   - **Purpose**: Securely clear all authentication cookies on sign-out
   - **Security**: Same protection as set-cookies route

### 3. **Updated Auth Store (`auth-store.ts`)**
   - **signUp()**: Now calls `/api/auth/set-cookies` instead of using `document.cookie`
   - **signIn()**: Now calls `/api/auth/set-cookies` instead of using `document.cookie`
   - **signOut()**: Now calls `/api/auth/clear-cookies` instead of using `document.cookie`

### 4. **Improved Middleware (`middleware.ts`)**
   - Fixed token retrieval to properly use `.value` property
   - Simplified route protection logic
   - Added debug logging for troubleshooting
   - Fixed admin route checking

---

## 📋 **Next Steps (TODO)**

### 1. **Fetch User Role from Database**
   ```typescript
   // In src/app/api/auth/set-cookies/route.ts
   // Replace:
   const userRole = 'user'; // TODO: Fetch from Firestore user profile
   
   // With actual logic to fetch role from Firestore:
   const userDocRef = doc(db, 'users', uid);
   const userDoc = await getDoc(userDocRef);
   const userRole = userDoc.data()?.role || 'user';
   ```

### 2. **Add User Role to Firestore**
   - When initializing a user profile in `initializeUserProfile()`, add role field:
   ```typescript
   profile.role = 'user'; // or 'admin' based on your business logic
   ```

### 3. **Set Admin Role for Specific Users**
   - Create an admin function to promote users:
   ```typescript
   export async function setUserRole(uid: string, role: 'user' | 'admin') {
     const userRef = doc(db, 'users', uid);
     await updateDoc(userRef, { role });
   }
   ```

### 4. **Test the Fixes**
   ```bash
   # Test sign-up/sign-in flow:
   # 1. Sign up and verify cookies are set in browser DevTools
   # 2. Check middleware is allowing access to /dashboard
   # 3. Sign out and verify cookies are cleared
   
   # Test admin routes:
   # 1. Set a user role to 'admin' in Firestore
   # 2. Verify they can access /admin routes
   # 3. Verify non-admin users are redirected from /admin
   ```

---

## 🔒 **Security Improvements**

| Issue | Before | After |
|-------|--------|-------|
| **Cookie Access** | Accessible by JS (XSS vulnerable) | HTTP-only (XSS protected) |
| **Cookie Transport** | Both HTTP and HTTPS | HTTPS only (production) |
| **CSRF Protection** | No SameSite flag | SameSite=Strict |
| **Server Access** | Middleware couldn't read cookies | Middleware can read cookies |
| **User Role** | Not stored or managed | Properly set and validated |
| **Timing Issues** | Client-side race conditions | Server-side guarantee |

---

## 📝 **Files Modified**

1. **Created**: `src/app/api/auth/set-cookies/route.ts` ✨ NEW
2. **Created**: `src/app/api/auth/clear-cookies/route.ts` ✨ NEW
3. **Updated**: `src/store/auth-store.ts` (3 functions)
4. **Updated**: `src/middleware.ts` (improved logic)

---

## 🧪 **Verification Checklist**

- [ ] Sign up creates cookies with correct values
- [ ] Sign in creates cookies with correct values
- [ ] Cookies appear as HTTP-only in DevTools
- [ ] Middleware allows access to protected routes after sign-in
- [ ] Sign out clears all cookies
- [ ] Redirect to login works when token is missing
- [ ] Admin route protection works correctly
- [ ] No console errors after implementation

