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
      <h2 className="mb-1 flex items-center gap-2" id={headingId}>
        Hva skal du gjøre med personopplysninger?
      </h2>
      <p className="text-muted-foreground mb-4" id={descriptionId}>
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
                  <svg
                    className="size-6"
                    height="24"
                    role="presentation"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <g fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path
                        d="M6 6c0 1.1 2.7 2 6 2s6-.9 6-2-2.7-2-6-2-6 .9-6 2z"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6 6v4c0 1.1 2.7 2 6 2s6-.9 6-2V6"
                        strokeLinecap="round"
                      />
                      <path d="M12 14v4" strokeLinecap="round" />
                      <path
                        d="M9.5 16.5 12 19l2.5-2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </span>
                <div className="flex flex-col justify-evenly gap-2">
                  <h3 className="font-medium">Motta/samle inn data</h3>
                  <p className="text-base text-muted-foreground mt-1">
                    Jeg skal samle inn, motta eller behandle personopplysninger
                    fra registrerte personer eller andre kilder
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Eksempler: innsamling via skjema, motta data fra andre
                    etater, registrere nye brukere
                  </p>
                </div>
              </div>
            </div>
          </label>

          <label
            className="relative h-full block cursor-pointer hover:shadow-md bg-muted"
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
                  <svg
                    className="size-6"
                    height="24"
                    role="presentation"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <g fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 6v7" strokeLinecap="round" />
                      <path
                        d="M9.5 8.5 12 6l2.5 2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 14c0 1.1 2.7 2 6 2s6-.9 6-2-2.7-2-6-2-6 .9-6 2z"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6 14v4c0 1.1 2.7 2 6 2s6-.9 6-2v-4"
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>
                </span>
                <div className="flex flex-col justify-evenly gap-2">
                  <h3 className="font-medium">Dele/utlevere data</h3>
                  <p className="text-base text-muted-foreground mt-1">
                    Jeg skal dele, utlevere eller overføre personopplysninger
                    til andre organisasjoner eller systemer.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
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
          <div className="flex items-center gap-2 text-sm rounded px-4 py-2 text-brand-orange bg-brand-yellow/50">
            <p aria-label="warning message" role="note">
              Vennligst velg ett alternativ for å fortsette med sjekklisten
            </p>{" "}
          </div>
        )}
        <Button
          className="ml-auto"
          type="button"
          variant="secondary"
          onClick={() => onSelect(null)}
        >
          Nullstill valg
        </Button>
      </div>
    </section>
  );
};
