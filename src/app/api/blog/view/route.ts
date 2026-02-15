import { NextResponse } from "next/server";
import { incrementPostViews } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 },
      );
    }

    await incrementPostViews(postId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error incrementing view:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
