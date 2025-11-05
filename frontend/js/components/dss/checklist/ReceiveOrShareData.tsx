import { useId } from "react";

import { Button } from "js/components/ui/button";
import { ButtonGroup } from "js/components/ui/button-group";

type Props = {
  selected: "motta" | "dele" | null;
  onSelect: (key: "motta" | "dele" | null) => void;
};

export const ReceiveOrShareData = ({ selected, onSelect }: Props) => {
  const groupId = useId();
  const headingId = `${groupId}-heading`;
  const descriptionId = `${groupId}-description`;
  const receiveId = `${groupId}-receive`;
  const shareId = `${groupId}-share`;

  return (
    <section
      aria-labelledby={headingId}
      className="bg-card border border-primary/20 rounded-lg p-6 max-w-4xl mx-auto"
    >
      <h2
        className="text-xl font-medium mb-1 flex items-center gap-2"
        id={headingId}
      >
        <span aria-label="Floppy disk icon" role="img">
          💾
        </span>
        Hva skal du gjøre med personopplysninger?
      </h2>
      <p className="text-sm text-muted-foreground mb-4" id={descriptionId}>
        Velg ett alternativ for å få relevante spørsmål
      </p>

      <fieldset
        aria-describedby={descriptionId}
        className="mb-4 space-y-4 border-0 p-0"
      >
        <ButtonGroup className="grid gap-4" orientation="grid">
          <label
            className="relative block cursor-pointer hover:shadow-md bg-muted selected:bg-brand-cyan"
            htmlFor={receiveId}
          >
            <input
              checked={selected === "motta"}
              className="peer sr-only"
              id={receiveId}
              name={groupId}
              type="radio"
              value="motta"
              onChange={() => onSelect("motta")}
            />
            <div
              className="border-primary/20 bg-muted/10 peer-focus-visible:ring-ring/50 peer-focus-visible:ring-[3px] peer-focus-visible:border-ring peer-checked:border-primary peer-checked:bg-white peer-checked:shadow-sm border rounded-lg p-4 transition"
              role="presentation"
            >
              <div className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 text-lg">
                  📥
                </span>
                <div className="flex flex-col">
                  <h3 className="font-medium">Motta/samle inn data</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Jeg skal samle inn, motta eller behandle personopplysninger
                    fra registrerte personer eller andre kilder
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Eksempler: innsamling via skjema, motta data fra andre
                    etater, registrere nye brukere
                  </p>
                </div>
              </div>
            </div>
          </label>

          <label
            className="relative h-full block cursor-pointer hover:shadow-md bg-muted selected:bg-brand-cyan"
            htmlFor={shareId}
          >
            <input
              checked={selected === "dele"}
              className="peer sr-only"
              id={shareId}
              name={groupId}
              type="radio"
              value="dele"
              onChange={() => onSelect("dele")}
            />
            <div
              className="border-primary/20 h-full bg-muted/10 peer-focus-visible:ring-ring/50 peer-focus-visible:ring-[3px] peer-focus-visible:border-ring peer-checked:border-primary peer-checked:bg-white peer-checked:shadow-sm border rounded-lg p-4 transition"
              role="presentation"
            >
              <div className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 text-lg">
                  📤
                </span>
                <div className="flex flex-col">
                  <h3 className="font-medium">Dele/utlevere data</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Jeg skal dele, utlevere eller overføre personopplysninger
                    til andre organisasjoner eller systemer.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Eksempler: rapportering til Helsedirektoratet, dele data med
                    andre kommuner, eksport til leverandør.
                  </p>
                </div>
              </div>
            </div>
          </label>
        </ButtonGroup>
      </fieldset>

      <div className="flex items-center justify-between">
        {!selected && (
          <div
            className="flex items-center gap-2 text-sm rounded px-4 py-2"
            style={{
              color: "#894B00",
              backgroundColor: "#FEFCE8",
              border: "1px solid #FFF085",
            }}
          >
            <span aria-label="warning icon" role="img">
              ⚠️
            </span>{" "}
            Vennligst velg ett alternativ for å fortsette med sjekklisten
          </div>
        )}
        <Button
          className="ml-auto"
          type="button"
          variant="ghost"
          onClick={() => onSelect(null)}
        >
          Nullstill valg
        </Button>
      </div>

    </section>
  );
};
