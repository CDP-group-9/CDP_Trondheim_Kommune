import { useState } from "react";

import { Context } from "js/components/ui/checklist/context";
import { Data } from "js/components/ui/checklist/data";
import { InvolvedParties } from "js/components/ui/checklist/involvedParties";
import { Legal } from "js/components/ui/checklist/legal";
import { ReceiveOrShareData } from "js/components/ui/checklist/receiveOrShareData";
import { RiskAndConcern } from "js/components/ui/checklist/riskAndConcern";
import { Tech } from "js/components/ui/checklist/tech";

const Checklist = () => {
  const [selectedOption, setSelectedOption] = useState<
    "receive" | "share" | null
  >(null);

  return (
    <div>
      <div className="flex justify-start mb-4 border-b border-black shadow">
        <div className="flex-1 space-y-6 max-w-4xl px-6 py-4">
          <div className="text-left space-y-4">
            <h1 className="text-3xl font-medium mb-1">Personvernsjekkliste</h1>
            <p className="text-muted-foreground text-left max-w-2xl">
              Systematisk gjennomgang av alle personvernkrav for ditt prosjekt
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-6 p-4">
        <ReceiveOrShareData
          selected={selectedOption}
          onSelect={setSelectedOption}
        />
        {selectedOption && (
          <>
            {/* <ProgressBar /> hvis det er nøvendig kan dette lages */}
            <div className="flex justify-center">
              <p className="text-center text-muted-foreground max-w-2xl">
                Fyll ut informasjonen nedenfor for å gi AI-assistenten best
                mulig grunnlag for å hjelpe deg med personvernvurdering, DPIA og
                juridisk veiledning.
              </p>
            </div>
            <Context />
            <Data selectedOption={selectedOption} />
            <Legal />
            <InvolvedParties />
            <Tech />
            <RiskAndConcern />
          </>
        )}
      </div>
    </div>
  );
};

export default Checklist;
