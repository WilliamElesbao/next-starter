"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";

export const getCurrentSession = async () => {
  "use cache: private";

  const store = await auth.api.getSession({ headers: await headers() });
  return { ...store };
};
