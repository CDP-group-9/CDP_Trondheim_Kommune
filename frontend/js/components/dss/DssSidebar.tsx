import { Check, DockIcon, Info, Plus, History, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import tkLogo from "../../../assets/images/tk-logo-wide.svg";
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
                    <SidebarMenuButton
                      asChild
                      onClick={() => {
                        if (item.action === "newChat") {
                          createNewChat();
                        }
                      }}
                    >
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
        </SidebarContent>
      </SidebarHeader>
    </Sidebar>
  );
}
