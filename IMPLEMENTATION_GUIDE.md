# 🚀 Implementation Guide - Cookie & Profile Credentials Fix

## Overview
This guide walks you through implementing the authentication cookie fixes to properly manage user credentials and profile data.

---

## Phase 1: Verify Changes (Already Done ✅)

The following changes have already been applied:

### New Files Created:
- ✅ `src/app/api/auth/set-cookies/route.ts` - Securely sets auth cookies
- ✅ `src/app/api/auth/clear-cookies/route.ts` - Clears auth cookies on sign-out
- ✅ `src/lib/user-role-helper.ts` - Helper functions for user role management

### Files Updated:
- ✅ `src/store/auth-store.ts` - Uses new API routes for cookie management
- ✅ `src/middleware.ts` - Improved middleware with proper cookie validation

---

## Phase 2: Enable User Role Management (Next Step)

### Step 1: Update `set-cookies` API to Fetch Actual User Role

**File**: `src/app/api/auth/set-cookies/route.ts`

Replace this line:
```typescript
// Default role is 'user' - you can add logic here to fetch actual role from database
const userRole = 'user'; // TODO: Fetch from Firestore user profile
```

With:
```typescript
// Fetch actual user role from Firestore
import { getUserRole } from '@/lib/user-role-helper';

const userRole = await getUserRole(uid);
```

### Step 2: Add Role Field to User Profile

**File**: `src/lib/firestore-service.ts`

Update the `UserProfile` interface to include role:
```typescript
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: 'user' | 'admin';  // Add this line
  bio?: string;
  photoURL?: string;
  // ... rest of fields
}
```

Update `initializeUserProfile` function:
```typescript
export async function initializeUserProfile(user: FirebaseUser): Promise<void> {
  // ... existing code ...
  
  const profile: UserProfile = {
    uid: user.uid,
    displayName: user.displayName || '',
    email: user.email || '',
    role: 'user', // Default to user role
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  // ... rest of function
}
```

### Step 3: Add Admin Management Function

**File**: `src/app/api/admin/promote-user/route.ts` (Create New)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { setUserRole } from '@/lib/user-role-helper';

/**
 * POST /api/admin/promote-user
 * Promotes a user to admin (only for admins)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the requester is an admin
    const adminToken = request.cookies.get('auth-token')?.value;
    const adminRole = request.cookies.get('user-role')?.value;

    if (!adminToken || adminRole !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { uid } = await request.json();
    
    if (!uid) {
      return NextResponse.json(
        { error: 'Missing uid' },
        { status: 400 }
      );
    }

    // Promote user to admin
    await setUserRole(uid, 'admin');

    return NextResponse.json({ 
      success: true,
      message: `User ${uid} promoted to admin`
    });
  } catch (error) {
    console.error('Error promoting user:', error);
    return NextResponse.json(
      { error: 'Failed to promote user' },
      { status: 500 }
    );
  }
}
```

---

## Phase 3: Testing

### Test Checklist

#### Test 1: Sign-Up Flow
```bash
1. Navigate to /signup
2. Fill in form and submit
3. Open DevTools → Application → Cookies
4. Verify you see:
   - auth-token (HTTP-only, path=/)
   - user-role (HTTP-only, value='user')
   - user-email (optional)
   - user-name (optional)
5. You should be redirected to /dashboard
```

#### Test 2: Sign-In Flow
```bash
1. Sign out if logged in
2. Navigate to /login
3. Fill in credentials and submit
4. Verify cookies are set (same as Test 1)
5. You should be redirected to previous page or /dashboard
```

#### Test 3: Protected Routes
```bash
1. Sign out completely
2. Try accessing /dashboard directly
3. You should be redirected to /login
4. Sign in again
5. You should have access to /dashboard
```

#### Test 4: Sign-Out Flow
```bash
1. While signed in, click sign out
2. Open DevTools → Application → Cookies
3. Verify all auth cookies are cleared
4. Try accessing /dashboard
5. You should be redirected to /login
```

#### Test 5: Admin Routes (requires promotion)
```bash
1. Promote a test user to admin via API or database
2. Sign in with that user
3. Verify user-role cookie = 'admin'
4. Try accessing /admin routes
5. Should have full access
6. Sign in with regular user
7. Try accessing /admin routes
8. Should be redirected to /dashboard
```

### Manual Testing Commands

```bash
# Check cookies in current session
# In browser console:
document.cookie

# Clear all cookies (for testing)
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
```

---

## Phase 4: Troubleshooting

### Issue: Cookies not appearing in DevTools

**Cause**: Browser may not immediately reflect cookie changes

**Solution**:
1. Hard refresh the page (Ctrl+Shift+R)
2. Close and reopen DevTools
3. Check the "Secure" filter if in production

### Issue: Middleware redirects on every request

**Cause**: Cookies not being read properly

**Solution**:
1. Check middleware debug logs in console
2. Verify cookies are being set via Network tab
3. Ensure middleware matcher patterns are correct

### Issue: Admin routes not working

**Cause**: User doesn't have admin role

**Solution**:
1. Verify user role in Firestore
2. Check set-cookies endpoint fetches role correctly
3. Manually test `setUserRole` function

---

## Phase 5: Security Hardening (Optional)

### Additional Security Measures

1. **Rate Limiting**: Add rate limiting to `/api/auth/set-cookies`
   ```typescript
   // Consider using a library like `rate-limit`
   ```

2. **CSRF Token**: Add CSRF token validation if not using SameSite=Strict

3. **Token Rotation**: Implement token rotation on each request

4. **Audit Logging**: Log all authentication events

5. **Email Verification**: Require email verification before granting access

---

## Phase 6: Production Deployment

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] Cookies using `secure: true` in production
- [ ] HTTPS enforced
- [ ] CSP headers properly configured
- [ ] Admin users promoted in production
- [ ] Backup of Firestore schema
- [ ] Monitoring/alerting setup

### Deployment Commands

```bash
# Build
npm run build

# Test build locally
npm run build && npm run start

# Deploy to production
# (Using your deployment platform, e.g., Vercel, Firebase Hosting, etc.)
```

---

## File Summary

| File | Purpose | Status |
|------|---------|--------|
| `src/app/api/auth/set-cookies/route.ts` | Set auth cookies securely | ✅ Ready |
| `src/app/api/auth/clear-cookies/route.ts` | Clear auth cookies | ✅ Ready |
| `src/lib/user-role-helper.ts` | Manage user roles | ✅ Ready |
| `src/store/auth-store.ts` | Updated auth flow | ✅ Updated |
| `src/middleware.ts` | Protect routes | ✅ Updated |
| `src/lib/firestore-service.ts` | Add role field | 🔲 Manual |

---

## Support & Questions

If you encounter issues:
1. Check the debug logs in middleware
2. Verify Firestore security rules allow role reads
3. Ensure all API routes are deployed
4. Test in incognito window (clean cookies)

For more details, see:
- `docs/AUTHENTICATION_FIXES.md` - Technical details
- `CREDENTIAL_FIXES_SUMMARY.md` - Quick overview

