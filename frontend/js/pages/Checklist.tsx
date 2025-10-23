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
    projectSummary: "ikke oppgitt",
    department: "ikke oppgitt",
    status: "ikke oppgitt",
    purpose: "ikke oppgitt",
  });
  const [involvedPartiesData, setInvolvedPartiesData] = useState({
    registeredGroups: [] as string[],
    usesExternalProcessors: false,
    externalProcessors: "ikke oppgitt",
    employeeAccess: "ikke oppgitt",
    sharesWithOthers: false,
    sharedWith: "ikke oppgitt",
  });
  const [legalBasisData, setLegalBasisData] = useState({
    legalBasis: "ikke oppgitt",
    handlesSensitiveData: false,
    selectedSensitiveDataReason: [] as string[],
    statutoryTasks: "ikke oppgitt",
  });
  const [riskConcernData, setRiskConcernData] = useState({
    privacyRisk: 1,
    unauthAccess: 1,
    dataLoss: 1,
    reidentification: 1,
    employeeConcern: false,
    writtenConcern: "ikke oppgitt",
    regulatoryConcern: "ikke oppgitt",
  });
  const [techData, setTechData] = useState({
    storage: "ikke oppgitt",
    security: [] as string[],
    integrations: false,
    integrationDetails: "ikke oppgitt",
    automated: false,
    automatedDescription: "ikke oppgitt",
  });
  const [handlingData, setHandlingData] = useState({
    purpose: "ikke oppgitt",
    selectedDataTypes: [] as string[],
    personCount: 1,
    retentionTime: 0,
    collectionMethods: [] as string[],
    recipient: "ikke oppgitt",
    recipientType: "ikke oppgitt",
    sharingLegalBasis: "ikke oppgitt",
    shareFrequency: 0,
    dataTransferMethods: [] as string[],
    selectedDataSources: [] as string[],
  });

  const navigate = useNavigate();

  const createPayload = () => {
    return {
      selectedOption,
      contextData,
      handlingData,
      legalBasisData,
      involvedPartiesData,
      techData,
      riskConcernData,
    };
  };

  const downloadAsTextFile = () => {
    const payload = createPayload();

    // Format the payload as readable text
    const formatPayload = (data: any, indent = 0): string => {
      const spaces = "  ".repeat(indent);
      let result = "";

      for (const [key, value] of Object.entries(data)) {
        if (value === null || value === undefined) {
          // skip null or undefined values
        } else {
          const formattedKey = key.replace(/([A-Z])/g, " $1").toLowerCase().replace(/^./, str => str.toUpperCase());

          if (Array.isArray(value)) {
            if (value.length > 0) {
              result += `${spaces}${formattedKey}:\n`;
              for (const item of value) {
                result += `${spaces}  - ${item}\n`;
              }
            }
          } else if (typeof value === "object") {
            result += `${spaces}${formattedKey}:\n`;
            result += formatPayload(value, indent + 1);
          } else if (value !== "" && value !== 0 && value !== false) {
            result += `${spaces}${formattedKey}: ${value}\n`;
          }
        }
      }

      return result;
    };

    const textContent = `PERSONVERNSJEKKLISTE - EKSPORT
Generert: ${new Date().toLocaleString("nb-NO")}

==================================================

${formatPayload(payload)}

==================================================
Eksportert fra Trondheim Kommune - Personvern AI-assistent
`;

    // Create and download the file
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    link.download = `personvernsjekkliste_${timestamp}.txt`;
    link.href = url;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  const sendToBackend = async () => {
    const payload = createPayload();

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
              <Button className="cursor-pointer" onClick={downloadAsTextFile}>
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
