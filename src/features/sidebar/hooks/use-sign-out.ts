"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "@/lib/i18n/navigation";
import { signOutAction } from "../actions/sign-out.action";

export function useSignOut() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await signOutAction();
      if (!result.success) throw new Error(result.error);

      return result;
    },
    onSuccess: () => {
      router.replace("/sign-in");
    },
    onError: (err) => {
      toast.error("failed-to-sign-out", {
        description: err instanceof Error ? err.message : "failed-to-sign-out",
      });
    },
  });

  return { ...mutation };
}
