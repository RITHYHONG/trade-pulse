import { adminDb } from "@/lib/firebase-admin";
import { type BlogPost } from "@/lib/blog-firestore-service";
import admin from "firebase-admin";

/**
 * Create a new blog post using Admin SDK (bypasses security rules)
 * Useful for automated/cron tasks.
 */
export async function createBlogPostAdmin(
  post: Partial<BlogPost>,
  authorId: string,
  authorEmail: string,
  authorName: string,
): Promise<string> {
  try {
    const postsRef = adminDb.collection("posts");
    const newPostRef = postsRef.doc();
    const postId = newPostRef.id;

    const postData = {
      ...post,
      id: postId,
      authorId,
      authorEmail,
      authorName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      publishedAt: post.isDraft
        ? null
        : admin.firestore.FieldValue.serverTimestamp(),
      views: 0,
    };

    await newPostRef.set(postData);
    return postId;
  } catch (error) {
    console.error("Error creating blog post (Admin):", error);
    throw new Error("Failed to create blog post via Admin SDK");
  }
}

/**
 * Counts how many blog posts a specific author has created today.
 */
export async function countAuthorPostsToday(authorId: string): Promise<number> {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const postsRef = adminDb.collection("posts");
    const q = postsRef
      .where("authorId", "==", authorId)
      .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(startOfDay));
    
    const snapshot = await q.get();
    return snapshot.size;
  } catch (error) {
    console.error("Error counting author posts today:", error);
    return 0;
  }
}

/**
 * Retrieves the titles or slugs of posts created by an author today.
 * Useful to avoid duplicate content from the same news source.
 */
export async function getAuthorPostsToday(authorId: string): Promise<string[]> {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const postsRef = adminDb.collection("posts");
    const q = postsRef
      .where("authorId", "==", authorId)
      .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(startOfDay));
    
    const snapshot = await q.get();
    return snapshot.docs.map(doc => doc.data().title || "");
  } catch (error) {
    console.error("Error getting author posts today:", error);
    return [];
  }
}
