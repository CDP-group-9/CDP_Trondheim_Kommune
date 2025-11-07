import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Context,
  Data,
  InvolvedParties,
  Legal,
  ReceiveOrShareData,
  RiskAndConcern,
  Tech,
  DssProgressBar,
} from "components/dss";
import { Button } from "components/ui/button";

import { useChecklist } from "../hooks/useChecklist";

const Checklist = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

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
    redirectToChat,
    downloadAsTextFile,
    resetChecklist,
    createNewChecklist,
    isSubmitting,
    submitError,
  } = useChecklist();

  const handleRedirectToChat = async () => {
    try {
      setIsNavigating(true);
      // Save the checklist and create/link a chat
      await redirectToChat();
      navigate("/");
      // Create new checklist after successful navigation
      // Small delay to ensure navigation completes
      setTimeout(() => {
        createNewChecklist();
        setIsNavigating(false);
      }, 100);
    } catch (error) {
      setIsNavigating(false);
    }
  };

  const isLoading = isSubmitting || isNavigating;

  return (
    <div>
      <DssProgressBar />
      <div className="mt-8 flex justify-start mb-4 border-b border-gray-300">
        <div className="flex-1 space-y-6 max-w-4xl px-6 py-4">
          <h1 className="font-medium mb-1">Personvernsjekkliste</h1>
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

            {submitError && (
              <div
                aria-live="polite"
                className="mx-auto max-w-2xl rounded-md bg-red-50 p-4 text-center text-destructive-foreground"
                role="alert"
              >
                {submitError}
              </div>
            )}

            <div className="flex justify-center space-x-4 pb-1">
              <Button
                className="bg-muted text-foreground hover:bg-muted/80 text-lg"
                disabled={isLoading}
                variant="surfaceMuted"
                onClick={resetChecklist}
              >
                Nullstill skjema
              </Button>
              <Button 
                className="text-lg"
                disabled={isLoading}
                onClick={handleRedirectToChat}
              >
                {isLoading ? "Sender..." : "Generer veiledning"}
              </Button>
              <Button 
              className="text-lg"
                disabled={isLoading}
                onClick={downloadAsTextFile}
              >
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
