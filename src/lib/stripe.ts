import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as any,
  typescript: true,
});

export const getStripeSession = async (
  priceId: string,
  customerId?: string,
) => {
  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/upgrade`,
    customer: customerId,
    subscription_data: {
      metadata: {
        plan: priceId,
      },
    },
  });
};
