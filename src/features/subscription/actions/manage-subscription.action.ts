"use server";

import { refresh, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentSession } from "@/actions/get-session.action";
import { cacheKeys } from "@/constants/cache/cache-key";
import { db } from "@/database/prisma-connection";
import { env } from "@/env";
import { auth } from "@/lib/better-auth/auth";
import { stripeClient } from "@/lib/stripe/stripe-client";
import { logger } from "@/utils/logger";
import { safePromise } from "@/utils/safe-promise";
import type { SubscriptionSchema } from "../schema/use-subscription-schema";

export type ManageSubscriptionResult =
  | { success: true }
  | { success: false; error: string };

export async function upgradeSubscriptionAction(
  formValues: SubscriptionSchema,
) {
  const data = await auth.api.upgradeSubscription({
    body: {
      plan: formValues.planName,
      customerType: "user",
      successUrl: `${env.NEXT_PUBLIC_BASE_URL}/subscription`,
      cancelUrl: `${env.NEXT_PUBLIC_BASE_URL}/subscription`,
      disableRedirect: false,
    },
    headers: await headers(),
  });

  if (data.url) redirect(data.url, "push");

  return data;
}

async function getStripeSubscriptionId(userId: string): Promise<string | null> {
  "use cache";

  const subscription = await db.subscription.findFirst({
    where: { referenceId: userId, status: "active" },
    select: { stripeSubscriptionId: true },
  });
  return subscription?.stripeSubscriptionId ?? null;
}

export async function cancelSubscriptionAction(): Promise<ManageSubscriptionResult> {
  const t = await getTranslations("plans");

  const { user } = await getCurrentSession();
  if (!user?.id) return { success: false, error: t("errors.unauthenticated") };

  const stripeId = await getStripeSubscriptionId(user.id);
  if (!stripeId)
    return { success: false, error: t("cancel.no-active-subscription") };

  const [, stripeError] = await safePromise(
    stripeClient.subscriptions.update(stripeId, { cancel_at_period_end: true }),
  );
  if (stripeError) {
    logger.error("[cancelSubscriptionAction]", stripeError);
    return { success: false, error: t("cancel.failed-to-cancel") };
  }

  const [, dbError] = await safePromise(
    db.subscription.updateMany({
      where: { referenceId: user.id, status: "active" },
      data: { cancelAtPeriodEnd: true },
    }),
  );
  if (dbError) {
    logger.error("[cancelSubscriptionAction] DB error:", dbError);
    return {
      success: false,
      error: t("errors.failed-to-update-subscription"),
    };
  }

  revalidateTag(cacheKeys.userPlan(user.id), "hours");
  refresh();
  return { success: true };
}

export async function renewSubscriptionAction(): Promise<ManageSubscriptionResult> {
  const t = await getTranslations("plans");

  const { user } = await getCurrentSession();
  if (!user?.id) return { success: false, error: t("errors.unauthenticated") };

  const stripeId = await getStripeSubscriptionId(user.id);
  if (!stripeId)
    return { success: false, error: t("renew.no-subscription-found") };
  const [, stripeError] = await safePromise(
    stripeClient.subscriptions.update(stripeId, {
      cancel_at_period_end: false,
    }),
  );
  if (stripeError) {
    logger.error("[renewSubscriptionAction]", stripeError);
    return { success: false, error: t("renew.failed-to-renew") };
  }

  const [, dbError] = await safePromise(
    db.subscription.updateMany({
      where: { referenceId: user.id },
      data: { cancelAtPeriodEnd: false },
    }),
  );
  if (dbError) {
    logger.error("[renewSubscriptionAction] DB error:", dbError);
    return {
      success: false,
      error: t("errors.failed-to-update-subscription"),
    };
  }

  revalidateTag(cacheKeys.userPlan(user.id), "hours");
  refresh();
  return { success: true };
}
