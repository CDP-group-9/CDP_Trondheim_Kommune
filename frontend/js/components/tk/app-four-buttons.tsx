import { Button } from "js/components/ui/button";

const actions = [
  { title: "Hjelp meg med å starte en DPIA for et nytt prosjekt.", url: "#" },
  { title: "Hvordan skal jeg anonymisere personvernopplysninger?", url: "#" },
  { title: "Hvilke GDPR-krav gjelder for datainnsamling?", url: "#" },
  { title: "Gi meg en sjekkliste for personvernvurdering.", url: "#" },
];

interface FourButtonsProps {
  submitPromptFunction(input: string): void;
}

export function FourButtons({ submitPromptFunction }: FourButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => (
        <Button
          key={action.title}
          asChild
          className="w-full min-h-[2rem] p-4 whitespace-normal text-left cursor-pointer"
          size="lg"
          variant="outline"
          onClick={() => submitPromptFunction(action.title)}
        >
          <span className="block w-full h-full">{action.title}</span>
        </Button>
      ))}
    </div>
  );
}
