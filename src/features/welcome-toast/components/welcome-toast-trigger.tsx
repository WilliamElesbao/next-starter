"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { clearWelcomeCookie } from "../actions/clear-welcome-cookie.action";

type Props = {
  show: boolean;
};

export function WelcomeToastTrigger({ show }: Props) {
  const t = useTranslations("dashboard");
  const hasShown = useRef(false);

  useEffect(() => {
    if (!show || hasShown.current) return;
    hasShown.current = true;

    toast.success(t("toast.welcome.title"), {
      description: t("toast.welcome.description"),
      position: "top-center",
    });

    clearWelcomeCookie();
  }, [show, t]);

  return null;
}
