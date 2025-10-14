import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Switch } from "@radix-ui/react-switch";
import { useState } from "react";

export const InvolvedParties = () => {
  const [usesExternalProcessors, setUsesExternalProcessors] = useState(false);
  const [sharesWithOthers, setSharesWithOthers] = useState(false);
  const [employeeAccess, setEmployeeAccess] = useState("");

  const [registeredGroups, setRegisteredGroups] = useState<string[]>([]);

  const toggleGroup = (value: string) => {
    setRegisteredGroups((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const groupOptions = [
    "Barn (under 16 år)",
    "Elever/studenter",
    "Ansatte",
    "Innbyggere generelt",
    "Pasienter",
    "Sårbare grupper",
    "Søkere til tjenester",
  ];

  return (
    <section className="bg-card border border-border rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-medium mb-1 flex items-center gap-2">
        <span aria-label="people icon" role="img">
          🧑‍🤝‍🧑
        </span>
        Involverte Parter
      </h2>

      <p className="text-sm text-muted-foreground mb-4">
        Hvem er involvert i databehandlingen
      </p>

      <div className="space-y-6">
        {/* Registered Groups */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Hvem er de registrerte?
          </label>
          <div className="flex flex-col space-y-2">
            {groupOptions.map((label) => (
              <label
                key={label}
                className="inline-flex items-center space-x-2 cursor-pointer"
              >
                <input
                  checked={registeredGroups.includes(label)}
                  className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                  type="checkbox"
                  onChange={() => toggleGroup(label)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* External Processors */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Brukes eksterne leverandører/databehandlere?
          </label>
          <div className="flex items-center gap-2">
            <Switch
              checked={usesExternalProcessors}
              id="external-processors"
              onCheckedChange={setUsesExternalProcessors}
            />
            <span>{usesExternalProcessors ? "Ja" : "Nei"}</span>
          </div>
        </div>

        {/* Employee Access */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Hvor mange ansatte skal ha tilgang?
          </label>
          <Select value={employeeAccess} onValueChange={setEmployeeAccess}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Velg et alternativ..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-5">1–5 personer</SelectItem>
              <SelectItem value="6-10">6–10 personer</SelectItem>
              <SelectItem value="11-50">11–50 personer</SelectItem>
              <SelectItem value="51+">51+ personer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Share with other orgs */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Deles data med andre organisasjoner?
          </label>
          <div className="flex items-center gap-2">
            <Switch
              checked={sharesWithOthers}
              id="share-with-others"
              onCheckedChange={setSharesWithOthers}
            />
            <span>{sharesWithOthers ? "Ja" : "Nei"}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
