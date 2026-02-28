# Firebase Storage Setup Instructions

## Quick Fix Options

### Option 1: Enable Firebase Storage (Recommended - 2 minutes)

1. **Visit Firebase Console:**
   ```
   https://console.firebase.google.com/project/trade-pulse-b9fc4/storage
   ```

2. **Click "Get Started"** and follow the setup wizard

3. **Choose storage location** (recommend same region as Firestore)

4. **Deploy storage rules after setup:**
   ```powershell
   firebase deploy --only storage
   ```

5. **Apply CORS configuration:**
   ```powershell
   # Option A: Use existing script (requires Google Cloud SDK)
   .\scripts\fix-storage-cors.ps1
   
   # Option B: Manual via Google Cloud Console
   # Visit: https://console.cloud.google.com/storage/browser?project=trade-pulse-b9fc4
   # Find your bucket and configure CORS manually
   ```

### Option 2: Temporary Base64 Upload (Immediate)

I've created `src/lib/temp-image-upload.ts` with a temporary solution that:
- Converts images to base64 (works around CORS)
- Stores directly in the blog post data
- No external storage needed
- 2MB size limit

**To use this temporarily:**

1. In your blog creation component, replace:
   ```typescript
   import { uploadFeaturedImage } from '../lib/blog-firestore-service';
   ```
   
   With:
   ```typescript
   import { tempUploadFeaturedImage as uploadFeaturedImage } from '../lib/temp-image-upload';
   ```

2. The rest of your code remains the same!

### Option 3: Google Cloud SDK Installation

If you want to use the PowerShell script for CORS:

1. **Download Google Cloud SDK:**
   ```
   https://cloud.google.com/sdk/docs/install-sdk
   ```

2. **After installation, restart PowerShell and run:**
   ```powershell
   gcloud auth login
   gcloud config set project trade-pulse-b9fc4
   .\scripts\fix-storage-cors.ps1
   ```

## Testing

After either Option 1 or 2:
1. Go to `/create-post`
2. Try uploading a featured image
3. The CORS error should be gone

## Migration Path

Once Firebase Storage is properly set up:
1. Switch back to `uploadFeaturedImage` from `blog-firestore-service.ts`
2. Optionally migrate any base64 images to Firebase Storage
3. Remove the temporary upload file

## Current Status

- ✅ CORS configuration ready (`cors.json`)
- ✅ Storage rules ready (`storage.rules`)
- ✅ Temporary upload solution created
- ❌ Firebase Storage needs to be enabled in console
- ❌ CORS needs to be applied after Storage setup

**Recommendation:** Start with Option 1 (enable Storage) as it's the proper long-term solution.