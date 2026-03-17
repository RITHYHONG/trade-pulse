import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get("user-role")?.value;
    const authToken = cookieStore.get("auth-token")?.value;

    if (!authToken || userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch Recent Users
    const recentUsersSnapshot = await adminDb.collection("users")
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();
      
    const recentUsers = recentUsersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });

    // Fetch Recent Posts
    const recentPostsSnapshot = await adminDb.collection("posts")
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();
      
    const recentPosts = recentPostsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: data.slug || '',
        title: data.title,
        category: data.category,
        authorName: data.authorName,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        views: data.views || 0,
        isDraft: data.isDraft
      };
    });

    // Aggregate Stats
    const totalUsersSnapshot = await adminDb.collection("users").get();
    const allUsers = totalUsersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date(data.createdAt).toISOString() || new Date().toISOString()
      };
    });
    
    const totalPostsSnapshot = await adminDb.collection("posts").get();

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: totalUsersSnapshot.size,
        totalPosts: totalPostsSnapshot.size,
        recentUsers: allUsers, // Send all users for the directory
        recentPosts
      }
    });
  } catch (error: any) {
    console.error("Admin Stats Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
