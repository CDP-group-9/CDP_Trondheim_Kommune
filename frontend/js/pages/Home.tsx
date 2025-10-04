import { Button } from "../components/ui/button";
import { FourButtons } from "../components/ui/app-four-buttons";
import { Textarea } from "../components/ui/textarea";

const Home = () => {
  return (
    <div className="p-6">
      <div className="fixed top-70 left-120 right-56 mb-6">
        <FourButtons />
      </div>
      <div className="grid gap-2 fixed bottom-20 left-120 right-56">
        <Textarea placeholder="Skriv noe her..." />
        <Button>Send</Button>
      </div>
    </div>
  );
};

export default Home;
