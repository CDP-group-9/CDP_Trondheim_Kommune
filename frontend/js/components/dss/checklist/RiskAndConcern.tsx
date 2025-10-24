import type { Dispatch, SetStateAction } from "react";

import type { RiskConcernData } from "js/hooks/useChecklist";

import { Slider } from "js/components/ui/slider";
import { Switch } from "js/components/ui/switch";

import { Textarea } from "../../ui/textarea";

type Props = {
  riskConcernData: RiskConcernData;
  onChange: Dispatch<SetStateAction<RiskConcernData>>;
};

export const RiskAndConcern = ({ riskConcernData, onChange }: Props) => {
  const riskLabels = ["Svært lav", "Lav", "Moderat", "Høy", "Svært høy"];

  const getRiskLabel = (value: number) => `${riskLabels[value - 1]} (${value})`;

  const handleChange = <K extends keyof RiskConcernData>(
    field: K,
    value: RiskConcernData[K],
  ) => {
    onChange({ ...riskConcernData, [field]: value });
  };

  return (
    <section className="bg-card border border-border rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-medium mb-1 flex items-center gap-2">
        <span aria-label="warning icon" role="img">
          🚨
        </span>
        Risikoer og Bekymringer
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Identifiserte utfordringer og risikoer
      </p>

      <div className="space-y-6">
        {/* Privacy risk */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Samlet vurdering av personvernsrisiko
          </label>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Svært lav</span>
            <span>Svært høy</span>
          </div>
          <Slider
            className="w-full p-1"
            max={5}
            min={1}
            step={1}
            value={[riskConcernData.privacyRisk]}
            onValueChange={([v]) => handleChange("privacyRisk", v)}
          />
          <div className="mt-1 text-xs">
            {getRiskLabel(riskConcernData.privacyRisk)}
          </div>
        </div>

        {/* Unauthorized access */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Risiko for uautorisert tilgang
          </label>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Svært lav</span>
            <span>Svært høy</span>
          </div>
          <Slider
            className="w-full p-1"
            max={5}
            min={1}
            step={1}
            value={[riskConcernData.unauthAccess]}
            onValueChange={([v]) => handleChange("unauthAccess", v)}
          />
          <div className="mt-1 text-xs">
            {getRiskLabel(riskConcernData.unauthAccess)}
          </div>
        </div>

        {/* Data loss */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Risiko for datatap
          </label>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Svært lav</span>
            <span>Svært høy</span>
          </div>
          <Slider
            className="w-full p-1"
            max={5}
            min={1}
            step={1}
            value={[riskConcernData.dataLoss]}
            onValueChange={([v]) => handleChange("dataLoss", v)}
          />
          <div className="mt-1 text-xs">
            {getRiskLabel(riskConcernData.dataLoss)}
          </div>
        </div>

        {/* Re-identification */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Risiko for re-identifisering av anonymiserte data
          </label>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Svært lav</span>
            <span>Svært høy</span>
          </div>
          <Slider
            className="w-full p-1"
            max={5}
            min={1}
            step={1}
            value={[riskConcernData.reidentification]}
            onValueChange={([v]) => handleChange("reidentification", v)}
          />
          <div className="mt-1 text-xs">
            {getRiskLabel(riskConcernData.reidentification)}
          </div>
        </div>

        {/* Employee/registered concern */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Er det bekymringer fra registrerte eller ansatte?
          </label>
          <div className="flex items-center gap-2">
            <Switch
              checked={riskConcernData.employeeConcern}
              id="employee-concern"
              onCheckedChange={(value) =>
                handleChange("employeeConcern", value)
              }
            />
            <span>{riskConcernData.employeeConcern ? "Ja" : "Nei"}</span>
          </div>
        </div>

        {riskConcernData.employeeConcern && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Beskriv bekymringene:
            </label>
            <Textarea
              placeholder="Innspill eller bekymringer som er reist..."
              value={riskConcernData.writtenConcern || ""}
              onChange={(e) => handleChange("writtenConcern", e.target.value)}
            />
          </div>
        )}

        {/* Regulatory concern */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Bekymringer om regelverksetterlevelse:
          </label>
          <Textarea
            placeholder="Områder hvor dere er usikre på lovlighet..."
            value={riskConcernData.regulatoryConcern || ""}
            onChange={(e) => handleChange("regulatoryConcern", e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};
