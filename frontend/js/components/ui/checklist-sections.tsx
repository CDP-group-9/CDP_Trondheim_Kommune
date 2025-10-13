import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "js/components/ui/select";
import { Switch } from "js/components/ui/switch";

import { Input } from "./input";
import { Textarea } from "./textarea";

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
        Velg ett eller begge alternativene for å få relevante spørsmål
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
          Vennligst velg minst ett alternativ for å fortsette med sjekklisten
        </div>
      )}
    </section>
  );
};

// Er progressbar nødvendig?
// export const ProgressBar = () => {
//   return <div>TODO: Progress Bar</div>;
// };

export const Context = () => {
  const [status, setStatus] = useState("");

  return (
    <section className="bg-card border border-border rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-medium mb-1 flex items-center gap-2">
        <span aria-label="target icon" role="img">
          🎯
        </span>
        Prosjekt/Initiativ Kontekst
      </h2>

      <p className="text-sm text-muted-foreground mb-4">
        Grunnleggende informasjon om ditt prosjekt
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Prosjektnavn og kort beskrivelse:
          </label>
          <Input placeholder="F.eks. 'Digital Skoleportal - ny løsning for elevdata'" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Ansvarlig avdeling/enhet:
          </label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Velg et alternativ..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tk">Trondheim Kommune</SelectItem>
              <SelectItem value="ntnuidi">NTNU IDI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Prosjektstatus:
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                checked={status === "planning"}
                name="status"
                type="radio"
                value="planning"
                onChange={(e) => setStatus(e.target.value)}
              />
              Planlegging
            </label>
            <label className="flex items-center gap-2">
              <input
                checked={status === "development"}
                name="status"
                type="radio"
                value="development"
                onChange={(e) => setStatus(e.target.value)}
              />
              Utvikling
            </label>
            <label className="flex items-center gap-2">
              <input
                checked={status === "testing"}
                name="status"
                type="radio"
                value="testing"
                onChange={(e) => setStatus(e.target.value)}
              />
              Testing
            </label>
            <label className="flex items-center gap-2">
              <input
                checked={status === "implementation"}
                name="status"
                type="radio"
                value="implementation"
                onChange={(e) => setStatus(e.target.value)}
              />
              Implementering
            </label>
            <label className="flex items-center gap-2">
              <input
                checked={status === "production"}
                name="status"
                type="radio"
                value="production"
                onChange={(e) => setStatus(e.target.value)}
              />
              Produksjon
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Formål og mål med prosjektet:
          </label>
          <Textarea placeholder="Beskriv hva dere ønsker å oppnå og hvorfor..." />
        </div>
      </div>
    </section>
  );
};

export const Data = () => {
  const [recipient, setStatus] = useState("");

  const [selected, setSelected] = useState<string[]>([]);

  const [selectedDataSource, setSelectedDataSource] = useState<string[]>([]);

  const [selectedCollectionMethod, setSelectedCollectionMethod] = useState<
    string[]
  >([]);

  const [selectedDataTransferMethods, setSelectedDataTransferMethods] =
    useState<string[]>([]);

  const datatypes = [
    {
      value: "grl",
      label: "Grunnleggende (navn, adresse, telefon)",
    },
    {
      value: "id",
      label: "Identifikasjonsnummer (fødselsnummer, personnummer)",
    },
    {
      value: "økonomi",
      label: "Økonomiske opplysninger",
    },
    {
      value: "helse",
      label: "Helseopplysninger",
    },
    {
      value: "sense",
      label: "Andre sensitive opplysninger (religion, politisk tilhørighet)",
    },
    {
      value: "bio",
      label: "Biometriske data (fingeravtrykk, ansiktsgjenkjenning)",
    },
    { value: "pos", label: "Posisjonsdata" },
    { value: "atferd", label: "Atferdsdata (nettvaner, preferanser)" },
  ];

  const toggleDatatype = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const dataSources = [
    { value: "folkeregisteret", label: "Folkeregisteret" },
    { value: "kommunens_systemer", label: "Kommunens egne systemer" },
    { value: "innsendte_skjemaer", label: "Innsendte skjemaer" },
    { value: "eksterne_leverandorer", label: "Eksterne leverandører" },
    { value: "andre_offentlige_etater", label: "Andre offentlige etater" },
    { value: "selvrapportert_brukere", label: "Selvrapportert av brukere" },
  ];

  const toggleDataSources = (value: string) => {
    setSelectedDataSource((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const collectionMethodTypes = [
    { value: "direkte", label: "Direkte fra de registrerte (skjema, søknad)" },
    { value: "api", label: "API/systemintegrasjon" },
    { value: "filoverforing", label: "Filoverføring (CSV, Excel, etc.)" },
    { value: "manuell", label: "Manuell registrering" },
    { value: "offentlige", label: "Offentlige registre" },
    { value: "tredjepart", label: "Fra tredjepart" },
  ];

  const toggleCollectionMethod = (value: string) => {
    setSelectedCollectionMethod((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const datatransferMethods = [
    { value: "api", label: "API/systemintegrasjon" },
    { value: "sftp", label: "Sikker filoverføring (SFTP)" },
    { value: "kryptert_epost", label: "Kryptert e-post" },
    { value: "sikker_portal", label: "Sikker portal" },
    { value: "fysisk_medium", label: "Fysisk medium (kryptert)" },
  ];

  const toggleTransfer = (value: string) => {
    setSelectedDataTransferMethods((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  return (
    <section className="bg-card border border-border rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-medium mb-1 flex items-center gap-2">
        <span aria-label="pickaxe icon" role="img">
          ⛏
        </span>
        Datahåndtering
      </h2>

      <p className="text-sm text-muted-foreground mb-4">
        Informasjon om data du skal motta eller levere
      </p>

      <div className="space-y-6">
        {/* Both */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Hva er formålet med dataen som skal hånteres?
          </label>
          <Textarea placeholder="Beskriv hva dataen skal brukes til..." />
        </div>
        {/* Both */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Hvilke typer personopplysninger skal behandles?
          </label>
          <div className="flex flex-col space-y-2">
            {datatypes.map(({ value, label }) => (
              <label
                key={value}
                className="inline-flex items-center space-x-2 cursor-pointer"
              >
                <input
                  checked={selected.includes(value)}
                  className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                  type="checkbox"
                  onChange={() => toggleDatatype(value)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Hvor kommer dataene fra?
          </label>
          <div className="flex flex-col space-y-2">
            {dataSources.map(({ value, label }) => (
              <label
                key={value}
                className="inline-flex items-center space-x-2 cursor-pointer"
              >
                <input
                  checked={selectedDataSource.includes(value)}
                  className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                  type="checkbox"
                  onChange={() => toggleDataSources(value)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Hvor mange personer er inkludert i dataen?
          </label>
          <Input
            min={0}
            placeholder="Oppgi svaret som et heltall"
            step={1}
            type="number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Hvor lenge skal dataene oppbevares?
          </label>
          <Input
            min={0}
            placeholder="Oppgi svaret i antall år (bruk desimaltall om nødvendig)"
            type="number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Hvordan skal dataene samles inn?
          </label>
          <div className="flex flex-col space-y-2">
            {collectionMethodTypes.map(({ value, label }) => (
              <label
                key={value}
                className="inline-flex items-center space-x-2 cursor-pointer"
              >
                <input
                  checked={selectedCollectionMethod.includes(value)}
                  className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                  type="checkbox"
                  onChange={() => toggleCollectionMethod(value)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Hvem skal motta dataen?
          </label>
          <Input placeholder="F.eks. 'Helsedirektoratet', 'Annen kommune', 'Privat leverandør'..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Mottaker type:
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                checked={recipient === "govtN"}
                name="status"
                type="radio"
                value="govtN"
                onChange={(e) => setStatus(e.target.value)}
              />
              Offentlig myndighet (Norge)
            </label>
            <label className="flex items-center gap-2">
              <input
                checked={recipient === "govtEU"}
                name="status"
                type="radio"
                value="govtEU"
                onChange={(e) => setStatus(e.target.value)}
              />
              Offentlig myndighet (EU/EØS)
            </label>
            <label className="flex items-center gap-2">
              <input
                checked={recipient === "govt3rd"}
                name="status"
                type="radio"
                value="govt3rd"
                onChange={(e) => setStatus(e.target.value)}
              />
              Offentlig myndighet (tredjeland)
            </label>
            <label className="flex items-center gap-2">
              <input
                checked={recipient === "privateN"}
                name="status"
                type="radio"
                value="privateN"
                onChange={(e) => setStatus(e.target.value)}
              />
              Privat aktør (Norge)
            </label>
            <label className="flex items-center gap-2">
              <input
                checked={recipient === "privateEU"}
                name="status"
                type="radio"
                value="privateEU"
                onChange={(e) => setStatus(e.target.value)}
              />
              Privat aktør (EU/EØS)
            </label>
            <label className="flex items-center gap-2">
              <input
                checked={recipient === "private3rd"}
                name="status"
                type="radio"
                value="private3rd"
                onChange={(e) => setStatus(e.target.value)}
              />
              Privat aktør (tredjeland)
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Rettsgrunnlag for utlevering:
          </label>
          <Textarea placeholder="Angi lovhjemmel eller annet grunnlag for å dele dataene..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Hvor manger ganger skal data deles?
          </label>
          <Input
            min={0}
            placeholder="Oppgi som et heltall"
            step={1}
            type="number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Hvordan skal dataene overføres?
          </label>
          <div className="flex flex-col space-y-2">
            {datatransferMethods.map(({ value, label }) => (
              <label
                key={value}
                className="inline-flex items-center space-x-2 cursor-pointer"
              >
                <input
                  checked={selectedDataTransferMethods.includes(value)}
                  className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                  type="checkbox"
                  onChange={() => toggleTransfer(value)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Legal = () => {
  const [legalBasis, setLegalBasis] = useState("");
  const [handlesSensitiveData, setHandlesSensitiveData] = useState(false);

  return (
    <section className="bg-card border border-border rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-medium mb-1 flex items-center gap-2">
        <span aria-label="scale" role="img">
          ⚖️
        </span>
        Rettsgrunnlag og Formål
      </h2>

      <p className="text-sm text-muted-foreground mb-4">
        Juridisk grunnlag for databehandlingen
      </p>

      {/* Legal basis radio buttons */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Hvilket rettsgrunnlag planlegges brukt?
          </label>
          {[
            {
              value: "offentlig_oppgave",
              label:
                "Offentlig oppgave (GDPR art. 6(1)(e)) - Vanligst for kommuner",
            },
            {
              value: "rettslig_forpliktelse",
              label: "Rettslig forpliktelse (GDPR art. 6(1)(c))",
            },
            {
              value: "kontraktsoppfyllelse",
              label: "Kontraktsoppfyllelse (GDPR art. 6(1)(b))",
            },
            {
              value: "samtykke",
              label: "Samtykke (GDPR art. 6(1)(a))",
            },
            {
              value: "berettiget_interesse",
              label: "Berettiget interesse (GDPR art. 6(1)(f))",
            },
            {
              value: "usikker",
              label: "Usikker – trenger veiledning",
            },
          ].map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                checked={legalBasis === value}
                name="legalBasis"
                type="radio"
                value={value}
                onChange={() => setLegalBasis(value)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Behandles sensitive personopplysninger?
          </label>
          <div className="flex items-center gap-2">
            <Switch
              checked={handlesSensitiveData}
              id="sensitive-data-switch"
              onCheckedChange={setHandlesSensitiveData}
            />
            <span>{handlesSensitiveData ? "Ja" : "Nei"}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Lovpålagte oppgaver eller krav?
          </label>
          <Textarea placeholder="Referanser til lover som krever databehandlingen..." />
        </div>
      </div>
    </section>
  );
};
