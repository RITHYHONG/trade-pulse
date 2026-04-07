import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminApp, isAdminReady, adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token")?.value;
    if (!authToken) return NextResponse.json({ error: "Missing session" }, { status: 401 });

    if (!isAdminReady) {
      return NextResponse.json({ error: "Admin SDK unavailable" }, { status: 503 });
    }

    try {
      const decoded = await adminApp.auth().verifySessionCookie(authToken, true);
      // Check custom claim role
      const role = decoded.role as string | undefined;
      if (role) return NextResponse.json({ role });

      // Fall back to firestore user doc
      const uid = decoded.uid as string;
      try {
        const userDoc = await adminDb.collection("users").doc(uid).get();
        const userRole = userDoc.exists ? userDoc.data()?.role : null;
        return NextResponse.json({ role: userRole || "user" });
      } catch (err) {
        console.error("[verify-session] Failed reading user doc:", err);
        return NextResponse.json({ role: "user" });
      }
    } catch (err) {
      console.warn("[verify-session] session verify failed:", err);
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
  } catch (err: any) {
    console.error("[verify-session]", err);
    return NextResponse.json({ error: err?.message || "Failed" }, { status: 500 });
  }
}
