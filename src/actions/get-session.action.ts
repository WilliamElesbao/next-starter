import "server-only";

import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/better-auth/auth";

export const getCurrentSession = cache(async () => {
  "use cache: private";

  const store = await auth.api.getSession({ headers: await headers() });
  return { ...store };
});
