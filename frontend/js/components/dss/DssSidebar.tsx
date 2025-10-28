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
import { Link } from "react-router-dom";

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
      </SidebarHeader>

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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className="mt-auto border-t border-sidebar-border pt-3">
          <div className="flex flex-col gap-1 text-sm text-sidebar-foreground/80">
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
