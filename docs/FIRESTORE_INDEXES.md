# Firestore Composite Indexes

This project requires a few composite indexes for Firestore queries used by the blog service.

Required indexes (already added to `firestore.indexes.json`):

- Collection: `posts`
  - Fields: `isDraft` ASC, `publishedAt` DESC
  - Used by: getPublishedPosts (where isDraft == false + orderBy publishedAt desc)

- Collection: `posts`
  - Fields: `isDraft` ASC, `category` ASC, `publishedAt` DESC
  - Used by: getPostsByCategory (where isDraft == false + where category == X + orderBy publishedAt desc)

- Collection: `posts`
  - Fields: `slug` ASC, `isDraft` ASC
  - Used by: getPostBySlug (where slug == X + where isDraft == false)

Deploying indexes
------------------

1. Install and log in to Firebase CLI (if you haven't already):

```powershell
npm install -g firebase-tools
firebase login
```

2. From the repo root (where `firebase.json` lives) run:

```powershell
cd 'c:\Users\Tk custom\trade-pulse'
npm run deploy:indexes
```

or directly:

```powershell
firebase deploy --only firestore:indexes
```

3. Index creation may take a few minutes. Monitor progress in the Firebase Console → Firestore → Indexes.

Console link (from runtime error):

https://console.firebase.google.com/v1/r/project/trade-pulse-b9fc4/firestore/indexes?create_composite=Ck9wcm9qZWN0cy90cmFkZS1wdWxzZS1iOWZjNC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvcG9zdHMvaW5kZXhlcy9fEAEaCwoHaXNEcmFmdBABGg8KC3B1Ymxpc2hlZEF0EAIaDAoIX19uYW1lX18QAg

Troubleshooting
---------------

- If you get the same "query requires an index" error after deploying, confirm you deployed to the correct Firebase project (check `firebase use` or `firebase.json`).
- Use the console link above to create the index manually if needed.
- The browser error may include a direct console link that pre-fills the index fields — it's safe to click if you're signed in to the correct Firebase project.

If you'd like, I can also add a small note into `README.md` or open a PR with these changes.

