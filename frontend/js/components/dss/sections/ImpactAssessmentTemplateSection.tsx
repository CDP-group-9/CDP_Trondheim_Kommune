export const ImpactAssessmentTemplateSection = () => (
  <section className="bg-card border border-border rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
      Data Protection Impact Assessment (DPIA)
    </h2>

    <div className="space-y-4">
      <p>
        En personvernkonsekvensvurdering også kjent som en Data Protection
        Impact Assessment (DPIA) er en systematisk vurdering av hvordan en
        planlagt behandling av personopplysninger kan påvirke personers
        rettigheter og friheter, og hvilke tiltak som kan og eventuelt må
        iverksettes for å redusere risiko.
      </p>

      <h3 className="text-xl font-medium mb-4 ">Når er den nødvendig?</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>
          Når behandling «sannsynligvis gir høy risiko» for registrertes
          rettigheter og friheter.
        </li>
        <li>
          Eksempler: behandling av sensitive eller «særlige» kategorier
          personopplysninger, omfattende systematisk overvåking, behandling i
          stor skala.
        </li>
        <li>
          Hvis virksomheten bruker ny teknologi eller behandler data om sårbare
          grupper.
        </li>
      </ul>

      <h3 className="text-xl font-medium mb-4 ">Hovedtrinnene for en DPIA</h3>
      <ol className="list-decimal pl-5 space-y-1 text-sm">
        <li>
          Kartlegg og beskriv den planlagte behandlingen og formålet med den.
        </li>
        <li>
          Vurder risikoene – hvilke rettigheter og friheter kan bli påvirket, og
          hvor stor er risikoen?
        </li>
        <li>
          Identifiser og vurder tiltak for å redusere, unngå eller kontrollere
          risiko.
        </li>
        <li>
          Dokumenter vurderingen og resultatet, og involver relevante roller
          (f.eks. personvernombud).
        </li>
        <li>
          Beslutning: Ledelsen vurderer om risikoen er akseptabel, og eventuelt
          må saken sendes til Datatilsynet for forhåndsdrøfting før
          igangsetting.
        </li>
        <li>
          Følg opp: Sikre at tiltak blir implementert, og revurder ved endringer
          i behandlingen.
        </li>
      </ol>

      <p className="text-sm mt-4">
        Her finner du et dokument og mal med utfylende informasjon fra
        Helsedirektoratet:{" "}
        <a
          className="underline text-primary"
          href="https://www.helsedirektoratet.no/veiledere/personvernkonsekvensvurdering-dpia-mal/last-ned-mal-og-veiledning/_/attachment/inline/b5db3eff-5318-44e1-b790-5a83dbd4b0c9:1dbbab78b2b7347f35b167d80256fd839d692a9a/Veileder%20for%20utfylling%20av%20mal%20for%20personvernkonsekvensvurdering.pdf"
          rel="noopener noreferrer"
          target="_blank"
        >
          Veileder for utfylling av mal for personvernkonsekvensvurdering (DPIA)
        </a>
      </p>
    </div>
  </section>
);
