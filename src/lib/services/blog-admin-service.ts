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
