import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const [contextData, setContextData] = useState({
    projectSummary: "",
    department: "",
    status: "",
    purpose: "",
  });
  const [involvedPartiesData, setInvolvedPartiesData] = useState({
    registeredGroups: [] as string[],
    usesExternalProcessors: false,
    externalProcessors: "",
    employeeAccess: "",
    sharesWithOthers: false,
    sharedWith: "",
  });
  const [legalBasisData, setLegalBasisData] = useState({
    legalBasis: "",
    handlesSensitiveData: false,
    selectedSensitiveDataReason: [] as string[],
    statutoryTasks: "",
  });
  const [riskConcernData, setRiskConcernData] = useState({
    privacyRisk: 1,
    unauthAccess: 1,
    dataLoss: 1,
    reidentification: 1,
    employeeConcern: false,
    writtenConcern: "",
    regulatoryConcern: "",
  });
  const [techData, setTechData] = useState({
    storage: "",
    security: [] as string[],
    integrations: false,
    integrationDetails: "",
    automated: false,
    automatedDescription: "",
  });
  const [handlingData, setHandlingData] = useState({
    purpose: "",
    selectedDataTypes: [] as string[],
    personCount: 1,
    retentionTime: 0,
    collectionMethods: [] as string[],
    recipient: "",
    recipientType: "",
    sharingLegalBasis: "",
    shareFrequency: 0,
    dataTransferMethods: [] as string[],
    selectedDataSources: [] as string[],
  });

  const navigate = useNavigate();

  const sendToBackend = async () => {
    const payload = {
      selectedOption,
      contextData,
      handlingData,
      legalBasisData,
      involvedPartiesData,
      techData,
      riskConcernData,
    };

    function getCookie(name: string) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()!.split(";").shift();
      return "";
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/checklist/json_to_string/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFTOKEN": getCookie("csrftoken") || "",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      const data: { response?: string; error?: string } = await response.json();
      const contextString = data.response;
      console.log(contextString);
      localStorage.setItem("checklistContext", contextString || "");
      localStorage.setItem("shouldSendChecklistContext", "true");
      navigate("/");
      if (!response.ok) console.error(data.error || "Unknown error");
    } catch {
      console.error("No connection to server.");
    }
  };

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
            <div className="flex justify-center">
              <p className="text-center text-muted-foreground tk-readable mx-auto">
                Fyll ut informasjonen nedenfor for å gi AI-assistenten best
                mulig grunnlag for å hjelpe deg med personvernvurdering, DPIA og
                juridisk veiledning.
              </p>
            </div>
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
                className="bg-gray-200 text-gray-900 hover:bg-gray-300 cursor-pointer"
                onClick={() => window.location.reload()}
              >
                Nullstill skjema
              </Button>
              <Button className="cursor-pointer" onClick={sendToBackend}>
                Generer veiledning
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checklist;
