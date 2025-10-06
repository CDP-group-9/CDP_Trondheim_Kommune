import { Check, History, DockIcon, Info, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar";

// Menu items.
const items = [
  {
    title: "Ny samtale",
    url: "/",
    icon: Plus,
  },
  {
    title: "Om personvern",
    url: "/privacy",
    icon: Info,
  },
  {
    title: "Sjekkliste",
    url: "/checklist",
    icon: Check,
  },
  {
    title: "Eksempler",
    url: "/examples",
    icon: DockIcon,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroupLabel style={{ fontSize: "20px", fontWeight: "600" }}>
          <a
            className="font-medium text-gray-900 hover:text-gray-900/75 transition-colors cursor-pointer rounded-md px-1 py-1"
            href="/"
          >
            DASQ
          </a>
        </SidebarGroupLabel>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarGroupLabel className="gap-2 mt-4 mb-2">
                  <History />
                  <span> Tidligere samtaler</span>
                </SidebarGroupLabel>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </SidebarHeader>
    </Sidebar>
  );
}
