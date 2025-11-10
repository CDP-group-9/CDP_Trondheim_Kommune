import { SquareArrowOutUpRight } from "lucide-react";

export const ContactInfoSection = () => (
  <section className="bg-primary/5 border border-primary/20 rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
      <span aria-label="Phone" role="img">
        📞
      </span>{" "}
      Har du andre spørsmål?
    </h2>
    <div className="space-y-3">
      <p className="tk-readable">
        Du kan også bruke denne AI-assistenten for å få veiledning om spesifikke
        personvernspørsmål eller ta kontakt med personvernombudet i Trondheim
        kommune.
      </p>
      <div className="space-y-2 text-sm">
        <p>
          <strong>Personvernombud Trondheim Kommune</strong>
        </p>
        <div className="flex items-center gap-1">
          <p>E-post: </p>
          <a
            aria-label="Send e-post til personvernombud@trondheim.kommune.no"
            className="text-base font-medium text-primary hover:underline inline-flex items-center gap-1 whitespace-nowrap"
            href="mailto:personvernombud@trondheim.kommune.no"
          >
            personvernombud@trondheim.kommune.no
          </a>
        </div>
        <div className="flex items-center gap-1">
          <p>Telefon:</p>
          <a
            aria-label="Ring 72 54 00 00"
            className="text-base font-medium text-primary hover:underline inline-flex items-center gap-1 whitespace-nowrap"
            href="tel:+4772540000"
          >
            72 54 00 00
          </a>
        </div>
        <div className="flex items-center">
          <a
            aria-label="Les mer om personvernlovigning på Lovdata sine nettsider, åpner i ny fane"
            className="text-base font-medium text-primary hover:underline inline-flex items-center gap-1 whitespace-nowrap"
            href="https://lovdata.no/dokument/NL/lov/2018-06-15-38"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lov om personvern{" "}
            <SquareArrowOutUpRight
              aria-hidden="true"
              className="mt-0.5 size-3.5"
            />
          </a>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Du kan også bruke denne AI-assistenten for å få veiledning om spesifikke
        personvernspørsmål.
      </p>
    </div>
  </section>
);
