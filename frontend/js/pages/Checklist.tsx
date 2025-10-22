import { useState } from "react";

import { Context } from "../components/tk/checklist/context";
import { Data } from "../components/tk/checklist/data";
import { InvolvedParties } from "../components/tk/checklist/involvedParties";
import { Legal } from "../components/tk/checklist/legal";
import { ReceiveOrShareData } from "../components/tk/checklist/receiveOrShareData";
import { RiskAndConcern } from "../components/tk/checklist/riskAndConcern";
import { Tech } from "../components/tk/checklist/tech";
import ProgressBarUpdated from "../components/tk/progressbar-updated";
import { Button } from "../components/ui/button";

const Checklist = () => {
  const [selectedOption, setSelectedOption] = useState<
    "receive" | "share" | null
  >(null);

  return (
    <div>
      <ProgressBarUpdated />
      <div className="flex justify-start mb-4 border-b border-gray-300">
        <div className="flex-1 space-y-6 max-w-4xl px-6 py-4">
          <div className="text-left space-y-4">
            <h1 className="text-3xl font-medium mb-1">Personvernsjekkliste</h1>
            <p className="text-muted-foreground text-left tk-readable">
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
              <p className="text-center text-muted-foreground tk-readable mx-auto">
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
