import { useState } from "react";

import { Switch } from "js/components/ui/switch";

export const Tech = () => {
  const [storage, setStorage] = useState("");
  const [security, setSecurity] = useState<string[]>([]);
  const [integrations, setIntegrations] = useState(false);
  const [automated, setAutomated] = useState(false);

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

  const toggleSecurity = (value: string) => {
    setSecurity((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
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
                  checked={storage === value}
                  name="storage"
                  type="radio"
                  value={value}
                  onChange={() => setStorage(value)}
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
                  checked={security.includes(value)}
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
              checked={integrations}
              id="integrations"
              onCheckedChange={setIntegrations}
            />
            <span>{integrations ? "Ja" : "Nei"}</span>
          </div>
        </div>

        {/* Automated decisions */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Brukes automatiserte beslutninger eller profilering?
          </label>
          <div className="flex items-center gap-2">
            <Switch
              checked={automated}
              id="automated"
              onCheckedChange={setAutomated}
            />
            <span>{automated ? "Ja" : "Nei"}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
