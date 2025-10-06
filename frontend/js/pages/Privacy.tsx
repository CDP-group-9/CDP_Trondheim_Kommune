import {
  PersonalDataSection,
  SensitiveDataSection,
  LegalBasisSection,
  DataSubjectRightsSection,
  KeyPrinciplesSection,
  ContactInfoSection,
} from "../components/ui/privacy-sections";

const Privacy = () => {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-medium mb-4">
            Generell informasjon om personopplysninger
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Grunnleggende informasjon om personopplysninger og personvern som er
            relevant for alle ansatte i Trondheim Kommune.
          </p>
        </header>

        <div className="space-y-8">
          <PersonalDataSection />
          <SensitiveDataSection />
          <LegalBasisSection />
          <DataSubjectRightsSection />
          <KeyPrinciplesSection />
          <ContactInfoSection />
        </div>
      </div>
    </div>
  );
};

export default Privacy;
