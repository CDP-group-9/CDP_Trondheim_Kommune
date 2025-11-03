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
