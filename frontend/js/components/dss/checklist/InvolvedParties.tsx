import type { Dispatch, SetStateAction } from "react";

import type { InvolvedPartiesData } from "js/hooks/useChecklist";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "js/components/ui/select";
import { Switch } from "js/components/ui/switch";
import { Textarea } from "js/components/ui/textarea";

type Props = {
  involvedPartiesData: InvolvedPartiesData;
  onChange: Dispatch<SetStateAction<InvolvedPartiesData>>;
};

export const InvolvedParties = ({ involvedPartiesData, onChange }: Props) => {
  const toggleGroup = (value: string) => {
    const updatedGroup = involvedPartiesData.registeredGroups.includes(value)
      ? involvedPartiesData.registeredGroups.filter((v) => v !== value)
      : [...involvedPartiesData.registeredGroups, value];
    onChange({ ...involvedPartiesData, registeredGroups: updatedGroup });
  };

  const handleChange = <K extends keyof InvolvedPartiesData>(
    field: K,
    value: InvolvedPartiesData[K],
  ) => {
    onChange({ ...involvedPartiesData, [field]: value });
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
                  checked={involvedPartiesData.registeredGroups.includes(label)}
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
              checked={involvedPartiesData.usesExternalProcessors}
              id="external-processors"
              onCheckedChange={(value) =>
                handleChange("usesExternalProcessors", value)
              }
            />
            <span>
              {involvedPartiesData.usesExternalProcessors ? "Ja" : "Nei"}
            </span>
          </div>
        </div>

        {involvedPartiesData.usesExternalProcessors && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Eksterne leverandører/databehandlere:
            </label>
            <Textarea
              placeholder="Liste over eksterne som behandler data på kommunens vegne..."
              value={involvedPartiesData.externalProcessors || ""}
              onChange={(e) =>
                handleChange("externalProcessors", e.target.value)
              }
            />
          </div>
        )}

        {/* Employee Access */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Hvor mange ansatte skal ha tilgang?
          </label>
          <Select
            value={involvedPartiesData.employeeAccess}
            onValueChange={(value) => handleChange("employeeAccess", value)}
          >
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
              checked={involvedPartiesData.sharesWithOthers}
              id="share-with-others"
              onCheckedChange={(value) =>
                handleChange("sharesWithOthers", value)
              }
            />
            <span>{involvedPartiesData.sharesWithOthers ? "Ja" : "Nei"}</span>
          </div>
        </div>

        {involvedPartiesData.sharesWithOthers && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Hvem deles det data med?
            </label>
            <Textarea
              placeholder="F.eks. andre kommuner, statlige etater, private aktører..."
              value={involvedPartiesData.sharedWith || ""}
              onChange={(e) => handleChange("sharedWith", e.target.value)}
            />
          </div>
        )}
      </div>
    </section>
  );
};
