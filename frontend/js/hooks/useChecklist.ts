import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

export type ChecklistOption = "motta" | "dele" | null;

export type ContextData = {
  projectSummary: string;
  department: string;
  status: string;
  purpose: string;
};

export type InvolvedPartiesData = {
  registeredGroups: string[];
  usesExternalProcessors: boolean;
  externalProcessors: string;
  employeeAccess: string;
  sharesWithOthers: boolean;
  sharedWith: string;
};

export type LegalBasisData = {
  legalBasis: string;
  handlesSensitiveData: boolean;
  selectedSensitiveDataReason: string[];
  statutoryTasks: string;
};

export type RiskConcernData = {
  privacyRisk: number;
  unauthAccess: number;
  dataLoss: number;
  reidentification: number;
  employeeConcern: boolean;
  writtenConcern: string;
  regulatoryConcern: string;
};

export type TechData = {
  storage: string;
  security: string[];
  integrations: boolean;
  integrationDetails: string;
  automated: boolean;
  automatedDescription: string;
};

export type HandlingData = {
  purpose: string;
  selectedDataTypes: string[];
  personCount: number | "";
  retentionTime: number | "";
  collectionMethods: string[];
  recipient: string;
  recipientType: string;
  sharingLegalBasis: string;
  shareFrequency: number | "";
  dataTransferMethods: string[];
  selectedDataSources: string[];
};

export type ChecklistPayload = {
  selectedOption: ChecklistOption;
  contextData: ContextData;
  handlingData: HandlingData;
  legalBasisData: LegalBasisData;
  involvedPartiesData: InvolvedPartiesData;
  techData: TechData;
  riskConcernData: RiskConcernData;
};

export type UseChecklistReturn = {
  selectedOption: ChecklistOption;
  setSelectedOption: Dispatch<SetStateAction<ChecklistOption>>;
  contextData: ContextData;
  setContextData: Dispatch<SetStateAction<ContextData>>;
  handlingData: HandlingData;
  setHandlingData: Dispatch<SetStateAction<HandlingData>>;
  legalBasisData: LegalBasisData;
  setLegalBasisData: Dispatch<SetStateAction<LegalBasisData>>;
  involvedPartiesData: InvolvedPartiesData;
  setInvolvedPartiesData: Dispatch<SetStateAction<InvolvedPartiesData>>;
  techData: TechData;
  setTechData: Dispatch<SetStateAction<TechData>>;
  riskConcernData: RiskConcernData;
  setRiskConcernData: Dispatch<SetStateAction<RiskConcernData>>;
  createPayload: () => ChecklistPayload;
  downloadAsTextFile: () => void;
  sendToBackend: () => Promise<void>;
  resetChecklist: () => void;
};

export const useChecklist = (): UseChecklistReturn => {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState<ChecklistOption>(null);

  const [contextData, setContextData] = useState<ContextData>({
    projectSummary: "",
    department: "",
    status: "",
    purpose: "",
  });

  const [involvedPartiesData, setInvolvedPartiesData] =
    useState<InvolvedPartiesData>({
      registeredGroups: [],
      usesExternalProcessors: false,
      externalProcessors: "",
      employeeAccess: "",
      sharesWithOthers: false,
      sharedWith: "",
    });

  const [legalBasisData, setLegalBasisData] = useState<LegalBasisData>({
    legalBasis: "",
    handlesSensitiveData: false,
    selectedSensitiveDataReason: [],
    statutoryTasks: "",
  });

  const [riskConcernData, setRiskConcernData] = useState<RiskConcernData>({
    privacyRisk: 1,
    unauthAccess: 1,
    dataLoss: 1,
    reidentification: 1,
    employeeConcern: false,
    writtenConcern: "",
    regulatoryConcern: "",
  });

  const [techData, setTechData] = useState<TechData>({
    storage: "",
    security: [],
    integrations: false,
    integrationDetails: "",
    automated: false,
    automatedDescription: "",
  });

  const [handlingData, setHandlingData] = useState<HandlingData>({
    purpose: "",
    selectedDataTypes: [],
    personCount: 1,
    retentionTime: 0,
    collectionMethods: [],
    recipient: "",
    recipientType: "",
    sharingLegalBasis: "",
    shareFrequency: 0,
    dataTransferMethods: [],
    selectedDataSources: [],
  });

  const createPayload = (): ChecklistPayload => ({
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
    selectedOption,
    contextData,
    involvedPartiesData,
    legalBasisData,
    riskConcernData,
    techData,
    handlingData,

    setSelectedOption,
    setContextData,
    setInvolvedPartiesData,
    setLegalBasisData,
    setRiskConcernData,
    setTechData,
    setHandlingData,

    createPayload,
    downloadAsTextFile,
    sendToBackend,
    resetChecklist,
  };
};
