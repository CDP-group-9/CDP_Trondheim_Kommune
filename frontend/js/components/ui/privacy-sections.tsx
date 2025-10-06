export const PersonalDataSection = () => (
  <section className="bg-card border border-border rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
      🔍 Hva er personopplysninger?
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
      ⚠️ Særlige kategorier personopplysninger
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
      🛡️ De registrertes rettigheter
    </h2>
    <div className="space-y-4">
      <p>
        Personer har flere rettigheter når deres personopplysninger behandles:
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-primary">📋</span>
            <div>
              <h3 className="font-medium">Rett til informasjon</h3>
              <p className="text-sm text-muted-foreground">
                Å få vite hvordan personopplysningene behandles
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-primary">👁️</span>
            <div>
              <h3 className="font-medium">Rett til innsyn</h3>
              <p className="text-sm text-muted-foreground">
                Å få kopi av egne personopplysninger
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-primary">✏️</span>
            <div>
              <h3 className="font-medium">Rett til retting</h3>
              <p className="text-sm text-muted-foreground">
                Å få rettet feil i personopplysningene
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-primary">🗑️</span>
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
            <span className="text-primary">⏸️</span>
            <div>
              <h3 className="font-medium">Rett til begrensning</h3>
              <p className="text-sm text-muted-foreground">
                Å begrense behandlingen i visse situasjoner
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-primary">📤</span>
            <div>
              <h3 className="font-medium">Rett til dataportabilitet</h3>
              <p className="text-sm text-muted-foreground">
                Å få utlevert data i strukturert format
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-primary">🚫</span>
            <div>
              <h3 className="font-medium">Rett til motsette seg</h3>
              <p className="text-sm text-muted-foreground">
                Å motsette seg behandling basert på berettiget interesse
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-primary">🤖</span>
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
      📊 Grunnprinsipper for personvernbehandling
    </h2>
    <div className="space-y-4">
      <p>GDPR bygger på syv grunnprinsipper som alltid må følges:</p>

      <div className="grid gap-3">
        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
          <span className="text-lg">1️⃣</span>
          <div>
            <h3 className="font-medium">Lovlighet, rettferdighet og gjennomsiktig</h3>
            <p className="text-sm text-muted-foreground">
              Behandling må ha rettslig grunnlag og være åpen for den
              registrerte
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
          <span className="text-lg">2️⃣</span>
          <div>
            <h3 className="font-medium">Formålsbegrensning</h3>
            <p className="text-sm text-muted-foreground">
              Data kan kun brukes til spesifikke, uttrykkelige og legitime
              formål
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
          <span className="text-lg">3️⃣</span>
          <div>
            <h3 className="font-medium">Dataminimering</h3>
            <p className="text-sm text-muted-foreground">
              Kun samle og behandle data som er nødvendig for formålet
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
          <span className="text-lg">4️⃣</span>
          <div>
            <h3 className="font-medium">Riktighet</h3>
            <p className="text-sm text-muted-foreground">
              Data må være korrekte og oppdaterte
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
          <span className="text-lg">5️⃣</span>
          <div>
            <h3 className="font-medium">Lagringsbegrensning</h3>
            <p className="text-sm text-muted-foreground">
              Data skal ikke lagres lenger enn nødvendig
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
          <span className="text-lg">6️⃣</span>
          <div>
            <h3 className="font-medium">Integritet og konfidensialitet</h3>
            <p className="text-sm text-muted-foreground">
              Sikre data mot uautorisert tilgang og tap
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
          <span className="text-lg">7️⃣</span>
          <div>
            <h3 className="font-medium">Ansvarlighet</h3>
            <p className="text-sm text-muted-foreground">
              Kunne dokumentere at alle prinsipper følges
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const ContactInfoSection = () => (
  <section className="bg-primary/5 border border-primary/20 rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
      📞 Trenger du mer hjelp?
    </h2>
    <div className="space-y-3">
      <p>
        Hvis du har spørsmål om personopplysninger eller personvern, kan du
        kontakte:
      </p>
      <div className="space-y-2 text-sm">
        <p>
          <strong>Personvernombud Trondheim Kommune</strong>
        </p>
        <p>E-post: personvernombud@trondheim.kommune.no</p>
        <p>Telefon: 73 83 00 00</p>
      </div>
      <p className="text-sm text-muted-foreground">
        Du kan også bruke denne AI-assistenten for å få veiledning om spesifikke
        personvernspørsmål.
      </p>
    </div>
  </section>
);
