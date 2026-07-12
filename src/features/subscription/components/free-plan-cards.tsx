import { useTranslations } from "next-intl";
import type Stripe from "stripe";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { upgradeSubscriptionAction } from "../actions/manage-subscription.action";
import { FREE_FEATURES, PRO_FEATURES } from "../constants/constants";
import type { ResolvedPlan } from "../utils/plan-utils";
import { FeatureList } from "./feature-list";
import { UpgradeToProButton } from "./upgrade-to-pro-button";

export interface PlanSectionProps {
  resolvedPlan?: ResolvedPlan;
  proPlanPriceId: string;
  proPlanPrice: string;
  proPlanInterval: Stripe.Price.Recurring.Interval;
}

export function FreePlanCards({
  proPlanPriceId,
  proPlanPrice,
  proPlanInterval,
}: Readonly<Omit<PlanSectionProps, "resolvedPlan">>) {
  const t = useTranslations();

  async function handleUpgrade() {
    "use server";

    await upgradeSubscriptionAction({
      priceId: proPlanPriceId,
      planName: "pro",
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card className="flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("subscription.free")}</CardTitle>
          <p>
            <span className="text-2xl font-bold">$0</span>
            <span className="text-sm text-muted-foreground">
              {" "}
              / {t("subscription.month")}
            </span>
          </p>
        </CardHeader>
        <CardContent className="flex-1">
          <FeatureList features={FREE_FEATURES} muted />
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" disabled>
            {t("subscription.current-plan")}
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex flex-col border-primary/40 bg-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t("subscription.pro")}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {t("subscription.recommended")}
            </Badge>
          </div>
          <p>
            <span className="text-2xl font-bold">{proPlanPrice}</span>
            <span className="text-sm text-muted-foreground">
              {" "}
              / {t(`subscription.${proPlanInterval}`)}
            </span>
          </p>
        </CardHeader>
        <CardContent className="flex-1">
          <FeatureList features={PRO_FEATURES} />
        </CardContent>
        <CardFooter>
          <form action={handleUpgrade} className="w-full">
            <UpgradeToProButton />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
