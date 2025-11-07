export const TypesOfPersonalDataSection = () => (
  <section className="bg-card border border-border rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
      Typer personopplysninger:
    </h2>
    <div className="space-y-4">
      <p>
        Her finner du eksempler på både direkte og indirekte personopplysninger,
        samt det som regnes som sensitive personopplysninger. Sensitive
        personopplysninger krever særbehandling.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">
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
          <h3 className="text-lg font-medium mb-4">
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
    <br />
    <div className="space-y-4">
      <p>
        Sensitive personopplysninger har ekstra streng beskyttelse og krever
        spesielt rettslig grunnlag for behandling:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Rase eller etnisk opprinnelse</li>
        <li>Politiske meninger</li>
        <li>Religiøse eller filosofiske oppfatninger</li>
        <li>Fagforeningsmedlemskap</li>
        <li>Helseopplysninger</li>
        <li>Seksuelle forhold og legning</li>
        <li>Genetiske og biometriske data</li>
      </ul>
    </div>
    <p className="text-sm mt-4">
      Du finner mer informasjon om hva en personopplsning er her:{" "}
      <a
        className="underline text-primary"
        href="https://www.datatilsynet.no/rettigheter-og-plikter/personopplysninger/"
        rel="noopener noreferrer"
        target="_blank"
      >
        Hva er en personopplysning?
      </a>{" "}
      – Datatilsynet
    </p>
  </section>
);
