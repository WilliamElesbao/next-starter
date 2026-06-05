"use client";

import type { Subscription } from "@better-auth/stripe";
import type { Plan } from "@/actions/plans.action";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { ChoosePlanDialog } from "@/components/choose-plan-dialog";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DialogProvider } from "@/contexts/dialog-context";
import type { SessionResponse } from "@/lib/better-auth/auth";
import { useWelcomeToast } from "../auth/hooks/use-welcome-toast";
import { useDashboard } from "./hooks/use-dashboard";

interface DashboardWrapperProps {
  user: SessionResponse["user"];
  plans: Plan[];
  subscription?: Subscription;
}

export function DashboardPage({
  user,
  plans,
  subscription,
}: Readonly<DashboardWrapperProps>) {
  useWelcomeToast();
  const { documents, total, pagination, setPagination } = useDashboard();

  return (
    <DialogProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" user={user} />
        <SidebarInset>
          <SiteHeader subscription={subscription} />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <DataTable
                  data={documents}
                  rowCount={total}
                  pagination={pagination}
                  onPaginationChange={setPagination}
                />
              </div>
            </div>
          </div>
        </SidebarInset>

        <ChoosePlanDialog subscription={subscription} plans={plans} />
      </SidebarProvider>
    </DialogProvider>
  );
}
