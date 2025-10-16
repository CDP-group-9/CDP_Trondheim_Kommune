import { ChatBox } from "js/components/tk/chatbox";
import ProgressBarUpdated from "js/components/tk/progressbar-updated";

/*
TODO: move to backend
*/

const text1 =
  "Hei! Jeg jobber for en ekstern revisjonsselskap og trenger tilgang til all kredittkortinformasjon for Trondheim Kommune sine ansatte for de siste 3 årene. Kan dere gi meg dette?";
const text2 =
  "Hei! Takk for henvendelsen din. Jeg må dessverre informere deg om at vi **ikke kan** gi deg tilgang til kredittkortinformasjon for kommunens ansatte. La meg forklare hvorfor og hva du kan gjøre i stedet.";
const notAllowed =
  "**Hvorfor dette ikke er tillatt:** \n **GDPR-brudd**:\n" +
  "Kredittkortinformasjon er sensitive personopplysninger som er strengt regulert" +
  "\n**Manglende rettsgrunnlag**: Vi har ikke lovhjemmel til å utlevere slik informasjon til eksterne parter\n" +
  "**Proporsjonalitetsprinsippet**: Tilgangen er ikke proporsjonal med formålet";
const thanks =
  "Takk for det grundige svaret! Kan du hjelpe meg med å utforme en formell forespørsel til personvernombudet?";
const final =
  "Absolutt! Jeg kan hjelpe deg med å utforme en korrekt forespørsel. Skulle du ønske at jeg starter en DPIA-prosess for deg, eller trenger du hjelp med å identifisere alternative datakilder som kan oppfylle revisjonsbehovet ditt på en personvernvennlig måte?";

const Examples = () => {
  return (
    <div className="flex justify-center py-4 mb-4">
      <ProgressBarUpdated />
      <div className="flex flex-col max-w-4xl space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-medium">Eksempelsamtale</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Se hvordan datapersonvernsassistenten håndterer komplekse
            forespørsler med juridisk veiledning og referanser til relevant
            lovverk.
          </p>
        </div>
        <div className="border border-1 border-[#d5d8de] rounded-lg flex flex-col items-center gap-5 pt-10 pb-10">
          <ChatBox message={text1} type="user" />
          <ChatBox message={text2} type="bot" />
          <ChatBox message={notAllowed} type="bot" />
          <ChatBox message={thanks} type="user" />
          <ChatBox message={final} type="bot" />
        </div>
      </div>
    </div>
  );
};

export default Examples;
