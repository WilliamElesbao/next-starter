import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { sendWelcomeEmailAction } from "@/actions/send-welcome-email.action";

/**
 * Hook for sending welcome emails with toast notifications.
 *
 * @returns Object containing the mutation for sending welcome emails.
 * @example
 * const { sendWelcomeMutation } = useMailer();
 * sendWelcomeMutation.mutate();
 */
export const useMailer = () => {
  const t = useTranslations("send-email");

  const sendWelcomeMutation = useMutation({
    mutationFn: ({ email }: { email: string }) =>
      sendWelcomeEmailAction({ email }),
    onSuccess: () => {
      toast.success(t("email-sent-successfully"));
    },
    onError: () => {
      toast.error(t("failed-to-send-email"));
    },
  });

  return { sendWelcomeMutation };
};
