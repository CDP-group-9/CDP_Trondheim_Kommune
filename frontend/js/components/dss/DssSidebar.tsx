import {
  Check,
  DockIcon,
  Info,
  Plus,
  Mail,
  Phone,
  MapPin,
  SquareArrowOutUpRight,
  History,
  Trash2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useAppState } from "../../contexts/AppStateContext";
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
    action: "newChat" as const,
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
  const {
    chatSessions,
    currentChatId,
    createNewChat,
    switchToChat,
    deleteChat,
  } = useAppState();

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
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      onClick={() => {
                        if (item.action === "newChat") {
                          createNewChat();
                        }
                      }}
                    >
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

        {chatSessions.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="gap-2">
              <History className="h-4 w-4" />
              <span>Tidligere samtaler</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chatSessions.map((session) => (
                  <SidebarMenuItem key={session.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentChatId === session.id}
                      onClick={() => switchToChat(session.id)}
                    >
                      <div className="flex items-center justify-between w-full group">
                        <Link className="flex-1 truncate" to="/">
                          {session.title}
                        </Link>
                        <button
                          aria-label="Slett samtale"
                          className="opacity-0 group-hover:opacity-100 ml-2 text-muted-foreground hover:text-destructive transition-opacity"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteChat(session.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

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
