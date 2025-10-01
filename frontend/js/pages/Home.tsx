import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/ui/app-sidebar";
import { Textarea } from "../components/ui/textarea"

const Home = () => {

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <div className="fixed bottom-20 left-120 right-56">
            <Textarea placeholder="Skriv noe her..." />
          </div>
        </main>
      </SidebarProvider>
    </>
  );
};

export default Home;
