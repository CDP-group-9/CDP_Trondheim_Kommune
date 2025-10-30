import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

import { useAppState } from "../contexts/AppStateContext";

import { useCookie } from "./useCookie";

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

const DEFAULT_CONTEXT_DATA: ContextData = {
  projectSummary: "",
  department: "",
  status: "",
  purpose: "",
};

const DEFAULT_HANDLING_DATA: HandlingData = {
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
};

const DEFAULT_LEGAL_BASIS_DATA: LegalBasisData = {
  legalBasis: "",
  handlesSensitiveData: false,
  selectedSensitiveDataReason: [],
  statutoryTasks: "",
};

const DEFAULT_INVOLVED_PARTIES_DATA: InvolvedPartiesData = {
  registeredGroups: [],
  usesExternalProcessors: false,
  externalProcessors: "",
  employeeAccess: "",
  sharesWithOthers: false,
  sharedWith: "",
};

const DEFAULT_TECH_DATA: TechData = {
  storage: "",
  security: [],
  integrations: false,
  integrationDetails: "",
  automated: false,
  automatedDescription: "",
};

const DEFAULT_RISK_CONCERN_DATA: RiskConcernData = {
  privacyRisk: 1,
  unauthAccess: 1,
  dataLoss: 1,
  reidentification: 1,
  employeeConcern: false,
  writtenConcern: "",
  regulatoryConcern: "",
};

export const useChecklist = (): UseChecklistReturn => {
  const navigate = useNavigate();
  const {
    currentChecklistId,
    saveCurrentChecklist,
    createNewChecklist,
    getCurrentChecklistData,
    createChatFromChecklist,
  } = useAppState();

  const csrftoken = useCookie("csrftoken");

  const [selectedOption, setSelectedOption] = useState<ChecklistOption>(null);
  const [contextData, setContextData] =
    useState<ContextData>(DEFAULT_CONTEXT_DATA);
  const [involvedPartiesData, setInvolvedPartiesData] =
    useState<InvolvedPartiesData>(DEFAULT_INVOLVED_PARTIES_DATA);
  const [legalBasisData, setLegalBasisData] = useState<LegalBasisData>(
    DEFAULT_LEGAL_BASIS_DATA,
  );
  const [riskConcernData, setRiskConcernData] = useState<RiskConcernData>(
    DEFAULT_RISK_CONCERN_DATA,
  );
  const [techData, setTechData] = useState<TechData>(DEFAULT_TECH_DATA);
  const [handlingData, setHandlingData] = useState<HandlingData>(
    DEFAULT_HANDLING_DATA,
  );

  useEffect(() => {
    if (!currentChecklistId) {
      createNewChecklist();
      return;
    }

    const loadData = async () => {
      const savedData = await getCurrentChecklistData();
      if (savedData) {
        setSelectedOption(savedData.selectedOption || null);
        setContextData(savedData.contextData || DEFAULT_CONTEXT_DATA);
        setHandlingData(savedData.handlingData || DEFAULT_HANDLING_DATA);
        setLegalBasisData(savedData.legalBasisData || DEFAULT_LEGAL_BASIS_DATA);
        setInvolvedPartiesData(
          savedData.involvedPartiesData || DEFAULT_INVOLVED_PARTIES_DATA,
        );
        setTechData(savedData.techData || DEFAULT_TECH_DATA);
        setRiskConcernData(
          savedData.riskConcernData || DEFAULT_RISK_CONCERN_DATA,
        );
      }
    };

    loadData();
  }, [currentChecklistId, createNewChecklist, getCurrentChecklistData]);

  useEffect(() => {
    if (currentChecklistId && selectedOption) {
      const payload = createPayload();
      const title = contextData.projectSummary
        ? contextData.projectSummary.slice(0, 50) +
          (contextData.projectSummary.length > 50 ? "..." : "")
        : "Ny sjekkliste";

      const timeoutId = setTimeout(() => {
        saveCurrentChecklist(payload, title);
      }, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
    return undefined;
  }, [
    selectedOption,
    contextData,
    handlingData,
    legalBasisData,
    involvedPartiesData,
    techData,
    riskConcernData,
    currentChecklistId,
  ]);

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
        if (value !== null && value !== undefined) {
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

    try {
      const response = await fetch(
        "http://localhost:8000/api/checklist/json_to_string/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFTOKEN": csrftoken || "",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      const data: { response?: string; error?: string } = await response.json();
      const contextString = data.response;

      await createChatFromChecklist();

      localStorage.setItem("checklistContext", contextString || "");
      localStorage.setItem("shouldSendChecklistContext", "true");

      createNewChecklist();

      navigate("/");

      if (!response.ok) console.error(data.error || "Unknown error");
    } catch {
      console.error("No connection to server.");
    }
  };

  const resetChecklist = () => {
    createNewChecklist();
    setSelectedOption(null);
    setContextData(DEFAULT_CONTEXT_DATA);
    setHandlingData(DEFAULT_HANDLING_DATA);
    setLegalBasisData(DEFAULT_LEGAL_BASIS_DATA);
    setInvolvedPartiesData(DEFAULT_INVOLVED_PARTIES_DATA);
    setTechData(DEFAULT_TECH_DATA);
    setRiskConcernData(DEFAULT_RISK_CONCERN_DATA);
  };

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
