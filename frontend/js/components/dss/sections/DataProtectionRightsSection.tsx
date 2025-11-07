export const DataProtectionRightsSection = () => (
  <section className="bg-card border border-border rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
      Personopplysninger og den registrertes rettigheter
    </h2>
    <div className="space-y-4">
      <p>
        GDPR og personopplysningsloven fastsetter at du som registrert har en
        rekke rettigheter knyttet til dine personopplysninger, og at
        virksomheter som behandler disse opplysningene må sikre at behandlingen
        skjer lovlig, rettferdig og gjennomsiktig.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div>
              <h3 className="text-lg font-medium">Rett til informasjon</h3>
              <p className="text-sm text-muted-foreground">
                Du har rett til å få vite hvordan dine personopplysninger
                behandles
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div>
              <h3 className="text-lg font-medium">Rett til innsyn</h3>
              <p className="text-sm text-muted-foreground">
                Du har rett til å få kopi av egne personopplysninger
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div>
              <h3 className="text-lg font-medium">Rett til retting</h3>
              <p className="text-sm text-muted-foreground">
                Du har rett til å få rettet feil i personopplysningene
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div>
              <h3 className="text-lg font-medium">Rett til sletting</h3>
              <p className="text-sm text-muted-foreground">
                Du har rett til å få slettet personopplysninger under visse
                vilkår
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div>
              <h3 className="text-lg font-medium">Rett til begrensning</h3>
              <p className="text-sm text-muted-foreground">
                Du har rett til å begrense behandlingen i visse situasjoner
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div>
              <h3 className="text-lg font-medium">Rett til dataportabilitet</h3>
              <p className="text-sm text-muted-foreground">
                Du har rett til å få utlevert data i et strukturert format
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div>
              <h3 className="text-lg font-medium">Rett til motsette seg</h3>
              <p className="text-sm text-muted-foreground">
                Du har rett til å motsette deg behandling basert på berettiget
                interesse
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div>
              <h3 className="text-lg font-medium">
                Rettigheter ved automatiserte avgjørelser
              </h3>
              <p className="text-sm text-muted-foreground">
                Du har rett til beskyttelse mot automatiske beslutninger
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm mt-4">
        Du finner mer informasjon om dine rettigheter her:{" "}
        <a
          className="underline text-primary"
          href="https://www.datatilsynet.no/rettigheter-og-plikter/den-registrertes-rettigheter/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Dine rettigheter
        </a>{" "}
        – Datatilsynet
      </p>
    </div>
  </section>
);
