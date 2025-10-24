import {Button} from "components/ui/button";
import {ExternalLink} from "lucide-react";

export const ContactInfoSection = () => (
  <section className="bg-primary/5 border border-primary/20 rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
      <span aria-label="Phone" role="img">
        📞
      </span>{" "}
      Trenger du mer hjelp?
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
        <p>E-post: personvernombud@trondheim.kommune.no</p>
        <p>Telefon: 73 83 00 00</p>
        <div className="flex items-center">
          <p>Lov om personvern</p>
          <a
            href="https://lovdata.no/dokument/NL/lov/2018-06-15-38"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button className="h-auto p-1" size="sm" variant="ghost">
              <ExternalLink size={14}/>
            </Button>
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
