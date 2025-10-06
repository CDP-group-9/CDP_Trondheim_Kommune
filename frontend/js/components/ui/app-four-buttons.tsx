import { Button } from "js/components/ui/button";

const actions = [
  { title: "Hjelp meg med å starte en DPIA for et nytt prosjekt.", url: "#" },
  { title: "Hvordan skal jeg anonymisere personvernopplysninger?", url: "#" },
  { title: "Hvilke GDPR-krav gjelder for datainnsamling?", url: "#" },
  { title: "Gi meg en sjekkliste for personvernvurdering.", url: "#" },
];

export function FourButtons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => (
        <Button
          key={action.title}
          asChild
          className="w-full min-h-[2rem] p-4 whitespace-normal text-left"
          size="lg"
          variant="outline"
        >
          <a className="block w-full h-full" href={action.url}>
            {action.title}
          </a>
        </Button>
      ))}
    </div>
  );
}
