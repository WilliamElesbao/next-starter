import type { Subscription } from "@better-auth/stripe";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useUpgradeSubscription } from "./useSubscription";

const formSchema = z.object({
  priceId: z.string(),
  planName: z.string(),
  subscriptionId: z.string().optional(),
});

export type SubscriptionFormValues = z.infer<typeof formSchema>;

/**
 * Manages subscription form state and submission logic for creating or updating Stripe subscriptions.
 * Automatically detects whether to create a new subscription or update an existing one.
 *
 * @returns Object containing form instance, submit handler, loading state, and button disable state
 */
export const useSubscriptionForm = ({
  subscription,
}: {
  subscription?: Subscription;
}) => {
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priceId: "free",
      planName: "Free",
    },
    mode: "all",
  });

  useEffect(() => {
    form.reset({
      priceId: subscription?.priceId ?? "free",
      planName: subscription?.plan ?? "free",
      subscriptionId: subscription?.stripeSubscriptionId,
    });
  }, [subscription, form]);

  const { mutateAsync, isPending } = useUpgradeSubscription();

  const onSubmit = async (formValues: SubscriptionFormValues) => {
    await mutateAsync({ formValues });
  };

  const selectedPriceId = useWatch({
    control: form.control,
    name: "priceId",
    defaultValue: "free",
  });
  const currentPriceId = subscription?.priceId;
  const isSamePlanSelected = selectedPriceId === currentPriceId;
  const isFreePlanSelected = selectedPriceId === "free";
  const disableChangePlanButton =
    isSamePlanSelected || isFreePlanSelected || isPending;

  return {
    form,
    onSubmit,
    isPending,
    disableChangePlanButton,
  };
};
