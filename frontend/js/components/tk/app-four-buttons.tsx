import { Button } from "js/components/ui/button";
import { cn } from "js/lib/utils";

import { ButtonGroup } from "../ui/button-group";

const actions = [
  { title: "Hjelp meg med å starte en DPIA for et nytt prosjekt.", url: "#" },
  { title: "Hvordan skal jeg anonymisere personvernopplysninger?", url: "#" },
  { title: "Hvilke GDPR-krav gjelder for datainnsamling?", url: "#" },
  { title: "Gi meg en sjekkliste for personvernvurdering.", url: "#" },
];

interface FourButtonsProps {
  submitPromptFunction(input: string): void;
  className?: string;
}

export function FourButtons({
  submitPromptFunction,
  className,
}: FourButtonsProps) {
  return (
    <ButtonGroup
      aria-label="Ofte stilte spørsmål"
      className={cn(className)}
      orientation="grid"
      role="group"
    >
      {actions.map((action) => (
        <Button
          key={action.title}
          className="flex justify-center min-h-[5rem] pt-2 whitespace-normal text-left"
          size="lg"
          type="button"
          variant="outline"
          onClick={() => submitPromptFunction(action.title)}
        >
          <span className="w-full">{action.title}</span>
        </Button>
      ))}
    </ButtonGroup>
  );
}
