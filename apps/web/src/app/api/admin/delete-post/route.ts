import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get("user-role")?.value;
    const authToken = cookieStore.get("auth-token")?.value;

    if (!authToken || userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const postId = body?.id;

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    await adminDb.collection("posts").doc(postId).delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete post error:", error);
    return NextResponse.json({ error: error?.message || "Failed to delete post" }, { status: 500 });
  }
}
