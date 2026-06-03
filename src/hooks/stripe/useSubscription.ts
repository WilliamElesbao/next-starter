import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { toast } from "sonner";
import { useDialog } from "@/context/dialog.context";
import { env } from "@/env";
import { authClient } from "@/lib/better-auth/auth-client";
import type { SubscriptionFormValues } from "./useSubscriptionForm";

/**
 * Custom hook to handle subscription upgrade logic, including API interaction and user feedback.
 * Utilizes react-query for mutation management and sonner for toast notifications.
 *
 * @returns Object containing the onSubmit handler and mutation state (isPending, isSuccess, etc.)
 */
export const useUpgradeSubscription = () => {
  const t = useTranslations("dashboard.toast");
  const { setDialogIsOpen } = useDialog();

  const mutation = useMutation({
    mutationFn: async ({
      formValues,
    }: {
      formValues: SubscriptionFormValues;
    }) => {
      const result = await authClient.subscription.upgrade({
        plan: formValues.planName,
        successUrl: env.NEXT_PUBLIC_BASE_URL,
        cancelUrl: env.NEXT_PUBLIC_BASE_URL,
        disableRedirect: false,
      });

      return result;
    },
    onMutate: ({ formValues }) => {
      if (formValues.subscriptionId) {
        toast.info(
          t(
            "update-subscription.redirecting-to-stripe-for-subscription-update",
          ),
          {
            description: t(
              "update-subscription.please-wait-while-we-update-your-subscription",
            ),
            position: "top-center",
          },
        );
      } else {
        toast.info(t("subscription.redirecting-to-stripe-for-subscription"), {
          description: t(
            "subscription.please-wait-while-we-set-up-your-subscription",
          ),
          position: "top-center",
        });
      }
    },
    onError: (error, variables, onMutateResult, context) => {
      console.error("[Hook][useUpgradeSubscription] onSubmit error:", {
        error,
        variables,
        onMutateResult,
        context,
      });
      if (variables.formValues.subscriptionId) {
        toast.error(t("update-subscription.failed-to-update-subscription"), {
          description: t(
            "update-subscription.an-error-occurred-while-updating-your-subscription",
          ),
          position: "top-center",
        });
      } else {
        toast.error(t("subscription.failed-to-create-subscription"), {
          description: t(
            "subscription.an-error-occurred-while-creating-your-subscription",
          ),
          position: "top-center",
        });
      }
    },
    onSettled: () => {
      setDialogIsOpen(false);
    },
  });

  return { ...mutation };
};

/**
 * Custom hook to handle subscription cancellation logic, including API interaction and user feedback.
 * Utilizes react-query for mutation management and sonner for toast notifications.
 *
 * @returns Object containing the onSubmit handler and mutation state (isPending, isSuccess, etc.)
 */
export const useCancelSubscription = () => {
  const t = useTranslations("dashboard.toast.cancel-subscription");
  const { setDialogIsOpen } = useDialog();

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await authClient.subscription.cancel({
        returnUrl: env.NEXT_PUBLIC_BASE_URL,
      });
      return result;
    },
    onSuccess: () => {
      toast.info(t("redirecting-to-stripe-for-subscription-cancellation"), {
        description: t("you-will-not-be-charged-for-the-next-billing-cycle"),
        position: "top-center",
      });
      setDialogIsOpen(false);
    },
    onError: (err) => {
      console.error("[Hook][useCancelSubscription] onSubmit error:", err);
      toast.error(t("failed-to-cancel-subscription"), {
        description: t("an-error-occurred-while-canceling-your-subscription"),
        position: "top-center",
      });
    },
  });

  const onSubmit = useCallback(async () => {
    await mutation.mutateAsync();
  }, [mutation.mutateAsync]);

  return {
    onSubmit,
    ...mutation,
  };
};
