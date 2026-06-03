import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { WELCOME_TOAST } from "@/constants/session-storage";
import { env } from "@/env";
import { authClient } from "@/lib/better-auth/auth-client";
import { type SignInFormValues, useSignInFormSchema } from "./form-schema";

/**
 * Manages sign-in form state and submission with email/password authentication.
 *
 * @returns Object containing the form instance and submit handler
 */
export const useSignInForm = () => {
  const t = useTranslations("sign-in");

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(useSignInFormSchema()),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: SignInFormValues) => {
    sessionStorage.setItem(WELCOME_TOAST.key, WELCOME_TOAST.value);

    await authClient.signIn.email(
      {
        ...values,
        callbackURL: env.NEXT_PUBLIC_BASE_URL,
      },
      {
        onError: (context) => {
          toast.error(t("toast.login-failed"), {
            description: context.error.message,
          });
        },
      },
    );
  };

  return { form, onSubmit };
};
