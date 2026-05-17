import type { Subscription } from "@better-auth/stripe";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { toast } from "sonner";
import { useDialog } from "@/context/dialog.context";
import { authClient } from "@/lib/better-auth/auth-client";
import { delay } from "@/utils";
import type { SubscriptionFormValues } from "./useSubscriptionForm";

/**
 * Manages the creation of a new Stripe subscription with checkout redirect.
 *
 * @returns Object containing onSubmit handler and isPending state
 */
export const useSubscription = () => {
  const t = useTranslations("dashboard.toast.subscription");
  const { setDialogIsOpen } = useDialog();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      formValues,
    }: {
      formValues: SubscriptionFormValues;
    }) => {
      const result = await authClient.subscription.upgrade({
        plan: formValues.planName,
        successUrl: process.env.NEXT_PUBLIC_BASE_URL,
        cancelUrl: process.env.NEXT_PUBLIC_BASE_URL,
        disableRedirect: false,
      });

      return result;
    },
    onSuccess: async () => {
      toast.info(t("redirecting-to-stripe-for-subscription"), {
        description: t("please-wait-while-we-set-up-your-subscription"),
        position: "top-center",
      });
      await delay(2);
    },
    onError: (err) => {
      console.error("[Hook][useSubscription] onError:", err);
      toast.error(t("failed-to-create-subscription"), {
        description: t("an-error-occurred-while-creating-your-subscription"),
        position: "top-center",
      });
    },
    onSettled: () => {
      setDialogIsOpen(false);
    },
  });

  const onSubmit = useCallback(
    async (data: SubscriptionFormValues) => {
      await mutateAsync({ formValues: data });
    },
    [mutateAsync],
  );

  return {
    onSubmit,
    isPending,
  };
};

/**
 * Manages updates to an existing Stripe subscription.
 *
 * @returns Object containing onSubmit handler and isPending state
 */
export const useUpdateSubscription = ({
  subscription,
}: {
  subscription?: Subscription;
}) => {
  const t = useTranslations("dashboard.toast.update-subscription");
  const { setDialogIsOpen } = useDialog();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      formValues,
    }: {
      formValues: SubscriptionFormValues;
    }) => {
      const subscriptionId = subscription?.stripeSubscriptionId;

      const result = await authClient.subscription.upgrade({
        subscriptionId,
        plan: formValues.planName,
      });

      return result;
    },
    onSuccess: async () => {
      toast.success(t("subscription-updated-successfully"), {
        description: t("your-subscription-has-been-updated"),
        position: "top-center",
      });
      await delay(2);
      setDialogIsOpen(false);
    },
    onError: (err) => {
      console.error("[Hook][useUpdateSubscription] onSubmit error:", err);
      toast.error(t("failed-to-update-subscription"), {
        description: t("an-error-occurred-while-updating-your-subscription"),
        position: "top-center",
      });
    },
  });

  const onSubmit = useCallback(
    async (data: SubscriptionFormValues) => {
      await mutateAsync({ formValues: data });
    },
    [mutateAsync],
  );

  return {
    onSubmit,
    isPending,
  };
};

/**
 * Manages cancellation of an active Stripe subscription.
 *
 * @returns Object containing onSubmit handler and mutation state
 */
export const useCancelSubscription = () => {
  const t = useTranslations("dashboard.toast.cancel-subscription");
  const { setDialogIsOpen } = useDialog();

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await authClient.subscription.cancel({
        returnUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
      });
      return result;
    },
    onSuccess: () => {
      toast.info(t("your-subscription-has-been-canceled"), {
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
