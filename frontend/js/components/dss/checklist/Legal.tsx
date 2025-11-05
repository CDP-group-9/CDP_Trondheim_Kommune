import { useId } from "react";
import type { Dispatch, SetStateAction } from "react";

import { Switch } from "js/components/ui/switch";
import type { LegalBasisData } from "js/hooks/useChecklist";

import { Textarea } from "../../ui/textarea";

type Props = {
  legalBasisData: LegalBasisData;
  onChange: Dispatch<SetStateAction<LegalBasisData>>;
};

export const Legal = ({ legalBasisData, onChange }: Props) => {
  const baseId = useId();
  const legalBasisGroupId = `${baseId}-legal-basis`;
  const sensitiveSwitchId = `${baseId}-sensitive-switch`;
  const sensitiveGroupId = `${baseId}-sensitive-reasons`;
  const statutoryTasksId = `${baseId}-statutory-tasks`;

  const handleChange = <K extends keyof LegalBasisData>(
    field: K,
    value: LegalBasisData[K],
  ) => {
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
        ? legalBasisData.selectedSensitiveDataReason.filter(
            (v: string) => v !== value,
          )
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
        <div
          aria-labelledby={legalBasisGroupId}
          className="buttonGroup space-y-2"
          role="radiogroup"
        >
          <span
            className="block text-sm font-medium"
            id={legalBasisGroupId}
            role="presentation"
          >
            Hvilket rettsgrunnlag planlegges brukt?
          </span>
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
              htmlFor={`${legalBasisGroupId}-${value}`}
            >
              <input
                id={`${legalBasisGroupId}-${value}`}
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

        <div className="inputGroup space-y-2">
          <label
            className="block text-sm font-medium"
            htmlFor={sensitiveSwitchId}
          >
            Behandles sensitive personopplysninger?
          </label>
          <div className="flex items-center gap-2">
            <Switch
              checked={legalBasisData.handlesSensitiveData}
              id={sensitiveSwitchId}
              onCheckedChange={(value) =>
                handleChange("handlesSensitiveData", value)
              }
            />
            <span>{legalBasisData.handlesSensitiveData ? "Ja" : "Nei"}</span>
          </div>
        </div>

        {legalBasisData.handlesSensitiveData && (
          <div
            aria-labelledby={sensitiveGroupId}
            className="buttonGroup space-y-2"
            role="group"
          >
            <span
              className="block text-sm font-medium"
              id={sensitiveGroupId}
              role="presentation"
            >
              Rettsgrunnlag for sensitive opplysninger (GDPR art. 9)
            </span>
            <div className="flex flex-col space-y-2">
              {sensitiveDataReasons.map(({ value, label }) => (
                <label
                  key={value}
                  className="inline-flex items-center space-x-2 cursor-pointer"
                  htmlFor={`${sensitiveGroupId}-${value}`}
                >
                  <input
                    id={`${sensitiveGroupId}-${value}`}
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

        <div className="inputGroup space-y-2">
          <label
            className="block text-sm font-medium"
            htmlFor={statutoryTasksId}
          >
            Lovpålagte oppgaver eller krav?
          </label>
          <Textarea
            id={statutoryTasksId}
            placeholder="Referanser til lover som krever databehandlingen..."
            value={legalBasisData.statutoryTasks || ""}
            onChange={(e) => handleChange("statutoryTasks", e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};
