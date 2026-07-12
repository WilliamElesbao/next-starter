"use server";

import { env } from "@/env";
import { resend } from "@/lib/resend/resend-client";
import WelcomeEmail from "../../react-email/emails/welcome-email";

/**
 * Sends a welcome email to a new user using the Resend email service.
 * @returns An object indicating the success status and any error message if applicable.
 */
export async function sendWelcomeEmailAction({
  email,
}: {
  email: string;
}): Promise<{ success: boolean; message?: string }> {
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Welcome to Next Starter!",
    react: WelcomeEmail({
      name: "D3v",
      actionUrl: env.NEXT_PUBLIC_BASE_URL,
    }),
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return { success: true };
}
