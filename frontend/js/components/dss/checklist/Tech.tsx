import { useId } from "react";
import type { Dispatch, SetStateAction } from "react";

import { Switch } from "js/components/ui/switch";
import { Textarea } from "js/components/ui/textarea";
import type { TechData } from "js/hooks/useChecklist";

type Props = {
  techData: TechData;
  onChange: Dispatch<SetStateAction<TechData>>;
};

export const Tech = ({ techData, onChange }: Props) => {
  const baseId = useId();
  const storageGroupId = `${baseId}-storage`;
  const securityGroupId = `${baseId}-security`;
  const integrationsSwitchId = `${baseId}-integrations`;
  const integrationsDetailsId = `${baseId}-integration-details`;
  const automatedSwitchId = `${baseId}-automated`;
  const automatedDetailsId = `${baseId}-automated-details`;

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
      <h3 className="mb-1 flex items-center gap-2">Teknisk Løsning</h3>
      <p className="text-base text-muted-foreground mb-4 tk-readable">
        Velg hvor data behandles, hvilke sikkerhetstiltak som brukes, og
        integrasjoner eller automatiserte beslutninger.
      </p>
      <div className="space-y-6 p-2">
        {/* Storage location */}
        <div
          aria-labelledby={storageGroupId}
          className="buttonGroup space-y-2"
          role="radiogroup"
        >
          <span id={storageGroupId} role="presentation">
            Hvor lagres/behandles dataene?
          </span>
          <div className="flex flex-col space-y-2">
            {storageOptions.map(({ value, label }) => (
              <label
                key={value}
                className="flex items-center gap-2 cursor-pointer text-base font-normal"
                htmlFor={`${storageGroupId}-${value}`}
              >
                <input
                  checked={techData.storage === value}
                  id={`${storageGroupId}-${value}`}
                  name="storage"
                  type="radio"
                  value={value}
                  onChange={() => handleChange("storage", value)}
                />
                <span className="text-base">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Security measures */}
        <div
          aria-labelledby={securityGroupId}
          className="buttonGroup space-y-2"
          role="group"
        >
          <span id={securityGroupId} role="presentation">
            Planlagte sikkerhetstiltak:
          </span>
          <div className="flex flex-col space-y-2">
            {securityOptions.map(({ value, label }) => (
              <label
                key={value}
                className="inline-flex items-center space-x-2 cursor-pointer"
                htmlFor={`${securityGroupId}-${value}`}
              >
                <input
                  checked={techData.security.includes(value)}
                  className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                  id={`${securityGroupId}-${value}`}
                  type="checkbox"
                  onChange={() => toggleSecurity(value)}
                />
                <span className="text-base">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div className="inputGroup space-y-2">
          <label htmlFor={integrationsSwitchId}>
            Integrasjoner med andre systemer?
          </label>
          <div className="flex items-center gap-2">
            <Switch
              checked={techData.integrations}
              id={integrationsSwitchId}
              onCheckedChange={(v) => handleChange("integrations", v)}
            />
            <span className="text-base">
              {techData.integrations ? "Ja" : "Nei"}
            </span>
          </div>
        </div>

        {techData.integrations && (
          <div className="inputGroup space-y-2">
            <label htmlFor={integrationsDetailsId}>Hvilke systemer?</label>
            <Textarea
              className="bg-white text-base"
              id={integrationsDetailsId}
              placeholder="Beskriv hvilke systemer som skal kommunisere sammen..."
              value={techData.integrationDetails || ""}
              onChange={(e) =>
                handleChange("integrationDetails", e.target.value)
              }
            />
          </div>
        )}

        {/* Automated decisions */}
        <div className="inputGroup space-y-2">
          <label htmlFor={automatedSwitchId}>
            Brukes automatiserte beslutninger eller profilering?
          </label>
          <div className="flex items-center gap-2">
            <Switch
              checked={techData.automated}
              id={automatedSwitchId}
              onCheckedChange={(v) => handleChange("automated", v)}
            />
            <span className="text-base">
              {techData.automated ? "Ja" : "Nei"}
            </span>
          </div>
        </div>

        {techData.automated && (
          <div className="inputGroup space-y-2">
            <label htmlFor={automatedDetailsId}>
              Beskriv automatiserte beslutninger:
            </label>
            <Textarea
              className="bg-white text-base"
              id={automatedDetailsId}
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
