import { useId } from "react";
import type { Dispatch, SetStateAction } from "react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "js/components/ui/select";
import type { ContextData } from "js/hooks/useChecklist";

import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "@radix-ui/react-label";

type Props = {
  contextData: ContextData;
  onChange: Dispatch<SetStateAction<ContextData>>;
};

export const Context = ({ contextData, onChange }: Props) => {
  const baseId = useId();
  const projectSummaryId = `${baseId}-project-summary`;
  const departmentId = `${baseId}-department`;
  const statusGroupId = `${baseId}-status`;
  const purposeId = `${baseId}-purpose`;

  const handleChange = <K extends keyof ContextData>(
    field: K,
    value: ContextData[K],
  ) => {
    onChange({ ...contextData, [field]: value });
  };

  return (
    <section className="bg-card border border-border rounded-lg p-6 max-w-4xl mx-auto text-md">
      <h3 className="mb-1 flex items-center gap-2">
        Prosjekt/Initiativ Kontekst
      </h3>

      <p className="text-base text-muted-foreground mb-4">
        Grunnleggende informasjon om ditt prosjekt
      </p>

      <div className="space-y-6 p-2">
        <div className="inputGroup space-y-2">
          <label htmlFor={projectSummaryId}>
            Prosjektnavn og kort beskrivelse:
          </label>
          <Input
            className="bg-white text-base"
            id={projectSummaryId}
            placeholder="F.eks. 'Digital Skoleportal - ny løsning for elevdata'"
            value={contextData.projectSummary || ""}
            onChange={(e) => handleChange("projectSummary", e.target.value)}
          />
        </div>

        <div className="inputGroup space-y-2">
          <label htmlFor={departmentId}>Ansvarlig avdeling/enhet:</label>
          <Select
            aria-labelledby={departmentId}
            value={contextData.department}
            onValueChange={(value) => handleChange("department", value)}
          >
            <SelectTrigger className="w-full text-base" id={departmentId}>
              <SelectValue placeholder="Velg et alternativ..." />
            </SelectTrigger>
            <SelectContent className="text-base">
              <SelectItem value="tk">Trondheim Kommune</SelectItem>
              <SelectItem value="ntnuidi">NTNU IDI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div
          aria-labelledby={statusGroupId}
          className="buttonGroup space-y-2"
          role="radiogroup"
        >
          <span id={statusGroupId} role="presentation">
            Prosjektstatus:
          </span>
          <div className="space-y-2">
            {[
              ["planning", "Planlegging"],
              ["development", "Utvikling"],
              ["testing", "Testing"],
              ["implementation", "Implementering"],
              ["production", "Produksjon"],
            ].map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2 cursor-pointer text-base font-normal"
                htmlFor={`${statusGroupId}-${value}`}
              >
                <input
                  checked={contextData.status === value}
                  id={`${statusGroupId}-${value}`}
                  name="status"
                  type="radio"
                  value={value}
                  onChange={(e) => handleChange("status", e.target.value)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
        <div className="inputGroup space-y-2">
          <label htmlFor={purposeId}>Formål og mål med prosjektet:</label>
          <Textarea
            className="bg-white text-base"
            id={purposeId}
            placeholder="Beskriv hva dere ønsker å oppnå og hvorfor..."
            value={contextData.purpose || ""}
            onChange={(e) => handleChange("purpose", e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};
