# 🚀 Trade Pulse Deployment Checklist

Follow these steps to deploy your Next.js application to **Firebase App Hosting**. This is the recommended method as it supports all Next.js features (SSR, Middleware, etc.).

## Phase 1: Local Preparation
- [ ] **Verify Build**: Run `npm run build` to ensure there are no production errors. (✅ *Already verified by Antigravity*)
- [ ] **Push to GitHub**: Ensure all your latest changes are pushed to your repository: `https://github.com/RITHYHONG/trade-pulse`.
- [ ] **Firebase Login**: Run `firebase login` in your terminal to ensure you are authenticated.

## Phase 2: Security & Database (Run these now)
Click the "Run" button if Antigravity proposes these commands:
```bash
# Deploy security rules and database indexes
firebase deploy --only firestore,storage
```

## Phase 3: Firebase Console Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **trade-pulse-b9fc4**.
3. In the left menu, go to **Build** > **App Hosting**.
4. Click **Get Started**.
5. **Connect to GitHub**:
   - Link your GitHub account.
   - Select the repository: `RITHYHONG/trade-pulse`.
6. **Configure Deployment**:
   - **Backend ID**: `trade-pulse-web` (or your choice).
   - **Branch**: `main`.
   - **Root Directory**: `/`.
7. **Complete**: Firebase will now attempt to build and deploy your site.

## Phase 4: Environment Variables (CRITICAL)
Your app will fail to build or run if it can't find your Firebase keys.
1. In the Firebase Console, go to **App Hosting** > Your Backend > **Settings**.
2. Find the **Environment Variables** section.
3. Add the following keys from your local `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## Phase 5: Domain Configuration (Optional)
1. In the **App Hosting** dashboard, look for the "Domains" section.
2. You will have a default `.web.app` URL.
3. Click "Connect Domain" if you want to use a custom domain (e.g., `trade-pulse.com`).

---

**Need Help?** Just ask Antigravity to explain any specific step!
