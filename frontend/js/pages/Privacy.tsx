import {
  DssProgressBar,
  PersonalDataSection,
  SensitiveDataSection,
  DataSubjectRightsSection,
  KeyPrinciplesSection,
  ContactInfoSection,
} from "components/dss";

const Privacy = () => {
  return (
    <div className="flex justify-center mb-4">
      <DssProgressBar />
      <div className="flex-1 space-y-6 max-w-4xl px-6 py-4">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-medium mb-4">
            Generell informasjon om personopplysninger
          </h1>
          <p className="text-muted-foreground tk-readable mx-auto">
            Grunnleggende informasjon om personopplysninger og personvern som er
            relevant for alle ansatte i Trondheim Kommune.
          </p>
        </div>

        <div className="space-y-6">
          <PersonalDataSection />
          <SensitiveDataSection />
          <DataSubjectRightsSection />
          <KeyPrinciplesSection />
          <ContactInfoSection />
        </div>
      </div>
    </div>
  );
};

export default Privacy;
