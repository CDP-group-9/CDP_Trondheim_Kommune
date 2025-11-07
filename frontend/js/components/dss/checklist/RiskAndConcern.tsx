import { useId } from "react";
import type { Dispatch, SetStateAction } from "react";

import { Slider } from "js/components/ui/slider";
import { Switch } from "js/components/ui/switch";
import type { RiskConcernData } from "js/hooks/useChecklist";

import { Textarea } from "../../ui/textarea";

type Props = {
  riskConcernData: RiskConcernData;
  onChange: Dispatch<SetStateAction<RiskConcernData>>;
};

export const RiskAndConcern = ({ riskConcernData, onChange }: Props) => {
  const baseId = useId();
  const privacyRiskLabelId = `${baseId}-privacy-risk-label`;
  const privacyRiskSliderId = `${baseId}-privacy-risk-slider`;
  const unauthAccessLabelId = `${baseId}-unauth-access-label`;
  const unauthAccessSliderId = `${baseId}-unauth-access-slider`;
  const dataLossLabelId = `${baseId}-data-loss-label`;
  const dataLossSliderId = `${baseId}-data-loss-slider`;
  const reidentificationLabelId = `${baseId}-reidentification-label`;
  const reidentificationSliderId = `${baseId}-reidentification-slider`;
  const employeeConcernSwitchId = `${baseId}-employee-concern`;
  const concernDetailsId = `${baseId}-concern-details`;
  const regulatoryConcernId = `${baseId}-regulatory-concern`;

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
      <h2 className="mb-1 flex items-center gap-2">Risikoer og Bekymringer</h2>
      <p className="text-muted-foreground mb-4">
        Identifiserte utfordringer og risikoer
      </p>

      <div className="space-y-6 p-2">
        {/* Privacy risk */}
        <div className="inputGroup space-y-2">
          <label
            className="text-md"
            htmlFor={privacyRiskSliderId}
            id={privacyRiskLabelId}
          >
            Samlet vurdering av personvernsrisiko
          </label>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-base">Svært lav</span>
            <span className="text-base">Svært høy</span>
          </div>
          <Slider
            aria-labelledby={privacyRiskLabelId}
            className="w-full p-1"
            id={privacyRiskSliderId}
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
        <div className="inputGroup space-y-2">
          <label
            className="text-md"
            htmlFor={unauthAccessSliderId}
            id={unauthAccessLabelId}
          >
            Risiko for uautorisert tilgang
          </label>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-base">Svært lav</span>
            <span className="text-base">Svært høy</span>
          </div>
          <Slider
            aria-labelledby={unauthAccessLabelId}
            className="w-full p-1"
            id={unauthAccessSliderId}
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
        <div className="inputGroup space-y-2">
          <label
            className="text-md"
            htmlFor={dataLossSliderId}
            id={dataLossLabelId}
          >
            Risiko for datatap
          </label>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-base">Svært lav</span>
            <span className="text-base">Svært høy</span>
          </div>
          <Slider
            aria-labelledby={dataLossLabelId}
            className="w-full p-1"
            id={dataLossSliderId}
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
        <div className="inputGroup space-y-2">
          <label
            className="text-md"
            htmlFor={reidentificationSliderId}
            id={reidentificationLabelId}
          >
            Risiko for re-identifisering av anonymiserte data
          </label>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-base">Svært lav</span>
            <span className="text-base">Svært høy</span>
          </div>
          <Slider
            aria-labelledby={reidentificationLabelId}
            className="w-full p-1"
            id={reidentificationSliderId}
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
        <div className="inputGroup space-y-2">
          <label htmlFor={employeeConcernSwitchId}>
            Er det bekymringer fra registrerte eller ansatte?
          </label>
          <div className="flex items-center gap-2">
            <Switch
              checked={riskConcernData.employeeConcern}
              id={employeeConcernSwitchId}
              onCheckedChange={(value) =>
                handleChange("employeeConcern", value)
              }
            />
            <span className="text-base">
              {riskConcernData.employeeConcern ? "Ja" : "Nei"}
            </span>
          </div>
        </div>

        {riskConcernData.employeeConcern && (
          <div className="inputGroup space-y-2">
            <label htmlFor={concernDetailsId}>Beskriv bekymringene:</label>
            <Textarea
              className="bg-white"
              id={concernDetailsId}
              placeholder="Innspill eller bekymringer som er reist..."
              value={riskConcernData.writtenConcern || ""}
              onChange={(e) => handleChange("writtenConcern", e.target.value)}
            />
          </div>
        )}

        {/* Regulatory concern */}
        <div className="inputGroup space-y-2">
          <label htmlFor={regulatoryConcernId}>
            Bekymringer om regelverksetterlevelse:
          </label>
          <Textarea
            className="bg-white"
            id={regulatoryConcernId}
            placeholder="Områder hvor dere er usikre på lovlighet..."
            value={riskConcernData.regulatoryConcern || ""}
            onChange={(e) => handleChange("regulatoryConcern", e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};
