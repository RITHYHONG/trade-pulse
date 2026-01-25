🚨 Critical Security Issues
1. Firestore Role Escalation (High Risk)
In 
firestore.rules
, users are given write access to their own profile document, which includes the role field.

Vulnerability: Any authenticated user can open the browser console and run a script to update their role to 'admin'.
Location: 
firestore.rules
 (lines 9-11) and 
src/lib/user-role-helper.ts
 (line 32).
Recommendation:
Disable client-side role updates: In Firestore rules, ensure the role field cannot be modified by the user: allow update: if request.auth != null && request.resource.data.role == resource.data.role.
Use Custom Claims: Manage roles via Firebase Auth Custom Claims, which are set via a secure backend (Firebase Functions) and cannot be modified by the client.


2. Insecure Cookie Authentication
The middleware and API routes use the user's plain uid as the auth-token cookie.

Vulnerability: A uid is not a secret session token. If an attacker knows a user's uid, they can set their own cookie and impersonate that user. The 
middleware.ts
 merely checks for the existence of this cookie.
Location: 
src/app/api/auth/set-cookies/route.ts
 (line 30).
Recommendation: Use Firebase Session Cookies. Exchange the ID token for a session cookie on the server using firebase-admin and verify it in the middleware.



3. Exposed Financial API Keys
Several API keys are prefixed with NEXT_PUBLIC_, making them visible to anyone visiting the site.

Vulnerability: Keys for Alpha Vantage, FMP, and Finnhub are exposed in the client-side bundle. Attackers can steal these keys, hitting your rate limits or incurring costs.
Location: 
src/services/economic-calendar.service.ts
 (lines 29-30) and 
src/lib/market-data-service.ts
 (line 12).
Recommendation: Remove the NEXT_PUBLIC_ prefix and move all data-fetching logic to Next.js API Routes or Server Actions.


⚡ Performance Bottlenecks

1. Excessive Re-renders in 
HeatMapView
The 
HeatMapView
 component uses a setInterval that triggers a state update every second.

Issue: This causes the entire grid (which is a large DOM structure with many motion.div elements) to re-render every second, even if nothing in the grid changed.
Location: 
src/app/calendar/components/economic-calendar/HeatMapView.tsx
 (line 40).
Recommendation:
Isolate the "LIVE" timer and position line into their own small, memoized components.
Use requestAnimationFrame or a specialized hook for time-based UI updates to avoid full React render cycles.
2. Client-Side API Chaining


The dashboard fetches market data from multiple third-party APIs directly from the browser.

Issue: This increases the "Time to Interactive" as the browser has to make 4-5 separate external requests. It also makes you vulnerable to CORS issues and rate-limiting.
Recommendation: Consolidate these fetches into a single Edge API Route in Next.js. The browser makes one request to your server, which fetches all data in parallel and returns a single response.



🛠️ Maintainability & Code Quality
1. SSR/Hydration Mismatches
The 
EconomicCalendarService
 generates mock "Consensus" data using Math.random().

Issue: Since this runs during both Server Rendering and Client Hydration, the random values will differ, leading to "Hydration Mismatch" warnings and flickering UI.
Location: 
src/services/economic-calendar.service.ts
 (line 248).
Recommendation: Use a seed-based pseudo-random generator (using the event ID as the seed) so that the "random" values are consistent between server and client.


2. AI Service Optimization
The 
generateContent
 function initializes a new GoogleGenerativeAI instance on every single call.

Issue: This is inefficient. Although the overhead is small, it adds up in high-traffic scenarios.
Location: 
src/lib/gemini.ts
 (line 18).
Recommendation: Initialize the genAI client once at the top level of the file or use a singleton pattern.
3. Component Architecture
The 
HighlightSection
 is marked with "use client" but doesn't strictly need it if data is fetched on the server.

Recommendation: Change it to a Server Component to reduce the JavaScript bundle size. Only use client components for parts of the UI that require interactivity (like the hover animations if they can't be done in pure CSS).
✅ Summary Checklist for Improvements
Category	Item	Priority
Security	Protect role field in Firestore Rules	🔴 Critical
Security	Switch to Firebase Session Cookies (JWT)	🔴 Critical
Security	Hide API keys (remove NEXT_PUBLIC_)	🟠 High
Performance	Optimize 
HeatMapView
 re-renders	🟠 High
Maintainability	Fix Hydration mismatches in mock data	🟡 Medium
Maintainability	Upgrade Gemini to 1.5-flash for speed	🟢 Low
Suggested Quick Fix for Firestore Rules:
javascript
// Change this:
match /posts/{postId} {
  allow read: if true; 
}
// To this:
match /posts/{postId} {
  allow read: if resource.data.isDraft == false || 
               (request.auth != null && resource.data.authorId == request.auth.uid);
}