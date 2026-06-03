import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { stripePlans } from "@/actions/plans.actions";
import { activeSubscription } from "@/actions/subscription.actions";
import { DashboardPage } from "@/features/dashboard/dashboard";
import { auth } from "@/lib/better-auth/auth";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Dashboard({ params }: Readonly<Props>) {
  const { locale } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const { plans } = await stripePlans();
  const { subscription } = await activeSubscription();

  if (!session) redirect(`/${locale}/sign-in`);

  return (
    <DashboardPage
      user={session.user}
      plans={plans}
      subscription={subscription}
    />
  );
}
