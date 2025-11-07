import {
  DssProgressBar,
  ContactInfoSection,
  ChecklistForHandlingPersonalDataSection,
  PersonalDataAndDataPrivacySection,
  ImpactAssessmentTemplateSection,
  TypesOfPersonalDataSection,
  DataProtectionRightsSection,
  PrinciplesOfDataProtectionSection,
} from "components/dss";

const Privacy = () => {
  return (
    <div className="flex justify-center mb-4">
      <DssProgressBar />
      <div className="flex-1 space-y-6 max-w-4xl px-6 py-4">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-medium mb-4">
            Informasjon om personvern og dette verktøyet
          </h1>
          <p className="text-muted-foreground tk-readable mx-auto">
            Her kan du finne informasjon om personopplysninger, personvern,
            Trondheim kommune databehandlings prosedyrer, og mer informasjon om
            dette prosjektet.
          </p>
        </div>

        <div className="space-y-6">
          <PersonalDataAndDataPrivacySection />
          <TypesOfPersonalDataSection />
          <DataProtectionRightsSection />
          <ChecklistForHandlingPersonalDataSection />
          <ImpactAssessmentTemplateSection />
          <PrinciplesOfDataProtectionSection />
          <ContactInfoSection />
        </div>
      </div>
    </div>
  );
};

export default Privacy;
