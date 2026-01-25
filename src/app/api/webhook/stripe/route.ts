import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  if (event.type === "checkout.session.completed") {
    const customerId = session.customer;
    const plan = session.metadata?.plan;

    // We assume the user is authenticated and we have their userId or email in metadata
    const userEmail = session.customer_details?.email;

    if (userEmail) {
      const usersRef = adminDb.collection("users");
      const snapshot = await usersRef
        .where("email", "==", userEmail)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        await userDoc.ref.update({
          subscription: {
            status: "active",
            plan: plan || "pro",
            customerId: customerId,
            sessionId: session.id,
            updatedAt: new Date(),
          },
          role: "subscriber", // Or appropriate role
        });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}
