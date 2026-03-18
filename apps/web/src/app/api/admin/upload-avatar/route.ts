import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminApp } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userRole = cookieStore.get("user-role")?.value;
    const authToken = cookieStore.get("auth-token")?.value;

    if (!authToken || userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;

    if (!file || !userId) {
      return NextResponse.json({ error: "Missing file or userId" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = String(file.name).split(".").pop() || "jpg";
    const dest = `user-avatars/${userId}_${Date.now()}.${fileExt}`;

    const bucket = adminApp.storage().bucket();
    const fileRef = bucket.file(dest);

    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type || "application/octet-stream",
      },
      public: false,
    });

    // Generate a signed URL, valid for 1 year
    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 365,
    });

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error("Upload avatar error:", error);
    return NextResponse.json({ error: error?.message || "Upload failed" }, { status: 500 });
  }
}
