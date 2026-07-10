export const CACHE_KEY = {
  USER_PLAN: "user-plan",
} as const;

export const cacheKeys = {
  userPlan: (userId: string) => `${CACHE_KEY.USER_PLAN}:${userId}` as const,
};
