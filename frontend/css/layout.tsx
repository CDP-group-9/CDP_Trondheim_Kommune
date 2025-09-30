import { SidebarProvider, SidebarTrigger } from "../js/components/ui/sidebar"
import { AppSidebar } from "../js/components/ui/app-sidebar"
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}