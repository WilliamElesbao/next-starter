import { IconBrandGithub } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";
import { getCurrentSession } from "@/actions/get-session.action";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/features/sidebar/components/sidebar";
import { getUserPlan } from "@/features/subscription/actions/get-user-plan.action";
import { Link } from "@/lib/i18n/navigation";
import { planStatusToLabelMap } from "@/utils/plan-status-to-label";
import { LanguageSwitcher } from "../../../components/language-switcher";
import { ThemeToggle } from "../../../components/theme-toggle";
import { Badge } from "../../../components/ui/badge";
import { SendEmailButton } from "./send-email-button";

export async function SiteHeader() {
  const [t, { user }] = await Promise.all([
    getTranslations("subscription"),
    getCurrentSession(),
  ]);
  if (!user) return null;

  const resolvedPlan = await getUserPlan(user.id, user.email);
  const planLabel = planStatusToLabelMap[resolvedPlan.status];

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 my-auto data-[orientation=vertical]:h-4"
        />
        <h1 className="font-medium text-base">Subscription</h1>
        <div className="ml-auto flex items-center gap-2">
          <Badge>{t(planLabel)}</Badge>
          <SendEmailButton email={user.email} />
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <Link
              href="https://github.com/WilliamElesbao"
              target="_blank"
              className="dark:text-foreground"
            >
              <IconBrandGithub className="size-5" />
            </Link>
          </Button>

          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
