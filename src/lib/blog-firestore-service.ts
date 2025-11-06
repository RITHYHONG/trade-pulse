import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc, 
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';
import { getUserProfile } from './firestore-service';

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  blocks: Array<{
    id: string;
    type: string;
    content: string;
    metadata?: Record<string, string | number | boolean>;
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
  featuredImage: string;
  isDraft: boolean;
  scheduledDate?: Date;
  authorId?: string;
  authorName?: string;
  authorEmail?: string;
  authorAvatar?: string;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
  publishedAt?: Date | Timestamp;
}

/**
 * Upload featured image to Firebase Storage
 * @param file - The image file to upload
 * @param postId - The post ID to associate with the image
 * @param onProgress - Optional callback for upload progress
 * @returns The download URL of the uploaded image
 */
export async function uploadFeaturedImage(
  file: File,
  postId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${postId}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storageRef = ref(storage, `blog-images/${filename}`);

    // Upload the file
    const uploadTask = uploadBytes(storageRef, file);
    
    if (onProgress) {
      // Note: uploadBytes doesn't support progress tracking directly
      // For progress, we'd need to use uploadBytesResumable
      onProgress(50); // Simulate progress
    }

    const snapshot = await uploadTask;
    
    if (onProgress) {
      onProgress(100);
    }

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading featured image:', error);
    throw new Error('Failed to upload featured image');
  }
}

/**
 * Delete featured image from Firebase Storage
 * @param imageUrl - The URL of the image to delete
 */
export async function deleteFeaturedImage(imageUrl: string): Promise<void> {
  try {
    // Extract the path from the URL
    const urlParts = imageUrl.split('/o/');
    if (urlParts.length < 2) return;
    
    const pathPart = urlParts[1].split('?')[0];
    const path = decodeURIComponent(pathPart);
    
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting featured image:', error);
    // Don't throw - we don't want to block the post save if image deletion fails
  }
}

/**
 * Create a new blog post
 * @param post - The blog post data
 * @param userId - The ID of the user creating the post
 * @param userEmail - The email of the user creating the post
 * @param userDisplayName - The display name of the user creating the post
 * @returns The ID of the created post
 */
export async function createBlogPost(
  post: BlogPost,
  userId: string,
  userEmail: string,
  userDisplayName?: string
): Promise<string> {
  try {
    // Get user profile for additional author information
    let userProfile = null;
    try {
      userProfile = await getUserProfile(userId);
    } catch (error) {
      console.warn('Could not fetch user profile:', error);
    }

    // Generate a new post ID
    const postsRef = collection(db, 'posts');
    const newPostRef = doc(postsRef);
    const postId = newPostRef.id;

    // Prepare the post data
    const postData = {
      ...post,
      id: postId,
      authorId: userId,
      authorEmail: userEmail,
      authorName: userDisplayName || userProfile?.displayName || userEmail?.split('@')[0] || 'Anonymous',
      featuredImage: post.featuredImage || userProfile?.photoURL || null,
      authorAvatar: userProfile?.photoURL || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...(post.isDraft ? {} : { publishedAt: serverTimestamp() })
    };

    // Save to Firestore
    await setDoc(newPostRef, postData);

    return postId;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw new Error('Failed to create blog post');
  }
}

/**
 * Update an existing blog post
 * @param postId - The ID of the post to update
 * @param post - The updated blog post data
 * @returns void
 */
export async function updateBlogPost(
  postId: string,
  post: Partial<BlogPost>
): Promise<void> {
  try {
    const postRef = doc(db, 'posts', postId);
    
    const updateData = {
      ...post,
      updatedAt: serverTimestamp()
    };

    await updateDoc(postRef, updateData);
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw new Error('Failed to update blog post');
  }
}

/**
 * Get a blog post by ID
 * @param postId - The ID of the post to retrieve
 * @returns The blog post data or null if not found
 */
export async function getBlogPost(postId: string): Promise<BlogPost | null> {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const data = postSnap.data();
      return {
        ...data,
        id: postSnap.id,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        publishedAt: data.publishedAt?.toDate?.() || data.publishedAt,
      } as BlogPost;
    }

    return null;
  } catch (error) {
    console.error('Error getting blog post:', error);
    throw new Error('Failed to retrieve blog post');
  }
}

/**
 * Publish a draft post
 * @param postId - The ID of the post to publish
 * @returns void
 */
export async function publishBlogPost(postId: string): Promise<void> {
  try {
    const postRef = doc(db, 'posts', postId);
    
    await updateDoc(postRef, {
      isDraft: false,
      publishedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error publishing blog post:', error);
    throw new Error('Failed to publish blog post');
  }
}

/**
 * Convert a data URL to a File object
 * @param dataUrl - The data URL to convert
 * @param filename - The filename for the file
 * @returns A File object
 */
export function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

/**
 * Get all published blog posts
 * @param limitCount - Optional limit on number of posts to return
 * @returns Array of published blog posts, sorted by publishedAt descending
 */
/*
  Notes: Firestore composite indexes required for these queries
  - getPublishedPosts: where('isDraft','==', false) + orderBy('publishedAt','desc')
    Composite index: { isDraft: ASC, publishedAt: DESC }

  - getPostsByCategory: where('isDraft','==', false) + where('category','==', ...) + orderBy('publishedAt','desc')
    Composite index: { isDraft: ASC, category: ASC, publishedAt: DESC }

  - getPostBySlug: where('slug','==', ...) + where('isDraft','==', false) + limit(1)
    Composite index: { slug: ASC, isDraft: ASC }

  These are declared in `firestore.indexes.json` so they can be deployed via
  `firebase deploy --only firestore:indexes` or from the Firebase Console link
  provided in any runtime error.
*/
export async function getPublishedPosts(limitCount?: number): Promise<BlogPost[]> {
  try {
    const postsRef = collection(db, 'posts');
    let q = query(
      postsRef,
      where('isDraft', '==', false),
      orderBy('publishedAt', 'desc')
    );

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        publishedAt: data.publishedAt?.toDate?.() || data.publishedAt,
      } as BlogPost);
    });

    return posts;
  } catch (error) {
    console.error('Error getting published posts:', error);
    return [];
  }
}

/**
 * Get featured blog posts (for carousel)
 * @param limitCount - Optional limit on number of featured posts
 * @returns Array of featured published blog posts
 */
export async function getFeaturedPosts(limitCount: number = 5): Promise<BlogPost[]> {
  try {
    // For now, we'll just get the most recent published posts
    // You can add an 'isFeatured' field to posts if you want manual curation
    return await getPublishedPosts(limitCount);
  } catch (error) {
    console.error('Error getting featured posts:', error);
    return [];
  }
}

/**
 * Get published posts by category
 * @param category - The category to filter by
 * @param limitCount - Optional limit on number of posts
 * @returns Array of published blog posts in the category
 */
export async function getPostsByCategory(category: string, limitCount?: number): Promise<BlogPost[]> {
  try {
    const postsRef = collection(db, 'posts');
    let q = query(
      postsRef,
      where('isDraft', '==', false),
      where('category', '==', category),
      orderBy('publishedAt', 'desc')
    );

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        publishedAt: data.publishedAt?.toDate?.() || data.publishedAt,
      } as BlogPost);
    });

    return posts;
  } catch (error) {
    console.error('Error getting posts by category:', error);
    return [];
  }
}

/**
 * Get a published post by slug
 * @param slug - The post slug
 * @returns The blog post or null if not found/not published
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(
      postsRef,
      where('slug', '==', slug),
      where('isDraft', '==', false),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      publishedAt: data.publishedAt?.toDate?.() || data.publishedAt,
    } as BlogPost;
  } catch (error) {
    console.error('Error getting post by slug:', error);
    return null;
  }
}
