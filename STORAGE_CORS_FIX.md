# Firebase Storage CORS Fix Guide

## Issue
Firebase Storage is blocking image uploads from localhost due to CORS policy.

## Quick Fix Options

### Option 1: Using Firebase Console (Recommended - No Installation)

1. **Go to Firebase Console Storage**
   - https://console.firebase.google.com/project/trade-pulse-b9fc4/storage

2. **Click on "Files" tab**

3. **Click the three dots menu** (⋮) at the top right

4. **Select "CORS configuration"**

5. **Paste this configuration:**
   ```json
   [
     {
       "origin": ["*"],
       "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
       "maxAgeSeconds": 3600,
       "responseHeader": ["Content-Type", "Access-Control-Allow-Origin", "Authorization"]
     }
   ]
   ```

6. **Save and wait 1-2 minutes** for changes to propagate

### Option 2: Using Google Cloud Console

1. **Go to Google Cloud Storage Console**
   - https://console.cloud.google.com/storage/browser?project=trade-pulse-b9fc4

2. **Click on your bucket** (`trade-pulse-b9fc4.appspot.com`)

3. **Click "Permissions" tab**

4. **Click "CORS" at the top**

5. **Add CORS rule:**
   ```
   Origin: *
   Methods: GET, HEAD, PUT, POST, DELETE
   Response Headers: Content-Type, Access-Control-Allow-Origin, Authorization
   Max Age: 3600
   ```

6. **Save**

### Option 3: Install Google Cloud SDK (Advanced)

If you want to use the command line:

1. **Download Google Cloud SDK:**
   - https://cloud.google.com/sdk/docs/install

2. **Install and restart PowerShell**

3. **Authenticate:**
   ```powershell
   gcloud auth login
   gcloud config set project trade-pulse-b9fc4
   ```

4. **Apply CORS:**
   ```powershell
   gsutil cors set cors.json gs://trade-pulse-b9fc4.appspot.com
   ```

## Quick Test After Fix

1. **Wait 1-2 minutes** after applying CORS

2. **Clear browser cache** (Ctrl+Shift+Delete)

3. **Refresh your app** (Ctrl+F5)

4. **Try uploading an image again**

## Alternative: Skip Image Upload for Testing

If you want to test without images first:

1. Go to `/create-post`
2. Fill in all fields **except** featured image
3. Click "Save Draft" or "Publish"
4. Post will save without image

Then add CORS fix later for image uploads.

## Verify CORS Is Working

After applying CORS, check the Network tab in DevTools:
- Look for the Storage upload request
- Should see `200 OK` instead of CORS error
- Response headers should include `Access-Control-Allow-Origin: *`

---

**Recommended:** Use Option 1 (Firebase Console) - it's the easiest and doesn't require installing anything.
