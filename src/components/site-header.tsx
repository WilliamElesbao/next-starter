import type { Subscription } from "@better-auth/stripe";
import Link from "next/link";
import * as IconsSi from "rocketicons/si";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LanguageSwitcher } from "./language-switcher";
import { CancelSubscriptionDialog } from "./origin-ui/cancel-plan-dialog";
import { ThemeToggle } from "./theme-toggle";

interface SiteHeaderProps {
  subscription?: Subscription;
}

export function SiteHeader({ subscription }: Readonly<SiteHeaderProps>) {
  const shouldShowRevokeButton =
    subscription?.status === "active" && !subscription?.cancelAt;

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="font-medium text-base">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <Link
              href="https://github.com/WilliamElesbao"
              target="_blank"
              className="dark:text-foreground"
            >
              <IconsSi.SiGithub className="size-5" />
            </Link>
          </Button>

          {shouldShowRevokeButton && <CancelSubscriptionDialog />}

          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
