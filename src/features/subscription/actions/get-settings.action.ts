"use server";

import { getCurrentSession } from "@/actions/get-session.action";
import type { ResolvedPlan } from "../utils/plan-utils";
import { getUserPlan } from "./get-user-plan.action";

export interface SettingsData {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
  resolvedPlan: ResolvedPlan;
}

export async function getSettingsData(): Promise<SettingsData | null> {
  const { user } = await getCurrentSession();
  if (!user?.id) return null;

  const resolvedPlan = await getUserPlan(user.id, user.email);

  return {
    user: {
      name: user.name,
      email: user.email,
      image: user.image ?? null,
    },
    resolvedPlan,
  };
}
