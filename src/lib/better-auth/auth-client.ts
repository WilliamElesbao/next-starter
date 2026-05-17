import { stripeClient } from "@better-auth/stripe/client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  plugins: [
    stripeClient({
      subscription: true,
    }),
  ],
});
