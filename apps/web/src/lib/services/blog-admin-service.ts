import { adminDb } from "@/lib/firebase-admin";
import admin from 'firebase-admin';
import type { GeneratedBlogPost } from "@/lib/services/content-generator";

export interface AdminBlogPostInput extends GeneratedBlogPost {
  blocks: Array<{
    id: string;
    type: string;
    content: string;
    metadata?: Record<string, string | number | boolean>;
  }>;
  category: string;
  focusKeyword: string;
  featuredImage: string;
  isDraft: boolean;
  sourceNewsId?: string;
  sourceNewsTitle?: string;
  sourceNewsUrl?: string;
}

function todayStart(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Counts how many posts the system author created today.
 */
export async function countAuthorPostsToday(authorId: string): Promise<number> {
  try {
    if (!adminDb) {
      console.warn("[blog-admin-service] countAuthorPostsToday: Admin SDK not initialized.");
      return 0;
    }
    const postsRef = adminDb.collection("posts");
    const snapshot = await postsRef
      .where("authorId", "==", authorId)
      .where("createdAt", ">=", todayStart())
      .get();
    return snapshot.size;
  } catch (error) {
    console.error("Error in countAuthorPostsToday:", error);
    return 0;
  }
}

/**
 * Returns the IDs/URLs of news items that have EVER been processed by the system.
 * Used to avoid duplicating news.
 */
export async function getAuthorProcessedNewsIds(
  authorId: string,
): Promise<string[]> {
  try {
    if (!adminDb) {
      console.warn("[blog-admin-service] getAuthorProcessedNewsIds: Admin SDK not initialized.");
      return [];
    }
    const postsRef = adminDb.collection("posts");
    // Limit to make it faster, but reasonably large to catch past news
    const snapshot = await postsRef
      .where("authorId", "==", authorId)
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();
      
    const ids = snapshot.docs
      .map((doc) => String(doc.data().sourceNewsId || ""))
      .filter(id => id.length > 0);
    
    console.log(`[service] getAuthorProcessedNewsIds: Found ${ids.length} IDs for ${authorId}`);
    return ids;
  } catch (error) {
    console.error("Error in getAuthorProcessedNewsIds:", error);
    return [];
  }
}

/**
 * Returns the titles of posts the system author created today.
 */
export async function getAuthorPostsToday(authorId: string): Promise<string[]> {
  try {
    if (!adminDb) {
      console.warn("[blog-admin-service] getAuthorPostsToday: Admin SDK not initialized.");
      return [];
    }
    const postsRef = adminDb.collection("posts");
    const snapshot = await postsRef
      .where("authorId", "==", authorId)
      .where("createdAt", ">=", todayStart())
      .get();
    return snapshot.docs.map((doc) => String(doc.data().title || ""));
  } catch (error) {
    console.error("Error in getAuthorPostsToday:", error);
    return [];
  }
}

/**
 * Creates a blog post using the Admin SDK (bypassing rules).
 */
export async function createBlogPostAdmin(
  authorId: string,
  input: AdminBlogPostInput,
): Promise<string> {
  if (!adminDb) {
    throw new Error("Firebase Admin SDK not initialized (adminDb is null). Check your environment variables (FIREBASE_SERVICE_ACCOUNT or FIREBASE_ADMIN_*).");
  }
  const postsRef = adminDb.collection("posts");
  const postDocRef = postsRef.doc();
  const slug = input.title
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");

  // Try to pull a matching user profile from Firestore so the system author can be customized
  const userDoc = await adminDb.collection("users").doc(authorId).get();
  const userData = userDoc.exists ? userDoc.data() : null;

  const systemName =
    (userData as any)?.displayName ||
    (userData as any)?.name ||
    "System Auto-Blogger";
  const systemEmail = (userData as any)?.email || "";
  const systemAvatar = (userData as any)?.photoURL || "/images/avatars/bot.png";
  const systemRole = (userData as any)?.role || "admin";

  const postData = {
    ...input,
    id: postDocRef.id,
    authorId,
    authorEmail: systemEmail,
    authorName: systemName,
    authorAvatar: systemAvatar,
    slug,
    publishedAt: new Date().toISOString(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    views: 0,
    likes: 0,
    commentsCount: 0,
    author: {
      id: authorId,
      name: systemName,
      avatar: systemAvatar,
      role: systemRole,
    },
  };

  await postDocRef.set(postData);
  return postDocRef.id;
}
