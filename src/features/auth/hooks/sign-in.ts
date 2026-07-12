import { toast } from "sonner";
import { env } from "@/env";
import { authClient } from "@/lib/better-auth/auth-client";
import { logger } from "@/utils/logger";

/**
 * Initiates Google OAuth sign-in flow and sets welcome toast flag.
 *
 * @returns Promise that resolves when sign-in is initiated
 */
export const signInWithGoogle = async () => {
  try {
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: `${env.NEXT_PUBLIC_BASE_URL}/subscription`,
      },
      {
        onError: (context) => {
          toast.error("Google sign-in failed", {
            description: context.error.message,
          });
        },
      },
    );
  } catch (error) {
    logger.error("[signIn] error:", error);
    throw error;
  }
};
