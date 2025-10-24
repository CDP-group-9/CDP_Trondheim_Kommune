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
