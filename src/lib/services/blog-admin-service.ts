import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
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
  try {
    const postsRef = collection(db, "posts");
    const q = query(
      postsRef,
      where("authorId", "==", authorId),
      where("createdAt", ">=", todayStart()),
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("Error in countAuthorPostsToday:", error);
    return 0;
  }
}

/**
 * Returns the titles of posts the system author created today.
 */
export async function getAuthorPostsToday(authorId: string): Promise<string[]> {
  try {
    const postsRef = collection(db, "posts");
    const q = query(
      postsRef,
      where("authorId", "==", authorId),
      where("createdAt", ">=", todayStart()),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => String(doc.data().title || ""));
  } catch (error) {
    console.error("Error in getAuthorPostsToday:", error);
    return [];
  }
}

/**
 * Creates a blog post in Firestore.
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
  const baseSlug =
    post.slug || post.title.toLowerCase().replace(/\s+/g, "-").slice(0, 80);
  const slug = `${baseSlug}-${Date.now()}`;

  const postsRef = collection(db, "posts");
  const newPostRef = doc(postsRef);
  const postId = newPostRef.id;

  await setDoc(newPostRef, {
    ...post,
    id: postId,
    slug,
    authorId,
    authorEmail,
    authorName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: post.isDraft ? null : serverTimestamp(),
    views: 0,
  });

  return postId;
}
