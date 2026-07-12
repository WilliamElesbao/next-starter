"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function UpgradeToProButton() {
  const t = useTranslations();
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending} type="submit">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {t("subscription.upgrade-to-pro")}
    </Button>
  );
}
