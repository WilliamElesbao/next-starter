import { ZapIcon } from "lucide-react";

import { Badge as BadgeOriginUI } from "@/components/ui/badge";

type BadgeProps = {
  text: string;
};
export const Badge = ({ text }: BadgeProps) => {
  return (
    <BadgeOriginUI className="absolute top-0 right-0 bg-accent-foreground text-accent">
      <ZapIcon className="-ms-0.5 opacity-60" size={12} aria-hidden="true" />
      {text.charAt(0).toUpperCase() + text.slice(1)}
    </BadgeOriginUI>
  );
};
