"use server";

import { cacheLife, cacheTag } from "next/cache";
import { cacheKeys } from "@/constants/cache/cache-key";
import { db } from "@/database/prisma-connection";
import { env } from "@/env";
import { type ResolvedPlan, resolvePlan } from "../utils/plan-utils";

export async function getUserPlan(
  userId: string,
  userEmail: string,
): Promise<ResolvedPlan> {
  "use cache";
  cacheTag(cacheKeys.userPlan(userId));
  cacheLife("hours");

  const whitelistedEmails = env.WHITELISTED_EMAILS.split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const subscription = await db.subscription.findFirst({
    where: { referenceId: userId },
    select: {
      status: true,
      periodEnd: true,
      cancelAtPeriodEnd: true,
      stripeSubscriptionId: true,
    },
  });

  return resolvePlan(
    subscription
      ? {
          status: subscription.status ?? "inactive",
          periodEnd: subscription.periodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd ?? false,
          stripeSubscriptionId: subscription.stripeSubscriptionId,
        }
      : null,
    whitelistedEmails.includes(userEmail),
  );
}
