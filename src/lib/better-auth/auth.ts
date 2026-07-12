import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { revalidateTag } from "next/cache";
import type Stripe from "stripe";
import { cacheKeys } from "@/constants/cache/cache-key";
import { db } from "@/database/prisma-connection";
import { env } from "@/env";
import { WELCOME_COOKIE } from "@/features/welcome-toast/constants/welcome-cookie";
import { logger } from "@/utils/logger";
import { stripeClient } from "../stripe/stripe-client";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      stripeSubscriptionId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account",
    },
  },
  plugins: [
    stripe({
      onCustomerCreate: async (_, ctx) => {
        ctx.setCookie(WELCOME_COOKIE.key, WELCOME_COOKIE.value, {
          maxAge: 60,
          path: "/",
        });
      },
      stripeClient,
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: async () => {
          // Fetch directly from Stripe
          const { data } = await stripeClient.products.list({
            active: true,
            expand: ["data.default_price"],
          });

          return data.map((product) => ({
            name: product.name.toLowerCase(), // match your needs
            priceId: (product.default_price as Stripe.Price).id,
          }));
        },
        onSubscriptionComplete: async ({ subscription }) => {
          logger.info(
            "[Subscription Complete] Revalidating user plan cache for userId: " +
              subscription.referenceId,
          );
          revalidateTag(cacheKeys.userPlan(subscription.referenceId), "hours");
        },
        onSubscriptionUpdate: async ({ subscription }) => {
          logger.info(
            "[Subscription Update] Revalidating user plan cache for userId: " +
              subscription.referenceId,
          );
          revalidateTag(cacheKeys.userPlan(subscription.referenceId), "hours");
        },
        onSubscriptionCancel: async ({ subscription }) => {
          logger.info(
            "[Subscription Cancel] Revalidating user plan cache for userId: " +
              subscription.referenceId,
          );
          revalidateTag(cacheKeys.userPlan(subscription.referenceId), "hours");
        },
      },
    }),
    nextCookies(),
  ],
});

export type SessionResponse = typeof auth.$Infer.Session;
