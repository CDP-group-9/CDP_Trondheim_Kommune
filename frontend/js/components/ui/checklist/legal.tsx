import { Switch } from "@radix-ui/react-switch";
import { useState } from "react";

import { Textarea } from "../textarea";

export const Legal = () => {
  const [legalBasis, setLegalBasis] = useState("");
  const [handlesSensitiveData, setHandlesSensitiveData] = useState(false);

  return (
    <section className="bg-card border border-border rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-medium mb-1 flex items-center gap-2">
        <span aria-label="scale" role="img">
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
            {
              value: "offentlig_oppgave",
              label:
                "Offentlig oppgave (GDPR art. 6(1)(e)) - Vanligst for kommuner",
            },
            {
              value: "rettslig_forpliktelse",
              label: "Rettslig forpliktelse (GDPR art. 6(1)(c))",
            },
            {
              value: "kontraktsoppfyllelse",
              label: "Kontraktsoppfyllelse (GDPR art. 6(1)(b))",
            },
            {
              value: "samtykke",
              label: "Samtykke (GDPR art. 6(1)(a))",
            },
            {
              value: "berettiget_interesse",
              label: "Berettiget interesse (GDPR art. 6(1)(f))",
            },
            {
              value: "usikker",
              label: "Usikker – trenger veiledning",
            },
          ].map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                checked={legalBasis === value}
                name="legalBasis"
                type="radio"
                value={value}
                onChange={() => setLegalBasis(value)}
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
              checked={handlesSensitiveData}
              id="sensitive-data-switch"
              onCheckedChange={setHandlesSensitiveData}
            />
            <span>{handlesSensitiveData ? "Ja" : "Nei"}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Lovpålagte oppgaver eller krav?
          </label>
          <Textarea placeholder="Referanser til lover som krever databehandlingen..." />
        </div>
      </div>
    </section>
  );
};
