import { ExternalLink } from "lucide-react";

import { Button } from "./button";

export const PersonalDataSection = () => (
  <section className="bg-card border border-border rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
      <span aria-label="Magnifying glass" role="img">
        🔍
      </span>{" "}
      Hva er personopplysninger?
    </h2>
    <div className="space-y-4">
      <p>
        Personopplysninger er all informasjon som kan knyttes til en
        identifiserbar person, enten direkte eller indirekte.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-2">
            Direkte identifiserbare opplysninger:
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Navn og personnummer</li>
            <li>Adresse og telefonnummer</li>
            <li>E-postadresse</li>
            <li>Bilder og videoer av personer</li>
            <li>Biometrisk data som fingeravtrykk eller irismønster</li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-2">
            Indirekte identifiserbare opplysninger:
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>IP-adresser og enhets-ID</li>
            <li>Kombinasjon av alder, yrke og bosted</li>
            <li>Unike identifikatorer i systemer</li>
            <li>GPS-koordinater og sporing</li>
            <li>Cookies og nettsporing</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export const SensitiveDataSection = () => (
  <section className="bg-card border border-border rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
      <span aria-label="Warning triangle" role="img">
        ⚠️
      </span>{" "}
      Særlige kategorier personopplysninger
    </h2>
    <div className="space-y-4">
      <p>
        Disse opplysningene har ekstra streng beskyttelse og krever spesielt
        rettslig grunnlag for behandling:
      </p>

      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Rase eller etnisk opprinnelse</strong>
          </li>
          <li>
            <strong>Politiske meninger</strong>
          </li>
          <li>
            <strong>Religiøse eller filosofiske oppfatninger</strong>
          </li>
          <li>
            <strong>Fagforeningsmedlemskap</strong>
          </li>
          <li>
            <strong>Helseopplysninger</strong>
          </li>
          <li>
            <strong>Seksuelle forhold og legning</strong>
          </li>
          <li>
            <strong>Genetiske og biometriske data</strong>
          </li>
        </ul>
      </div>
    </div>
  </section>
);

export const DataSubjectRightsSection = () => (
  <section className="bg-card border border-border rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
      <span aria-label="Shield" role="img">
        🛡️
      </span>{" "}
      De registrertes rettigheter
    </h2>
    <div className="space-y-4">
      <p>
        Personer har flere rettigheter når deres personopplysninger behandles:
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span aria-label="Clipboard" className="text-primary" role="img">
              📋
            </span>
            <div>
              <h3 className="font-medium">Rett til informasjon</h3>
              <p className="text-sm text-muted-foreground">
                Å få vite hvordan personopplysningene behandles
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span aria-label="Eye" className="text-primary" role="img">
              👁️
            </span>
            <div>
              <h3 className="font-medium">Rett til innsyn</h3>
              <p className="text-sm text-muted-foreground">
                Å få kopi av egne personopplysninger
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span aria-label="Pencil" className="text-primary" role="img">
              ✏️
            </span>
            <div>
              <h3 className="font-medium">Rett til retting</h3>
              <p className="text-sm text-muted-foreground">
                Å få rettet feil i personopplysningene
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span aria-label="Trash bin" className="text-primary" role="img">
              🗑️
            </span>
            <div>
              <h3 className="font-medium">Rett til sletting</h3>
              <p className="text-sm text-muted-foreground">
                Å få slettet personopplysninger under visse vilkår
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span aria-label="Pause symbol" className="text-primary" role="img">
              ⏸️
            </span>
            <div>
              <h3 className="font-medium">Rett til begrensning</h3>
              <p className="text-sm text-muted-foreground">
                Å begrense behandlingen i visse situasjoner
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span
              aria-label="Upload symbol"
              className="text-primary"
              role="img"
            >
              📤
            </span>
            <div>
              <h3 className="font-medium">Rett til dataportabilitet</h3>
              <p className="text-sm text-muted-foreground">
                Å få utlevert data i strukturert format
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span
              aria-label="Prohibited symbol"
              className="text-primary"
              role="img"
            >
              🚫
            </span>
            <div>
              <h3 className="font-medium">Rett til motsette seg</h3>
              <p className="text-sm text-muted-foreground">
                Å motsette seg behandling basert på berettiget interesse
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span aria-label="Robot" className="text-primary" role="img">
              🤖
            </span>
            <div>
              <h3 className="font-medium">
                Rettigheter ved automatiserte avgjørelser
              </h3>
              <p className="text-sm text-muted-foreground">
                Beskyttelse mot automatiske beslutninger
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const KeyPrinciplesSection = () => (
  <section className="bg-card border border-border rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
      <span aria-label="Bar chart" role="img">
        📊
      </span>{" "}
      Grunnprinsipper for personvernbehandling
    </h2>
    <div className="space-y-4">
      <p>GDPR bygger på syv grunnprinsipper som alltid må følges:</p>

      <div className="grid gap-3">
        {[
          "Lovlighet, rettferdighet og gjennomsiktig",
          "Formålsbegrensning",
          "Dataminimering",
          "Riktighet",
          "Lagringsbegrensning",
          "Integritet og konfidensialitet",
          "Ansvarlighet",
        ].map((title, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
          >
            <span
              aria-label={`Principle ${index + 1}`}
              className="text-lg"
              role="img"
            >
              {`${index + 1}️⃣`}
            </span>
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">
                {/* Add real descriptions if needed here */}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const ContactInfoSection = () => (
  <section className="bg-primary/5 border border-primary/20 rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
      <span aria-label="Phone" role="img">
        📞
      </span>{" "}
      Trenger du mer hjelp?
    </h2>
    <div className="space-y-3">
      <p>
        Du kan også bruke denne AI-assistenten for å få veiledning om spesifikke
        personvernspørsmål eller ta kontakt med personvernombudet i Trondheim
        kommune.
      </p>
      <div className="space-y-2 text-sm">
        <p>
          <strong>Personvernombud Trondheim Kommune</strong>
        </p>
        <p>E-post: personvernombud@trondheim.kommune.no</p>
        <p>Telefon: 73 83 00 00</p>
        <div className="flex items-center">
          <p>Lov om personvern</p>
          <a
            href="https://lovdata.no/dokument/NL/lov/2018-06-15-38"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button className="h-auto p-1" size="sm" variant="ghost">
              <ExternalLink size={14} />
            </Button>
          </a>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Du kan også bruke denne AI-assistenten for å få veiledning om spesifikke
        personvernspørsmål.
      </p>
    </div>
  </section>
);
