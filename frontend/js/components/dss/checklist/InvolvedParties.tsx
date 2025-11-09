import { useId } from "react";
import type { Dispatch, SetStateAction } from "react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "js/components/ui/select";
import { Switch } from "js/components/ui/switch";
import { Textarea } from "js/components/ui/textarea";
import type { InvolvedPartiesData } from "js/hooks/useChecklist";

type Props = {
  involvedPartiesData: InvolvedPartiesData;
  onChange: Dispatch<SetStateAction<InvolvedPartiesData>>;
};

export const InvolvedParties = ({ involvedPartiesData, onChange }: Props) => {
  const baseId = useId();
  const registeredGroupId = `${baseId}-registered-groups`;
  const externalSwitchId = `${baseId}-external-processors`;
  const externalTextId = `${baseId}-external-text`;
  const employeeAccessId = `${baseId}-employee-access`;
  const shareSwitchId = `${baseId}-share-with-others`;
  const sharedWithId = `${baseId}-shared-with`;

  const toggleGroup = (value: string) => {
    const updatedGroup = involvedPartiesData.registeredGroups.includes(value)
      ? involvedPartiesData.registeredGroups.filter((v: string) => v !== value)
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
      <h2 className="mb-1 flex items-center gap-2">Involverte Parter</h2>

      <p className="text-base text-muted-foreground mb-4">
        Kryss av de gruppene som er involvert i datasettet som behandles
      </p>

      <div className="space-y-6 p-2">
        {/* Registered Groups */}
        <div
          aria-labelledby={registeredGroupId}
          className="buttonGroup space-y-2"
          role="group"
        >
          <p className="font-medium" id={registeredGroupId}>
            Hvem er de registrerte?
          </p>
          <div className="flex flex-col space-y-2">
            {groupOptions.map((label) => (
              <label
                key={label}
                className="inline-flex items-center space-x-2 cursor-pointer text-base font-medium"
                htmlFor={`${registeredGroupId}-${label}`}
              >
                <input
                  checked={involvedPartiesData.registeredGroups.includes(label)}
                  className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                  id={`${registeredGroupId}-${label}`}
                  type="checkbox"
                  onChange={() => toggleGroup(label)}
                />
                <span className="text-base">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* External Processors */}
        <div className="inputGroup space-y-2">
          <label htmlFor={externalSwitchId}>
            Brukes eksterne leverandører/databehandlere?
          </label>
          <div className="flex items-center gap-2">
            <Switch
              checked={involvedPartiesData.usesExternalProcessors}
              id={externalSwitchId}
              onCheckedChange={(value) =>
                handleChange("usesExternalProcessors", value)
              }
            />
            <span className="text-base">
              {involvedPartiesData.usesExternalProcessors ? "Ja" : "Nei"}
            </span>
          </div>
        </div>

        {involvedPartiesData.usesExternalProcessors && (
          <div className="inputGroup space-y-2">
            <label htmlFor={externalTextId}>
              Eksterne leverandører/databehandlere:
            </label>
            <Textarea
              className="bg-white"
              id={externalTextId}
              placeholder="Liste over eksterne som behandler data på kommunens vegne..."
              value={involvedPartiesData.externalProcessors || ""}
              onChange={(e) =>
                handleChange("externalProcessors", e.target.value)
              }
            />
          </div>
        )}

        {/* Employee Access */}
        <div className="inputGroup space-y-2">
          <label htmlFor={employeeAccessId}>
            Hvor mange ansatte skal ha tilgang?
          </label>
          <Select
            value={involvedPartiesData.employeeAccess}
            onValueChange={(value) => handleChange("employeeAccess", value)}
          >
            <SelectTrigger className="w-full" id={employeeAccessId}>
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
        <div className="inputGroup space-y-2">
          <label htmlFor={shareSwitchId}>
            Deles data med andre organisasjoner?
          </label>
          <div className="flex items-center gap-2">
            <Switch
              checked={involvedPartiesData.sharesWithOthers}
              id={shareSwitchId}
              onCheckedChange={(value) =>
                handleChange("sharesWithOthers", value)
              }
            />
            <span>{involvedPartiesData.sharesWithOthers ? "Ja" : "Nei"}</span>
          </div>
        </div>

        {involvedPartiesData.sharesWithOthers && (
          <div className="inputGroup space-y-2">
            <label htmlFor={sharedWithId}>Hvem deles det data med?</label>
            <Textarea
              className="bg-white"
              id={sharedWithId}
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
