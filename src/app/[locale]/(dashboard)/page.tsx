import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardPage } from "@/feature/dashboard";
import { auth } from "@/lib/better-auth/auth";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Dashboard({ params }: Readonly<Props>) {
  const { locale } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect(`/${locale}/sign-in`);

  return <DashboardPage user={session.user} />;
}
