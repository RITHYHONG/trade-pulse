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
    const { id, name, email, role, photoURL } = body || {};

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const update: Record<string, unknown> = {};
    if (typeof name === "string" && name.trim().length > 0) {
      update.displayName = name.trim();
      update.name = name.trim();
    }
    if (typeof email === "string" && email.trim().length > 0) {
      update.email = email.trim();
    }
    if (typeof role === "string" && role.trim().length > 0) {
      update.role = role.trim();
    }

    if (typeof photoURL === "string" && photoURL.trim().length > 0) {
      update.photoURL = photoURL.trim();
    }

    if (!Object.keys(update).length) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    await adminDb.collection("users").doc(id).update(update);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update user" }, { status: 500 });
  }
}
