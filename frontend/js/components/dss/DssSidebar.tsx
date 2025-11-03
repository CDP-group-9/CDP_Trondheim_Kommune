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
import { Link, useLocation, useNavigate } from "react-router-dom";

import { cn } from "js/lib/utils";

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
  useSidebar,
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
  const navigate = useNavigate();
  const { state } = useSidebar();
  const {
    chatSessions,
    currentChatId,
    createNewChat,
    switchToChat,
    deleteChat,
    restoreCurrentChecklist,
  } = useAppState();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarGroupLabel
          className="mt-3"
          style={{ fontSize: "20px", fontWeight: "600" }}
        >
          <a
            aria-label="Gå til ASQ forsiden"
            className="font-medium text-foreground hover:text-foreground/75 transition-colors cursor-pointer rounded-md px-1 py-1"
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
                      className={cn(
                        isActive &&
                          "bg-primary/10 text-primary font-medium hover:bg-primary/15 data-[active=true]:bg-primary/10 data-[active=true]:text-primary",
                      )}
                      isActive={isActive}
                      onClick={() => {
                        if (item.action === "newChat") {
                          createNewChat();
                        }
                        if (item.url === "/sjekkliste") {
                          restoreCurrentChecklist();
                        }
                        navigate(item.url);
                      }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {chatSessions.length > 0 && state === "expanded" && (
          <SidebarGroup>
            <SidebarGroupLabel className="gap-2">
              <History aria-hidden="true" className="h-4 w-4" />
              <span>Tidligere samtaler</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chatSessions.map((session) => (
                  <SidebarMenuItem key={session.id}>
                    <div className="relative group">
                      <SidebarMenuButton
                        className={cn(
                          currentChatId === session.id &&
                            "bg-primary/10 text-primary font-medium hover:bg-primary/15 data-[active=true]:bg-primary/10 data-[active=true]:text-primary",
                        )}
                        isActive={currentChatId === session.id}
                        onClick={() => {
                          switchToChat(session.id);
                          navigate("/");
                        }}
                      >
                        <span className="flex-1 truncate text-left pr-8">
                          {session.title}
                        </span>
                      </SidebarMenuButton>
                      <button
                        aria-label={`Slett samtale: ${session.title}`}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded-sm text-foreground/60 hover:text-destructive hover:bg-destructive/20 transition-all flex-shrink-0"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteChat(session.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarFooter className="mt-auto border-t border-sidebar-border pt-3">
          <div className="flex flex-col gap-2 text-sm text-sidebar-foreground/80">
            <div className="flex items-center gap-2">
              <Mail aria-hidden="true" className="size-4" />
              <a
                aria-label="Send e-post til dasq@trondheim.kommune.no"
                className="hover:underline"
                href="mailto:dasq@trondheim.kommune.no"
              >
                dasq@trondheim.kommune.no
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone aria-hidden="true" className="size-4" />
              <a
                aria-label="Ring 72 54 00 00"
                className="hover:underline"
                href="tel:+4772540000"
              >
                72 54 00 00
              </a>
            </div>
            <div className="flex items-start gap-2">
              <MapPin aria-hidden="true" className="size-4 mt-0.5" />
              <span>Munkegata 1, 7013 Trondheim</span>
            </div>
            <Link
              aria-label="Les mer om personvern på Trondheim kommunes nettside, åpner i ny fane"
              className="mt-2 text-sm font-medium text-primary hover:underline inline-flex items-center gap-1 whitespace-nowrap"
              rel="noopener noreferrer"
              target="_blank"
              to="https://www.trondheim.kommune.no/aktuelt/personvern/"
            >
              Mer om personvern{" "}
              <SquareArrowOutUpRight aria-hidden="true" className="size-3" />
            </Link>
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
