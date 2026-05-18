"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";

/**
 * Fetches the active subscription for the currently authenticated user.
 * Utilizes the Better Auth API to retrieve active subscriptions based on the user's session.
 */
export async function activeSubscription() {
  const subscription = await auth.api.listActiveSubscriptions({
    headers: await headers(),
  });
  return { subscription: subscription[0] };
}
