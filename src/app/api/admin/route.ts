import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("user-role")?.value;
  const authToken = cookieStore.get("auth-token")?.value;

  // Double-check authorization (Middleware should handle this, but defense in depth)
  if (!authToken || userRole !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized: Admin access required" },
      { status: 401 },
    );
  }

  // TODO: In a real production app, you should also verify the authToken
  // using firebase-admin to ensure the cookie hasn't been forged.

  return NextResponse.json({
    status: "success",
    data: {
      users: 150,
      activeTrades: 24,
      systemStatus: "healthy",
      version: "1.0.0",
    },
  });
}
