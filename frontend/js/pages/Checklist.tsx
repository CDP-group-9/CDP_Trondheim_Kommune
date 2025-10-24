import { Context } from "../components/tk/checklist/context";
import { Data } from "../components/tk/checklist/data";
import { InvolvedParties } from "../components/tk/checklist/involvedParties";
import { Legal } from "../components/tk/checklist/legal";
import { ReceiveOrShareData } from "../components/tk/checklist/receiveOrShareData";
import { RiskAndConcern } from "../components/tk/checklist/riskAndConcern";
import { Tech } from "../components/tk/checklist/tech";
import ProgressBarUpdated from "../components/tk/progressbar-updated";
import { Button } from "../components/ui/button";
import { useChecklist } from "../hooks/useChecklist";

const Checklist = () => {
  const {
    selectedOption,
    setSelectedOption,
    contextData,
    setContextData,
    handlingData,
    setHandlingData,
    legalBasisData,
    setLegalBasisData,
    involvedPartiesData,
    setInvolvedPartiesData,
    techData,
    setTechData,
    riskConcernData,
    setRiskConcernData,
    sendToBackend,
    downloadAsTextFile,
    resetChecklist,
  } = useChecklist();

  return (
    <div>
      <ProgressBarUpdated />
      <div className="flex justify-start mb-4 border-b border-gray-300">
        <div className="flex-1 space-y-6 max-w-4xl px-6 py-4">
          <h1 className="text-3xl font-medium mb-1">Personvernsjekkliste</h1>
          <p className="text-muted-foreground text-left tk-readable">
            Systematisk gjennomgang av alle personvernkrav for ditt prosjekt
          </p>
        </div>
      </div>

      <div className="space-y-6 p-4">
        <ReceiveOrShareData
          selected={selectedOption}
          onSelect={setSelectedOption}
        />
        {selectedOption && (
          <>
            <p className="text-center text-muted-foreground tk-readable mx-auto">
              Fyll ut informasjonen nedenfor for å gi AI-assistenten best mulig
              grunnlag for veiledning.
            </p>

            <Context contextData={contextData} onChange={setContextData} />
            <Data
              handlingData={handlingData}
              selectedOption={selectedOption}
              onChange={setHandlingData}
            />
            <Legal
              legalBasisData={legalBasisData}
              onChange={setLegalBasisData}
            />
            <InvolvedParties
              involvedPartiesData={involvedPartiesData}
              onChange={setInvolvedPartiesData}
            />
            <Tech techData={techData} onChange={setTechData} />
            <RiskAndConcern
              riskConcernData={riskConcernData}
              onChange={setRiskConcernData}
            />
            <div className="flex justify-center space-x-4 pb-1">
              <Button
                className="bg-gray-200 text-gray-900 hover:bg-gray-300"
                onClick={resetChecklist}
              >
                Nullstill skjema
              </Button>
              <Button onClick={sendToBackend}>Generer veiledning</Button>
              <Button onClick={downloadAsTextFile}>
                Eksporter til tekstfil
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checklist;
