# Blog Post Firestore Integration - Deployment Guide

## Overview
All blog post features (create, edit, save draft, publish, image upload) now save to Firestore and Firebase Storage.

## What Was Implemented

### 1. Firestore Service (`src/lib/blog-firestore-service.ts`)
- `uploadFeaturedImage()` - Uploads images to Firebase Storage (`blog-images/` folder)
- `createBlogPost()` - Creates new blog posts in Firestore
- `updateBlogPost()` - Updates existing posts
- `getBlogPost()` - Retrieves a post by ID
- `publishBlogPost()` - Publishes a draft post
- `dataURLtoFile()` - Converts data URLs to File objects for upload

### 2. Updated Create Post Page (`src/app/create-post/page.tsx`)
- Authentication check on mount (redirects to login if not authenticated)
- Post ID state management (stored in URL query param `?id=xyz` after first save)
- Featured image upload with progress tracking
- Save Draft functionality (creates or updates draft in Firestore)
- Publish functionality (creates or updates and publishes post)
- Auto-save every 30 seconds (only if post ID exists)
- Load existing post when editing (via `?id=xyz` param)

### 3. Updated Security Rules

#### Firestore Rules (`firestore.rules`)
```plaintext
- Posts collection allows public read
- Authenticated users can create posts
- Only post author or admin can update/delete their posts
```

#### Storage Rules (`storage.rules`)
```plaintext
- Blog images (`blog-images/`) allow public read
- Authenticated users can upload/delete blog images
```

## Deployment Steps

### Step 1: Deploy Firebase Rules
Run these commands from your project root:

```powershell
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules
```

Or deploy everything at once:
```powershell
firebase deploy
```

### Step 2: Verify Environment Variables
Ensure your `.env.local` file has all Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 3: Test the Flow

1. **Start dev server:**
   ```powershell
   yarn dev
   ```

2. **Login as a user** (must be authenticated)

3. **Create a new post:**
   - Navigate to `/create-post`
   - Fill in title, content, primary asset
   - Upload a featured image (click or drag & drop)
   - Click "Save Draft"
   - Verify post ID appears in URL: `/create-post?id=abc123`

4. **Edit the draft:**
   - Refresh the page - post should load from Firestore
   - Make changes
   - Click "Save Draft" again - should update existing post

5. **Publish the post:**
   - Click "Publish"
   - Should redirect to `/blog`
   - Verify post appears in blog list

6. **Check Firestore Console:**
   - Go to Firebase Console > Firestore Database
   - Look for `posts` collection
   - Verify your post document exists with all fields

7. **Check Storage Console:**
   - Go to Firebase Console > Storage
   - Look for `blog-images/` folder
   - Verify your featured image is uploaded

## Data Structure

### Post Document (`posts/{postId}`)
```typescript
{
  id: string;
  title: string;
  slug: string;
  content: string; // HTML from rich text editor
  blocks: Array<{
    id: string;
    type: string;
    content: string; // HTML from rich text editor
    metadata?: Record<string, any>;
  }>;
  primaryAsset: string;
  relatedAssets: string[];
  sentiment: string;
  confidenceLevel: number;
  timeHorizon: string;
  tags: string[];
  category: string;
  metaDescription: string;
  focusKeyword: string;
  featuredImage: string; // URL from Firebase Storage
  isDraft: boolean;
  scheduledDate?: Date;
  authorId: string;
  authorEmail: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
}
```

## Features

### Auto-Save
- Triggers every 30 seconds (configurable)
- Only works after first manual save (when post ID exists)
- Uploads images if needed
- Silent operation (shows "Saving..." indicator)

### Image Upload
- Validates file type (PNG/JPG only)
- Validates file size (max 10MB)
- Shows upload progress in header
- Converts data URLs to files before uploading
- Stores in Firebase Storage at `blog-images/{postId}_{timestamp}_{filename}`
- Returns public download URL

### Draft Management
- Drafts are saved with `isDraft: true`
- URL updates with post ID after first save
- Can edit drafts by navigating to `/create-post?id={postId}`
- Auto-loads draft data on page load

### Publishing
- Sets `isDraft: false`
- Sets `publishedAt` timestamp
- Redirects to blog list after publish
- Shows success/error alerts

## Troubleshooting

### "Permission denied" errors
- Check Firebase Console > Firestore/Storage rules are deployed
- Verify user is authenticated (check browser console for auth errors)
- Ensure user's `authorId` matches the post's `authorId` for updates

### Images not uploading
- Check Storage rules allow writes for authenticated users
- Verify storage bucket is configured correctly in Firebase config
- Check browser console for CORS errors
- Ensure file is valid PNG/JPG under 10MB

### Auto-save not working
- Auto-save only works after first manual save (needs post ID)
- Check browser console for errors
- Verify Firestore rules allow updates

### Post not loading when editing
- Ensure URL has correct `?id=` parameter
- Check post exists in Firestore
- Verify user has permission to read the post

## Next Steps (Optional Enhancements)

1. **Better error handling** - Replace alerts with toast notifications
2. **Draft list** - Show user's drafts in dashboard
3. **Image optimization** - Resize/compress images before upload
4. **Rich media** - Support multiple images in content blocks
5. **Scheduling** - Implement scheduled publish feature
6. **Versioning** - Track post edit history
7. **Collaboration** - Allow multiple authors/reviewers
8. **SEO preview** - Show how post will appear in Google search results
