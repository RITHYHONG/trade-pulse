# Google Authentication Setup Guide for Trade Pulse

## 🔧 Firebase Console Configuration

### Step 1: Enable Google Sign-In in Firebase Console

1. **Go to Firebase Console**: https://console.firebase.google.com/project/trade-pulse-b9fc4
2. **Navigate to Authentication** > **Sign-in method**
3. **Find Google** in the list of providers
4. **Click on Google** to configure it
5. **Enable Google Sign-in**
6. **Configure the settings**:
   - **Project support email**: Your email address (required)
   - **Project public-facing name**: "Trade Pulse" (or "project-1081863298443")
7. **Add authorized domains** if needed:
   - `localhost` (for development) - usually already included
   - Your production domain when you deploy
8. **Save the configuration**

### Step 2: Configure OAuth Consent Screen (if needed)

1. **Go to Google Cloud Console**: https://console.cloud.google.com/apis/credentials/consent?project=trade-pulse-b9fc4
2. **Configure the OAuth consent screen**:
   - **App name**: Trade Pulse
   - **User support email**: Your email
   - **Developer contact email**: Your email
   - **App domain**: Your website domain (when you have one)
   - **Privacy policy**: Link to your privacy policy (when available)
   - **Terms of service**: Link to your terms (when available)

### Step 3: Test Your Configuration

1. **Start your development server**:
   ```bash
   yarn dev
   ```

2. **Navigate to**: http://localhost:3000/login

3. **Click "Continue with Google"**

4. **You should see a Google sign-in popup**

## 🚀 What We've Implemented

### ✅ Features Added:

1. **Google OAuth Integration**
   - Full Google sign-in functionality
   - Popup-based authentication
   - Error handling for common issues

2. **Seamless User Experience**
   - Automatic profile creation for Google users
   - Session management
   - Proper error messages

3. **Security Best Practices**
   - Secure token handling
   - Proper scope requests
   - Account selection prompt

### 🔧 Code Changes Made:

1. **`src/lib/auth.ts`**
   - Added Google OAuth provider
   - Implemented `signInWithGoogle()` function
   - Added proper error handling

2. **`src/store/auth-store.ts`**
   - Added `signInWithGoogle` action
   - Integrated with existing auth flow
   - User profile initialization

3. **`src/hooks/use-auth.ts`**
   - Exposed Google sign-in method
   - Maintained existing API consistency

4. **Form Components**
   - **LoginForm**: Enabled Google button with click handler
   - **SignUpForm**: Added Google sign-up functionality
   - Both forms show loading states

## 🔍 How to Test

1. **Start development server**
2. **Go to login/signup page**
3. **Click "Continue with Google"**
4. **Select your Google account**
5. **You should be redirected to the dashboard**

## 🐛 Common Issues & Solutions

### Issue: "Content Security Policy" Error
**Problem**: `Loading the script 'https://apis.google.com/js/api.js?onload=__iframefcb698884' violates the following Content Security Policy directive`

**Solution**: ✅ **FIXED!** The issue was caused by restrictive CSP headers in `middleware.ts`. I've updated both the middleware and next.config.ts to disable CSP in development mode.

**What was fixed**:
1. **Middleware CSP**: Disabled in development, updated for production
2. **Next.js headers**: Configured to allow Google domains in production
3. **Development mode**: No CSP restrictions for easier Google auth testing

**Test steps**:
1. **Restart your development server** (already done):
   ```bash
   yarn dev
   ```

2. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)

3. **Test at**: http://localhost:3000/login

4. **Click "Continue with Google"** - should work without CSP errors!

### Issue: "auth/operation-not-allowed"
**Problem**: `Firebase: Error (auth/operation-not-allowed)`

**Solution**: Google Sign-in is not enabled in Firebase Console.

1. **Go to Firebase Console**: https://console.firebase.google.com/project/trade-pulse-b9fc4/authentication/providers
2. **Find Google** in the Sign-in providers list
3. **Click on Google** and toggle **Enable** to ON
4. **Enter your support email** (required field)
5. **Click Save**
6. **Test again** - should work immediately

### Issue: User profile not loading after Google sign-in
**Problem**: Authentication works but user profile data is missing

**Solution**: Check browser console for detailed logs during sign-in:

1. **Open browser DevTools** (F12) → Console tab
2. **Click "Continue with Google"** and watch the console
3. **Look for these log messages**:
   - "Google sign-in successful"
   - "User data from Firebase"
   - "Creating new user profile" or "User profile already exists"
   - "User profile created successfully"

**Common causes**:
- **Firestore permissions**: Check if user can write to Firestore
- **Profile initialization delay**: Profile creation happens asynchronously
- **Photo URL issues**: Google profile photos may not load immediately

### Issue: "Popup blocked"
**Solution**: The app now automatically falls back to redirect-based authentication if popups are blocked

### Issue: "Unauthorized domain"
**Solution**: Add your domain to Firebase authorized domains

### Issue: "OAuth consent screen not configured"
**Solution**: Complete Step 2 above in Google Cloud Console

### Issue: "Invalid API key"
**Solution**: Check your Firebase environment variables

## 🔐 Environment Variables Required

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

## 📝 Next Steps

1. **Test Google authentication**
2. **Configure production domains** when deploying
3. **Customize OAuth consent screen** with your branding
4. **Consider adding more providers** (GitHub, Microsoft, etc.)

## 🎯 Benefits

- **Faster user onboarding** (no password required)
- **Better security** (Google handles authentication)
- **Improved user experience** (familiar Google login)
- **Reduced friction** for new users