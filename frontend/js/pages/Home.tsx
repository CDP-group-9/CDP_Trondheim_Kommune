import { FourButtons } from "../components/ui/app-four-buttons";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

const Home = () => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex flex-col h-full items-center justify-center">
        <div className="mb-6 max-w-lg mx-auto">
          <FourButtons />
        </div>
        <div className="grid gap-2 max-w-lg w-full mx-auto">
          <Textarea placeholder="Skriv noe her..." />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
