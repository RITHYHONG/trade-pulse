import { createCheckoutSession } from "@/lib/stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId } = await request.json();
    if (!priceId) {
      return Response.json({ error: "Price ID is required" }, { status: 400 });
    }

    const checkoutSession = await createCheckoutSession(
      priceId,
      session.user.id,
      session.user.email!
    );

    return Response.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout Error:", error);
    return Response.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
