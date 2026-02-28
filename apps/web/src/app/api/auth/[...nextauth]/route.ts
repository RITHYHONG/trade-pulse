// This route is disabled - using Firebase Auth instead
export async function GET() {
  return Response.json({ message: 'Authentication handled by Firebase' });
}

export async function POST() {
  return Response.json({ message: 'Authentication handled by Firebase' });
}