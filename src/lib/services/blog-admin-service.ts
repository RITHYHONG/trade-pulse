import { adminDb } from "@/lib/firebase-admin";
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
  const snapshot = await adminDb
    .collection("posts")
    .where("authorId", "==", authorId)
    .where("createdAt", ">=", todayStart())
    .get();

  return snapshot.size;
}

/**
 * Returns the titles of posts the system author created today.
 */
export async function getAuthorPostsToday(authorId: string): Promise<string[]> {
  const snapshot = await adminDb
    .collection("posts")
    .where("authorId", "==", authorId)
    .where("createdAt", ">=", todayStart())
    .get();

  return snapshot.docs.map((doc) => String(doc.data().title || ""));
}

/**
 * Creates a blog post in Firestore using the Admin SDK (bypasses security rules).
 * Returns the new document ID.
 */
export async function createBlogPostAdmin(
  post: AdminBlogPostInput,
  authorId: string,
  authorEmail: string,
  authorName: string,
): Promise<string> {
  const now = new Date();
  // Ensure slug is unique by appending timestamp if needed
  const baseSlug = post.slug || post.title.toLowerCase().replace(/\s+/g, "-").slice(0, 80);
  const slug = `${baseSlug}-${Date.now()}`;

  const docRef = adminDb.collection("posts").doc();

  await docRef.set({
    ...post,
    slug,
    authorId,
    authorEmail,
    authorName,
    createdAt: now,
    updatedAt: now,
    publishedAt: post.isDraft ? null : now,
    views: 0,
  });

  return docRef.id;
}
