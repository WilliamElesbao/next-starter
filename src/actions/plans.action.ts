"use server";

import type Stripe from "stripe";
import { stripeClient } from "@/lib/stripe/stripe-client";
import { formatPrice } from "@/utils/format-price";

export interface Plan {
  id: string;
  planName: string;
  price: string;
  recurring: Stripe.Price.Recurring | null;
}

/**
 * Fetches active Stripe plans and normalizes the data for use in the application.
 * @returns An object containing an array of normalized plans.
 */
export async function stripePlans(): Promise<{ plans: Plan[] }> {
  const { data } = await stripeClient.products.list({
    active: true,
    expand: ["data.default_price"],
  });

  const normalizedPlans = data.map((plan) => {
    const id = (plan.default_price as Stripe.Price).id;
    const price = formatPrice({
      currency: (plan.default_price as Stripe.Price).currency as "usd" | "brl",
      price: (plan.default_price as Stripe.Price).unit_amount ?? 0,
    });

    return {
      id,
      planName: plan.name.toLocaleLowerCase(),
      price,
      recurring: (plan.default_price as Stripe.Price).recurring,
    };
  });

  return {
    plans: normalizedPlans,
  };
}
