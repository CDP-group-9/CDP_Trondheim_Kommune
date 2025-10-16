import { useState } from "react";

import { Context } from "js/components/tk/checklist/context";
import { Data } from "js/components/tk/checklist/data";
import { InvolvedParties } from "js/components/tk/checklist/involvedParties";
import { Legal } from "js/components/tk/checklist/legal";
import { ReceiveOrShareData } from "js/components/tk/checklist/receiveOrShareData";
import { RiskAndConcern } from "js/components/tk/checklist/riskAndConcern";
import { Tech } from "js/components/tk/checklist/tech";
import ProgressBarUpdated from "js/components/tk/progressbar-updated";
import { Button } from "js/components/ui/button";

const Checklist = () => {
  const [selectedOption, setSelectedOption] = useState<
    "receive" | "share" | null
  >(null);

  return (
    <div>
      <ProgressBarUpdated />
      <div className="flex justify-start mb-4 border-b border-black shadow-[0_4px_4px_-2px_rgba(0,0,0,0.2)]">
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
            <div className="flex justify-center space-x-4 pb-1">
              <Button
                className="bg-gray-200 text-gray-900 hover:bg-gray-300 cursor-pointer"
                onClick={() => window.location.reload()}
              >
                Nullstill skjema
              </Button>
              <Button className="cursor-pointer">Generer veiledning</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checklist;
