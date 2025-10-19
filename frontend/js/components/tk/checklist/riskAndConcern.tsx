import { useState } from "react";

import { Slider } from "js/components/ui/slider";
import { Switch } from "js/components/ui/switch";

import { Textarea } from "../../ui/textarea";

export const RiskAndConcern = () => {
  const [privacyRisk, setPrivacyRisk] = useState(1);
  const [unauthAccess, setUnauthAccess] = useState(1);
  const [dataLoss, setDataLoss] = useState(1);
  const [reidentification, setReidentification] = useState(1);
  const [employeeConcern, setEmployeeConcern] = useState(false);
  const [regulatoryConcern, setRegulatoryConcern] = useState("");

  const riskLabels = ["Svært lav", "Lav", "Moderat", "Høy", "Svært høy"];

  const getRiskLabel = (value: number) => `${riskLabels[value - 1]} (${value})`;

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
            value={[privacyRisk]}
            onValueChange={([v]) => setPrivacyRisk(v)}
          />
          <div className="mt-1 text-xs">{getRiskLabel(privacyRisk)}</div>
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
            value={[unauthAccess]}
            onValueChange={([v]) => setUnauthAccess(v)}
          />
          <div className="mt-1 text-xs">{getRiskLabel(unauthAccess)}</div>
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
            value={[dataLoss]}
            onValueChange={([v]) => setDataLoss(v)}
          />
          <div className="mt-1 text-xs">{getRiskLabel(dataLoss)}</div>
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
            value={[reidentification]}
            onValueChange={([v]) => setReidentification(v)}
          />
          <div className="mt-1 text-xs">{getRiskLabel(reidentification)}</div>
        </div>

        {/* Employee/registered concern */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Er det bekymringer fra registrerte eller ansatte?
          </label>
          <div className="flex items-center gap-2">
            <Switch
              checked={employeeConcern}
              id="employee-concern"
              onCheckedChange={setEmployeeConcern}
            />
            <span>{employeeConcern ? "Ja" : "Nei"}</span>
          </div>
        </div>

        {employeeConcern && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Beskriv bekymringene:
            </label>
            <Textarea placeholder="Innspill eller bekymringer som er reist..." />
          </div>
        )}

        {/* Regulatory concern */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Bekymringer om regelverksetterlevelse:
          </label>
          <Textarea
            placeholder="Områder hvor dere er usikre på lovlighet..."
            value={regulatoryConcern}
            onChange={(e) => setRegulatoryConcern(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};
