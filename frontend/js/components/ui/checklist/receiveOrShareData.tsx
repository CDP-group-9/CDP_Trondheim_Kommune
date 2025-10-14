import { useState } from "react";

export const ReceiveOrShareData = () => {
  const [selected, setSelected] = useState<{
    receive: boolean;
    share: boolean;
  }>({
    receive: false,
    share: false,
  });

  const toggleOption = (key: "receive" | "share") => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="bg-primary/5 border border-primary/20 rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-medium mb-1 flex items-center gap-2">
        <span aria-label="Flopp disk" role="img">
          💾
        </span>
        Hva skal du gjøre med personopplysninger?
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Velg ett alternativ for å få relevante spørsmål
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Receive/Collect Data Card */}
        <button
          className={`flex flex-col items-start justify-start flex-1 border rounded-lg p-4 cursor-pointer transition text-left
      ${selected.receive ? "border-primary bg-white shadow-sm" : "border-primary/20 bg-muted/10"}`}
          type="button"
          onClick={() => toggleOption("receive")}
        >
          <div className="flex items-start gap-3 self-start">
            <input
              checked={selected.receive}
              className="mt-1"
              type="checkbox"
              onChange={() => toggleOption("receive")}
            />
            <div className="flex flex-col justify-start">
              <h3 className="font-medium flex items-center gap-1">
                <span aria-label="Inbox" role="img">
                  📥
                </span>
                Motta/samle inn data
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Jeg skal samle inn, motta eller behandle personopplysninger fra
                registrerte personer eller andre kilder
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Eksempler: innsamling via skjema, motta data fra andre etater,
                registrere nye brukere
              </p>
            </div>
          </div>
        </button>

        {/* Share/Transfer Data Card */}
        <button
          className={`flex flex-col items-start justify-start flex-1 border rounded-lg p-4 cursor-pointer transition text-left
      ${selected.share ? "border-primary bg-white shadow-sm" : "border-primary/20 bg-muted/10"}`}
          type="button"
          onClick={() => toggleOption("share")}
        >
          <div className="flex items-start gap-3 self-start">
            <input
              checked={selected.share}
              className="mt-1"
              type="checkbox"
              onChange={() => toggleOption("share")}
            />
            <div className="flex flex-col justify-start">
              <h3 className="font-medium flex items-center gap-1">
                <span aria-label="Outbox" role="img">
                  📤
                </span>
                Dele/utlevere data
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Jeg skal dele, utlevere eller overføre personopplysninger til
                andre organisasjoner eller systemer
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Eksempler: rapportering til Helsedirektoratet, dele data med
                andre kommuner, eksport til leverandør
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Warning message if neither is selected */}
      {!selected.receive && !selected.share && (
        <div
          className="flex items-center gap-2 text-sm rounded px-4 py-2"
          style={{
            color: "#894B00",
            backgroundColor: "#FEFCE8",
            border: "1px solid #FFF085",
          }}
        >
          <span aria-label="Warning" role="img">
            ⚠️
          </span>{" "}
          Vennligst velg ett alternativ for å fortsette med sjekklisten
        </div>
      )}
    </section>
  );
};
