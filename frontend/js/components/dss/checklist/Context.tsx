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

type Props = {
  contextData: ContextData;
  onChange: Dispatch<SetStateAction<ContextData>>;
};

export const Context = ({ contextData, onChange }: Props) => {
  const handleChange = <K extends keyof ContextData>(
    field: K,
    value: ContextData[K],
  ) => {
    onChange({ ...contextData, [field]: value });
  };

  return (
    <section className="bg-card border border-border rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-medium mb-1 flex items-center gap-2">
        <span aria-label="target icon" role="img">
          🎯
        </span>
        Prosjekt/Initiativ Kontekst
      </h2>

      <p className="text-sm text-muted-foreground mb-4">
        Grunnleggende informasjon om ditt prosjekt
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Prosjektnavn og kort beskrivelse:
          </label>
          <Input
            placeholder="F.eks. 'Digital Skoleportal - ny løsning for elevdata'"
            value={contextData.projectSummary || ""}
            onChange={(e) => handleChange("projectSummary", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Ansvarlig avdeling/enhet:
          </label>
          <Select
            value={contextData.department}
            onValueChange={(value) => handleChange("department", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Velg et alternativ..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tk">Trondheim Kommune</SelectItem>
              <SelectItem value="ntnuidi">NTNU IDI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Prosjektstatus:
          </label>
          <div className="space-y-2">
            {[
              ["planning", "Planlegging"],
              ["development", "Utvikling"],
              ["testing", "Testing"],
              ["implementation", "Implementering"],
              ["production", "Produksjon"],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  checked={contextData.status === value}
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
        <div>
          <label className="block text-sm font-medium mb-2">
            Formål og mål med prosjektet:
          </label>
          <Textarea
            placeholder="Beskriv hva dere ønsker å oppnå og hvorfor..."
            value={contextData.purpose || ""}
            onChange={(e) => handleChange("purpose", e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};
