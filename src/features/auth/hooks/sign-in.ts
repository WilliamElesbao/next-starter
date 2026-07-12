import { toast } from "sonner";
import { WELCOME_TOAST } from "@/constants/session-storage";
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
    sessionStorage.setItem(WELCOME_TOAST.key, WELCOME_TOAST.value);

    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: env.NEXT_PUBLIC_BASE_URL,
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
