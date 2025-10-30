import {
  Check,
  DockIcon,
  Info,
  Plus,
  Mail,
  Phone,
  MapPin,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

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
  SidebarFooter,
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
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarGroupLabel
          className="mt-3"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          <a
            className="font-medium text-gray-900 hover:text-gray-900/75 transition-colors cursor-pointer rounded-md px-1 py-1"
            href="/"
          >
            <h4>ASQ</h4>
          </a>
        </SidebarGroupLabel>
      </SidebarHeader>

      <SidebarTrigger className="ml-2 mr-2 mt-2 mb-1 hover:bg-muted transition" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  item.url === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        aria-current={isActive ? "page" : undefined}
                        to={item.url}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className="mt-auto border-t border-sidebar-border pt-3">
          <div className="flex flex-col gap-2 text-sm text-sidebar-foreground/80">
            <div className="flex items-center gap-2">
              <Mail className="size-4" />
              <a
                className="hover:underline"
                href="mailto:dasq@trondheim.kommune.no"
              >
                dasq@trondheim.kommune.no
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="size-4" />
              <a className="hover:underline" href="tel:+4772540000">
                72 54 00 00
              </a>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="size-4 mt-0.5" />
              <span>Munkegata 1, 7013 Trondheim</span>
            </div>
            <Link
              className="mt-2 text-sm font-medium text-primary hover:underline inline-flex items-center gap-1 whitespace-nowrap"
              rel="noopener noreferrer"
              target="_blank"
              to="https://www.trondheim.kommune.no/aktuelt/personvern/"
            >
              Mer om personvern <SquareArrowOutUpRight className="size-3" />
            </Link>
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
