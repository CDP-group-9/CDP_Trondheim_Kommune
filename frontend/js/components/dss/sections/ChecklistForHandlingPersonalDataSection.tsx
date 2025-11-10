export const ChecklistForHandlingPersonalDataSection = () => (
  <section className="bg-card border border-border rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
      Sjekkliste for behandling av persondata
    </h2>

    <div className="space-y-4">
      <p>
        Virksomheter som behandler personopplysninger må følge reglene i
        personvernforordningen (GDPR) og personopplysningsloven. Her finner du
        en oppsummert sjekkliste over tiltak en virksomhet må ha på plass før og
        under behandling av personopplysninger. Disse er hentet fra Datatilsynet
        og er lenket nederst for videre opplysning
      </p>

      <ol className="list-decimal pl-5 space-y-1 text-sm">
        <li>Sett dere inn i personvernprinsippene og de juridiske kravene.</li>
        <li>
          Kartlegg hvilke typer personopplysninger virksomheten behandler
          (ansatte, kunder, brukere m.m.).
        </li>
        <li>
          Definer formålet med behandlingen og sørg for at opplysningene kun
          brukes til dette formålet.
        </li>
        <li>
          Identifiser behandlingsgrunnlaget (samtykke, kontrakt, rettslig
          forpliktelse osv.).
        </li>
        <li>
          Hvis dere behandler «særlige kategorier» (for eksempel helse- eller
          biometriske data), må dere følge kravene i artikkel 9.
        </li>
        <li>
          Ha rutiner for å informere de registrerte om hvordan opplysningene
          brukes.
        </li>
        <li>
          Legg til rette for at personer kan utøve sine rettigheter (innsyn,
          retting, sletting, begrensning osv.).
        </li>
        <li>
          Implementer personvern som standard og innebygd i løsninger og
          prosesser.
        </li>
        <li>
          Inngå databehandleravtaler med leverandører som behandler
          personopplysninger på deres vegne.
        </li>
        <li>
          Vær oppmerksom på regler ved overføring av personopplysninger utenfor
          EØS.
        </li>
        <li>
          Vurder behovet for en vurdering av personvernkonsekvenser (DPIA).
        </li>
        <li>
          Etabler internkontroll og informasjonssikkerhet: rutiner,
          dokumentasjon, risikovurderinger og håndtering av avvik.
        </li>
        <li>
          Før protokoll over behandlingsaktiviteter – hvem gjør hva, med hvilke
          opplysninger og hvorfor.
        </li>
      </ol>

      <p className="text-sm mt-4">
        <strong>Kilde:</strong> Datatilsynet –{" "}
        <a
          className="underline text-primary"
          href="https://www.datatilsynet.no/rettigheter-og-plikter/virksomhetenes-plikter/sjekkliste/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Sjekkliste for virksomhetenes plikter
        </a>{" "}
      </p>
    </div>
  </section>
);
