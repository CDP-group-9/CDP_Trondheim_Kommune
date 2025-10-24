import { Switch } from "js/components/ui/switch";

import { Textarea } from "../../ui/textarea";

export const Legal = ({ legalBasisData, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...legalBasisData, [field]: value });
  };

  const sensitiveDataReasons = [
    {
      value: "consent",
      label: "Uttrykkelig samtykke (art. 9(2)(a))",
    },
    {
      value: "healthcare",
      label: "Helsehjelp og forebygging (art. 9(2)(h))",
    },
    {
      value: "public_health",
      label: "Samfunnsinteresser i folkehelsearbeid (art. 9(2)(i))",
    },
    {
      value: "public_insterest",
      label: "Viktig samfunnsinteresse (art. 9(2)(g))",
    },
  ];

  const toggleSensitive = (value: string) => {
    const updatedSensitive =
      legalBasisData.selectedSensitiveDataReason.includes(value)
        ? legalBasisData.selectedSensitiveDataReason.filter((v) => v !== value)
        : [...legalBasisData.selectedSensitiveDataReason, value];
    onChange({
      ...legalBasisData,
      selectedSensitiveDataReason: updatedSensitive,
    });
  };

  return (
    <section className="bg-card border border-border rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-medium mb-1 flex items-center gap-2">
        <span aria-label="scale icon" role="img">
          ⚖️
        </span>
        Rettsgrunnlag og Formål
      </h2>

      <p className="text-sm text-muted-foreground mb-4">
        Juridisk grunnlag for databehandlingen
      </p>

      {/* Legal basis radio buttons */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Hvilket rettsgrunnlag planlegges brukt?
          </label>
          {[
            [
              "offentlig_oppgave",
              "Offentlig oppgave (GDPR art. 6(1)(e)) - Vanligst for kommuner",
            ],
            [
              "rettslig_forpliktelse",
              "Rettslig forpliktelse (GDPR art. 6(1)(c))",
            ],
            ["kontaktsoppfyllelse", "Kontraktsoppfyllelse (GDPR art. 6(1)(b))"],
            ["samtykke", "Samtykke (GDPR art. 6(1)(a))"],
            [
              "berettiget_interesse",
              "Berettiget interesse (GDPR art. 6(1)(f))",
            ],
            ["usikker", "Usikker – trenger veiledning"],
          ].map(([value, label]) => (
            <label
              key={value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                checked={legalBasisData.legalBasis === value}
                name="legalBasis"
                type="radio"
                value={value}
                onChange={(e) => handleChange("legalBasis", e.target.value)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Behandles sensitive personopplysninger?
          </label>
          <div className="flex items-center gap-2">
            <Switch
              checked={legalBasisData.handlesSensitiveData}
              id="sensitive-data-switch"
              onCheckedChange={(value) =>
                handleChange("handlesSensitiveData", value)
              }
            />
            <span>{legalBasisData.handlesSensitiveData ? "Ja" : "Nei"}</span>
          </div>
        </div>

        {legalBasisData.handlesSensitiveData && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Rettsgrunnlag for sensitive opplysninger (GDPR art. 9)
            </label>
            <div className="flex flex-col space-y-2">
              {sensitiveDataReasons.map(({ value, label }) => (
                <label
                  key={value}
                  className="inline-flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    checked={legalBasisData.selectedSensitiveDataReason.includes(
                      value,
                    )}
                    className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                    type="checkbox"
                    onChange={() => toggleSensitive(value)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Lovpålagte oppgaver eller krav?
          </label>
          <Textarea
            placeholder="Referanser til lover som krever databehandlingen..."
            onChange={(e) => handleChange("statutoryTasks", e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};
