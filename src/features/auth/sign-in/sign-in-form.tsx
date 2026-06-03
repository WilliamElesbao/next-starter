"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/shadcn/utils";
import { AuthForm } from "../components/auth-form";
import { signInWithGoogle } from "../hooks/sign-in";
import { useSignInForm } from "./hooks/use-sign-in-form";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations("common");
  const { form, onSubmit } = useSignInForm();

  return (
    <AuthForm className={cn(className)} {...props}>
      <AuthForm.Form form={form} onSubmit={onSubmit}>
        <AuthForm.Header mode="sign-in" />
        <AuthForm.Field
          form={form}
          name="email"
          label={t("email")}
          type="email"
          placeholder="next@starter.com"
        />
        <AuthForm.Field
          form={form}
          name="password"
          label={t("password")}
          type="password"
          placeholder="••••••••"
        />
        <AuthForm.Submit>{t("login")}</AuthForm.Submit>
        <AuthForm.Separator />
        <AuthForm.Socials signInWithGoogle={signInWithGoogle} />
      </AuthForm.Form>
      <AuthForm.Description />
    </AuthForm>
  );
}
