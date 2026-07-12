"use server";

import { cacheLife, cacheTag } from "next/cache";
import type Stripe from "stripe";
import { stripeClient } from "@/lib/stripe/stripe-client";
import { formatPrice } from "@/utils/format-price";

export async function stripePlansAction() {
  "use cache";
  cacheTag("stripe-plans");
  cacheLife("hours");

  const { data } = await stripeClient.products.list({
    active: true,
    expand: ["data.default_price"],
  });

  const normalizedPlans = data.map((product) => {
    const price = product.default_price as Stripe.Price;
    return {
      id: price.id,
      planName: product.name.toLowerCase(),
      price: formatPrice({
        currency: price.currency as "usd" | "brl",
        amount: price.unit_amount ?? 0,
      }),
      recurring: price.recurring?.interval,
    };
  });

  return { plans: normalizedPlans };
}
