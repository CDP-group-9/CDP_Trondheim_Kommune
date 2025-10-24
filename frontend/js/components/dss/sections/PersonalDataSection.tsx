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
