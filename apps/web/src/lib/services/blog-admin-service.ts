import { getAdminDb } from "@/lib/firebase-admin";
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
    const db = getAdminDb();
    const postsRef = db.collection("posts");
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
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const postsRef = getAdminDb().collection("posts");
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
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const postsRef = getAdminDb().collection("posts");
    const q = postsRef
      .where("authorId", "==", authorId)
      .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(startOfDay));

    const snapshot = await q.get();
    return snapshot.docs.map((doc) => doc.data().title || "");
  } catch (error) {
    console.error("Error getting author posts today:", error);
    return [];
  }
}

/**
 * Get a published post by slug using Admin SDK.
 * Reliable for Server Components.
 */
export async function getPostBySlugAdmin(
  slug: string,
): Promise<BlogPost | null> {
  try {
    const db = getAdminDb();
    const postsRef = db.collection("posts");
    const q = postsRef
      .where("slug", "==", slug)
      .where("isDraft", "==", false)
      .limit(1);

    const snapshot = await q.get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();

    return {
      ...data,
      id: doc.id,
      // Map Timestamps to Dates for the interface
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      publishedAt: data.publishedAt?.toDate?.() || data.publishedAt,
    } as BlogPost;
  } catch (error) {
    console.error("Error getting post by slug (Admin):", error);
    return null;
  }
}

/**
 * Get published posts by category using Admin SDK.
 */
export async function getPostsByCategoryAdmin(
  category: string,
  limitCount: number = 6,
): Promise<BlogPost[]> {
  try {
    const db = getAdminDb();
    const postsRef = db.collection("posts");
    const q = postsRef
      .where("isDraft", "==", false)
      .where("category", "==", category)
      .orderBy("publishedAt", "desc")
      .limit(limitCount);

    const snapshot = await q.get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        publishedAt: data.publishedAt?.toDate?.() || data.publishedAt,
      } as BlogPost;
    });
  } catch (error) {
    console.error("Error getting posts by category (Admin):", error);
    return [];
  }
}
