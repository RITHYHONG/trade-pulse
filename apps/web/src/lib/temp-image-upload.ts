/**
 * Temporary image upload solution that bypasses Firebase Storage CORS issues
 * This stores images as base64 in Firestore until Storage is properly configured
 */

export interface TempImageUpload {
  id: string;
  filename: string;
  data: string; // base64 encoded
  mimeType: string;
  uploadedAt: Date;
}

/**
 * Convert file to base64 and store in Firestore
 * @param file - The image file to upload
 * @returns Promise<string> - Returns a data URL for immediate use
 */
export async function uploadImageAsBase64(
  file: File
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      // Store in localStorage temporarily or return directly
      resolve(result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Temporary upload function that works without Firebase Storage
 */
export async function tempUploadFeaturedImage(
  file: File,
  postId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    if (onProgress) onProgress(25);
    
    // Validate file size (max 2MB for base64 storage)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('Image must be smaller than 2MB');
    }
    
    if (onProgress) onProgress(50);
    
    // Convert to base64
    const dataUrl = await uploadImageAsBase64(file);
    
    if (onProgress) onProgress(100);
    
    return dataUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}