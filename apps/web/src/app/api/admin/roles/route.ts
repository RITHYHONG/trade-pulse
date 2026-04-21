import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminApp, isAdminReady, adminDb } from "@/lib/firebase-admin";

async function verifyAdmin(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const authToken = cookieStore.get("auth-token")?.value;
  if (!authToken) return { ok: false, status: 401, message: "Missing session" };

  if (!isAdminReady) {
    return { ok: false, status: 503, message: "Admin SDK unavailable" };
  }

  try {
    const decoded = await adminApp.auth().verifySessionCookie(authToken, true);
    // Check custom claim first
    const role = decoded.role as string | undefined;
    if (role === "admin") return { ok: true, uid: decoded.uid };

    // Fallback to firestore user doc
    try {
      const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
      const userRole = userDoc.exists ? userDoc.data()?.role : null;
      if (userRole === "admin") return { ok: true, uid: decoded.uid };
    } catch (err) {
      console.error("[verifyAdmin] Error reading user doc:", err);
    }

    return { ok: false, status: 403, message: "Forbidden" };
  } catch (err) {
    console.warn("[verifyAdmin] verifySessionCookie failed:", err);
    return { ok: false, status: 401, message: "Invalid session" };
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const check = await verifyAdmin(cookieStore);
    if (!check.ok) {
      return NextResponse.json({ error: check.message }, { status: check.status });
    }

    const usersSnap = await adminDb.collection("users").get();
    const users: Array<Record<string, any>> = [];
    usersSnap.forEach((doc) => {
      const d = doc.data() as any;
      users.push({ id: doc.id, name: d.name || d.displayName || "", email: d.email || "", role: d.role || "user", photoURL: d.photoURL || "" });
    });

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error("[admin/roles GET]", err);
    return NextResponse.json({ error: err?.message || "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const check = await verifyAdmin(cookieStore);
    if (!check.ok) {
      return NextResponse.json({ error: check.message }, { status: check.status });
    }

    const body = await req.json();
    const { uid, role } = body || {};
    if (!uid || typeof role !== "string") {
      return NextResponse.json({ error: "uid and role are required" }, { status: 400 });
    }

    // Update Firestore user doc
    await adminDb.collection("users").doc(uid).set({ role }, { merge: true });

    // Update custom claims for faster server-side checks
    try {
      await adminApp.auth().setCustomUserClaims(uid, { role });
    } catch (claimErr) {
      console.warn("[admin/roles PATCH] setCustomUserClaims failed:", claimErr);
      // proceed — role in firestore is authoritative
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[admin/roles PATCH]", err);
    return NextResponse.json({ error: err?.message || "Failed" }, { status: 500 });
  }
}
