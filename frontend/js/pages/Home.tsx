import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/ui/app-sidebar";
import { Textarea } from "../components/ui/textarea"
import { FourButtons } from "../components/ui/app-four-buttons";
import { Button } from "../components/ui/button";

const Home = () => {

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <div className="fixed top-70 left-120 right-56 mb-6">
            <FourButtons />
          </div>
          <div className="grid gap-2 fixed bottom-20 left-120 right-56">
            <Textarea placeholder="Skriv noe her..." />
            <Button>Send</Button>
          </div>
        </main>
      </SidebarProvider>
    </>
  );
};

export default Home;
