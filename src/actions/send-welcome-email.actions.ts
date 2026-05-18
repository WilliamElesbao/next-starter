"use server";

import { env } from "@/env";
import { resend } from "@/lib/resend";
import WelcomeEmail from "../../emails/src/templates/welcomeEmail";

/**
 * Sends a welcome email to a new user using the Resend email service.
 * @returns An object indicating the success status and any error message if applicable.
 */
export async function sendWelcomeEmailAction() {
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: env.EMAIL_TO,
    subject: "Welcome to Next Starter!",
    react: WelcomeEmail({
      name: "D3v",
      actionUrl: env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
    }),
  });

  if (error) {
    return {
      success: false,
      message: error ?? "Unknown error",
    };
  }

  return { success: true };
}
