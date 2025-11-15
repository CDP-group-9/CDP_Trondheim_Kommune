export const PersonalDataAndDataPrivacySection = () => (
  <section className="bg-card border border-border rounded-lg p-6">
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <h2 className="text-xl font-medium mb-4">
          Hva er en personopplysning?
        </h2>
        <p className="text-sm">
          En personopplysning er enhver opplysning som kan knyttes til en
          identifiserbar person – enten direkte eller indirekte. Det kan være
          navn, fødselsnummer, kontaktinformasjon, bilder eller andre
          opplysninger som gjør det mulig å kjenne igjen en person. Det er mer
          utfyllende informasjon om typer personopplysninger nedenfor.
        </p>
        <p className="text-sm">
          Formelt er dette definert i{" "}
          <a
            className="underline text-primary"
            href="https://lovdata.no/lov/2018-06-15-38/gdpr/a4"
            rel="noopener noreferrer"
            target="_blank"
          >
            personopplysningsloven kapittel 1 artikkel 4 - definisjoner
          </a>
          .
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-medium mb-4">Hva betyr personvern?</h3>
        <p className="text-sm">
          Personvern handler om retten til å ha kontroll over egne opplysninger
          og trygghet for at de behandles på en rettferdig, åpen og sikker måte.
          Det innebærer at virksomheter må beskytte informasjon mot misbruk og
          respektere den enkeltes rettigheter.
        </p>
        <p className="text-sm">
          Loven skal sikre at personopplysninger behandles i tråd med
          grunnleggende prinsipper om verdighet, frihet og privatliv. Mer
          informasjon om personvern finner du hos{" "}
          <a
            className="underline text-primary"
            href="https://www.datatilsynet.no/rettigheter-og-plikter/hva-er-personvern/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Datatilsynet
          </a>
          {", "}
          og mindre formelt i{" "}
          <a
            className="underline text-primary"
            href="https://snl.no/personopplysningsloven"
            rel="noopener noreferrer"
            target="_blank"
          >
            Store norske leksikon
          </a>
          .
        </p>
      </div>
    </div>
  </section>
);
