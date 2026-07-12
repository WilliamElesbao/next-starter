"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";

export async function signOutAction() {
  const { success } = await auth.api.signOut({ headers: await headers() });

  if (!success) {
    return { success: false, error: "Failed to sign out" };
  }

  return { success: true };
}
