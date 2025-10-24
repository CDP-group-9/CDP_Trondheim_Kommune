import { Check, History, DockIcon, Info, Plus } from "lucide-react";
import { Link } from "react-router-dom";

//import trondheimLogo from "../../../assets/images/dss-logo-co.png";
import tkLogo from "../../../assets/images/tk-logo-wide.svg";

import {
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

// Menu items.
const items = [
  {
    title: "Ny samtale",
    url: "/",
    icon: Plus,
  },
  {
    title: "Om personvern",
    url: "/personvern",
    icon: Info,
  },
  {
    title: "Sjekkliste",
    url: "/sjekkliste",
    icon: Check,
  },
  {
    title: "Eksempler",
    url: "/eksempel",
    icon: DockIcon,
  },
];

export function DssSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarGroupLabel
          className="mt-3"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          <a
            aria-label="Gå til Trondheim Kommune sin hjemmeside (åpner i ny fane)"
            className="rounded-md cursor-pointer"
            href="https://www.trondheim.kommune.no/"
            rel="noreferrer"
            target="_blank"
          >
            <img
              alt="Trondheim Kommunes logo"
              className="h-12 object-contain hover:opacity-80 transition-opacity"
              src={tkLogo}
            />
          </a>
        </SidebarGroupLabel>
        <SidebarTrigger className="ml-2 mr-2 mt-2 mb-1 hover:bg-muted transition" />
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
