import React from "react";

import { AppSidebar } from "../js/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../js/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
