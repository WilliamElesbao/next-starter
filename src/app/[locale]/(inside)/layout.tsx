import type { PropsWithChildren } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { AppSidebar } from "@/features/sidebar/app-sidebar";
import { SidebarProvider } from "@/features/sidebar/components/sidebar";

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <ErrorBoundary>
        <AppSidebar variant="inset" />
      </ErrorBoundary>
      {children}
    </SidebarProvider>
  );
}
