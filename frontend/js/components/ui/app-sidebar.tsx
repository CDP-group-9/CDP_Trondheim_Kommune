import { Check, Clock, DockIcon, Info, Plus, } from "lucide-react"

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
} from "./sidebar"

// Menu items.
const items = [
  {
    title: "Ny samtale",
    url: "#",
    icon: Plus,
  },
  {
    title: "Om personvern",
    url: "#",
    icon: Info,
  },
  {
    title: "Sjekkliste",
    url: "#",
    icon: Check,
  },
  {
    title: "Eksempler",
    url: "#",
    icon: DockIcon,
  },
  {
    title: "Tidligere samtaler",
    url: "#",
    icon: Clock,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroupLabel style={{ fontSize: '20px', fontWeight: '600' }}>DASQ</SidebarGroupLabel>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu> 
                {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </SidebarHeader>
    </Sidebar>
  )
}