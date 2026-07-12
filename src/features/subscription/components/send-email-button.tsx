"use client";

import { IconLoader, IconMail } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useMailer } from "@/hooks/email/use-send-welcome-email";

type SendEmailButtonProps = {
  email: string;
};

export function SendEmailButton({ email }: Readonly<SendEmailButtonProps>) {
  const { mutate, isPending } = useMailer();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="hidden sm:flex border"
      onClick={() => mutate({ email })}
      disabled={isPending}
    >
      {isPending ? (
        <IconLoader className="size-5 animate-spin" />
      ) : (
        <IconMail className="size-5" />
      )}
    </Button>
  );
}
