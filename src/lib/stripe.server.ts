import Stripe from "stripe";

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  cached = new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
  return cached;
}

/**
 * Map Stripe Checkout Session payment status to our internal `orders.status`
 * vocabulary: pending, approved, rejected.
 */
export function mapStripeStatus(s?: string | null): string {
  const v = (s || "").toLowerCase();
  if (v === "paid" || v === "complete") return "approved";
  if (v === "unpaid" || v === "no_payment_required") return "pending";
  return v || "pending";
}