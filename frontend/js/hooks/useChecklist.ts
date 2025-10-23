import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useChecklist = () => {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState<"motta" | "dele" | null>(
    null,
  );

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

  // --- Derived / Utility Functions ---

  const createPayload = () => ({
    selectedOption,
    contextData,
    handlingData,
    legalBasisData,
    involvedPartiesData,
    techData,
    riskConcernData,
  });

  const downloadAsTextFile = () => {
    const payload = createPayload();

    const formatPayload = (data: any, indent = 0): string => {
      const spaces = "  ".repeat(indent);
      let result = "";

      for (const [key, value] of Object.entries(data)) {
        if (value === null || value === undefined) {
          // skip null/undefined values
        } else {
          const formattedKey = key
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()
            .replace(/^./, (str) => str.toUpperCase());

          if (Array.isArray(value) && value.length > 0) {
            result += `${spaces}${formattedKey}:\n`;
            for (const item of value) {
              result += `${spaces}  - ${item}\n`;
            }
          } else if (typeof value === "object") {
            result += `${spaces}${formattedKey}:\n${formatPayload(value, indent + 1)}`;
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

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");

    link.download = `personvernsjekkliste_${timestamp}.txt`;
    link.href = url;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      localStorage.setItem("checklistContext", contextString || "");
      localStorage.setItem("shouldSendChecklistContext", "true");
      navigate("/");

      if (!response.ok) console.error(data.error || "Unknown error");
    } catch {
      console.error("No connection to server.");
    }
  };

  const resetChecklist = () => window.location.reload();

  return {
    // state
    selectedOption,
    contextData,
    involvedPartiesData,
    legalBasisData,
    riskConcernData,
    techData,
    handlingData,

    // setters
    setSelectedOption,
    setContextData,
    setInvolvedPartiesData,
    setLegalBasisData,
    setRiskConcernData,
    setTechData,
    setHandlingData,

    // actions
    createPayload,
    downloadAsTextFile,
    sendToBackend,
    resetChecklist,
  };
};
