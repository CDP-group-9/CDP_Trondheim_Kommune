import { useState } from "react";

import { Input } from "../input";
import { Textarea } from "../textarea";

type Props = {
  selectedOption: "receive" | "share";
};

export const Data = ({ selectedOption }: Props) => {
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

        {selectedOption === "receive" && (
          <>
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
          </>
        )}

        {selectedOption === "share" && (
          <>
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
          </>
        )}
      </div>
    </section>
  );
};
