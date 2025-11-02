import type { Dispatch, SetStateAction } from "react";

import { Switch } from "js/components/ui/switch";
import { Textarea } from "js/components/ui/textarea";
import type { TechData } from "js/hooks/useChecklist";

type Props = {
  techData: TechData;
  onChange: Dispatch<SetStateAction<TechData>>;
};

export const Tech = ({ techData, onChange }: Props) => {
  const storageOptions = [
    { value: "onprem", label: "Kommunens egne servere (on-premise)" },
    { value: "cloudNO", label: "Sky-løsning i Norge" },
    { value: "cloudEU", label: "Sky-løsning i EU/EØS" },
    { value: "cloud3rd", label: "Sky-løsning utenfor EU/EØS" },
    { value: "hybrid", label: "Hybrid løsning" },
  ];

  const securityOptions = [
    { value: "tls", label: "Kryptering under overføring (TLS/SSL)" },
    { value: "atrest", label: "Kryptering ved lagring" },
    { value: "mfa", label: "Multifaktor autentisering (MFA)" },
    { value: "roles", label: "Tilgangskontroll basert på roller" },
    { value: "logging", label: "Logging og sporbarhet" },
    { value: "backup", label: "Regelmessig backup" },
    { value: "firewall", label: "Brannmur/nettverkssikkerhet" },
    { value: "antivirus", label: "Antivirus/malware beskyttelse" },
    { value: "plan", label: "Beredskapsplan for databrudd" },
  ];

  const handleChange = <K extends keyof TechData>(
    field: K,
    value: TechData[K],
  ) => {
    onChange({ ...techData, [field]: value });
  };

  const toggleSecurity = (value: string) => {
    const newSecurity = techData.security.includes(value)
      ? techData.security.filter((item: string) => item !== value)
      : [...techData.security, value];
    handleChange("security", newSecurity);
  };

  return (
    <section className="bg-card border border-border rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-medium mb-1 flex items-center gap-2">
        <span aria-label="computer icon" role="img">
          🖥️
        </span>
        Teknisk Løsning
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Tekniske aspekter ved databehandlingen
      </p>

      <div className="space-y-6">
        {/* Storage location */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Hvor lagres/behandles dataene?
          </label>
          <div className="flex flex-col space-y-2">
            {storageOptions.map(({ value, label }) => (
              <label
                key={value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  checked={techData.storage === value}
                  name="storage"
                  type="radio"
                  value={value}
                  onChange={() => handleChange("storage", value)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Security measures */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Planlagte sikkerhetstiltak:
          </label>
          <div className="flex flex-col space-y-2">
            {securityOptions.map(({ value, label }) => (
              <label
                key={value}
                className="inline-flex items-center space-x-2 cursor-pointer"
              >
                <input
                  checked={techData.security.includes(value)}
                  className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                  type="checkbox"
                  onChange={() => toggleSecurity(value)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Integrasjoner med andre systemer?
          </label>
          <div className="flex items-center gap-2">
            <Switch
              checked={techData.integrations}
              id="integrations"
              onCheckedChange={(v) => handleChange("integrations", v)}
            />
            <span>{techData.integrations ? "Ja" : "Nei"}</span>
          </div>
        </div>

        {techData.integrations && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Hvilke systemer?
            </label>
            <Textarea
              placeholder="Beskriv hvilke systemer som skal kommunisere sammen..."
              value={techData.integrationDetails || ""}
              onChange={(e) =>
                handleChange("integrationDetails", e.target.value)
              }
            />
          </div>
        )}

        {/* Automated decisions */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Brukes automatiserte beslutninger eller profilering?
          </label>
          <div className="flex items-center gap-2">
            <Switch
              checked={techData.automated}
              id="automated"
              onCheckedChange={(v) => handleChange("automated", v)}
            />
            <span>{techData.automated ? "Ja" : "Nei"}</span>
          </div>
        </div>

        {techData.automated && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Beskriv automatiserte beslutninger:
            </label>
            <Textarea
              placeholder="F.eks. algoritmer for tildeling, scoring, profiling..."
              value={techData.automatedDescription || ""}
              onChange={(e) =>
                handleChange("automatedDescription", e.target.value)
              }
            />
          </div>
        )}
      </div>
    </section>
  );
};
