export const PrinciplesOfDataProtectionSection = () => (
  <section className="bg-card border border-border rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
      Grunnleggende personvernprinsipper
    </h2>

    <div className="space-y-4">
      <p>
        Alle virksomheter som behandler personopplysninger må følge de
        grunnleggende prinsippene for personvern. Disse prinsippene sørger for
        at opplysningene behandles lovlig, rettferdig og gjennomsiktig, og at de
        registrertes rettigheter ivaretas.
      </p>

      <ol className="list-decimal pl-5 space-y-1 text-sm">
        <li>Lovlig, rettferdig og gjennomsiktig behandling</li>
        <li>
          Formålsbegrensning – opplysningene brukes kun til angitte formål
        </li>
        <li>Dataminimering – kun nødvendige opplysninger behandles</li>
        <li>Riktighet – opplysningene skal være korrekte og oppdaterte</li>
        <li>
          Lagringsbegrensning – opplysningene lagres ikke lenger enn nødvendig
        </li>
        <li>
          Integritet og konfidensialitet – informasjonen beskyttes mot
          uautorisert tilgang
        </li>
        <li>
          Ansvarlighet – virksomheten kan dokumentere og vise at prinsippene
          følges
        </li>
      </ol>

      <p className="text-sm mt-4">
        <strong>Kilder:</strong>{" "}
        <a
          className="underline text-primary"
          href="https://www.datatilsynet.no/rettigheter-og-plikter/personvernprinsippene/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Personvernprinsippene
        </a>{" "}
        og{" "}
        <a
          className="underline text-primary"
          href="https://www.datatilsynet.no/rettigheter-og-plikter/personvernprinsippene/grunnleggende-personvernprinsipper/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Veiledning om personvernprinsipper
        </a>{" "}
        – Datatilsynet
      </p>
    </div>
  </section>
);
