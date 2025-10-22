import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";

type Props = {
  selectedOption: "receive" | "share";
  handlingData: any;
  onChange: (newData: any) => void;
};

export const Data = ({ selectedOption, handlingData, onChange }: Props) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...handlingData, [field]: value });
  };

  const toggleInArray = (field: string, value: string) => {
    const current = handlingData[field] || [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    handleChange(field, updated);
  };

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

  const dataSources = [
    { value: "folkeregisteret", label: "Folkeregisteret" },
    { value: "kommunens_systemer", label: "Kommunens egne systemer" },
    { value: "innsendte_skjemaer", label: "Innsendte skjemaer" },
    { value: "eksterne_leverandorer", label: "Eksterne leverandører" },
    { value: "andre_offentlige_etater", label: "Andre offentlige etater" },
    { value: "selvrapportert_brukere", label: "Selvrapportert av brukere" },
  ];

  const collectionMethodTypes = [
    { value: "direkte", label: "Direkte fra de registrerte (skjema, søknad)" },
    { value: "api", label: "API/systemintegrasjon" },
    { value: "filoverforing", label: "Filoverføring (CSV, Excel, etc.)" },
    { value: "manuell", label: "Manuell registrering" },
    { value: "offentlige", label: "Offentlige registre" },
    { value: "tredjepart", label: "Fra tredjepart" },
  ];

  const datatransferMethods = [
    { value: "api", label: "API/systemintegrasjon" },
    { value: "sftp", label: "Sikker filoverføring (SFTP)" },
    { value: "kryptert_epost", label: "Kryptert e-post" },
    { value: "sikker_portal", label: "Sikker portal" },
    { value: "fysisk_medium", label: "Fysisk medium (kryptert)" },
  ];

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
          <Textarea
            placeholder="Beskriv hva dataen skal brukes til..."
            value={handlingData.purpose || ""}
            onChange={(e) => handleChange("purpose", e.target.value)}
          />
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
                  checked={handlingData.selectedDataTypes.includes(value)}
                  className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                  type="checkbox"
                  onChange={() => toggleInArray("selectedDataTypes", value)}
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
                      checked={handlingData.selectedDataSources.includes(value)}
                      className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                      type="checkbox"
                      onChange={() =>
                        toggleInArray("selectedDataSources", value)
                      }
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
                value={handlingData.personCount || ""}
                onChange={(e) => handleChange("personCount", e.target.value)}
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
                value={handlingData.retentionTime || ""}
                onChange={(e) => handleChange("retentionTime", e.target.value)}
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
                      checked={handlingData.collectionMethod.includes(value)}
                      className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                      type="checkbox"
                      onChange={() => toggleInArray("collectionMethods", value)}
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
              <Input
                placeholder="F.eks. 'Helsedirektoratet', 'Annen kommune', 'Privat leverandør'..."
                value={handlingData.recipient || ""}
                onChange={(e) => handleChange("recipient", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Mottaker type:
              </label>
              <div className="space-y-2">
                {[
                  ["govtN", "Offentlig myndighet (Norge)"],
                  ["govtEU", "Offentlig myndighet (EU/EØS)"],
                  ["govt3rd", "Offentlig myndighet (tredjeland)"],
                  ["privateN", "Privat aktør (Norge)"],
                  ["privateEU", "Privat aktør (EU/EØS)"],
                  ["private3rd", "Privat aktør (tredjeland)"],
                ].map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2">
                    <input
                      checked={handlingData.recipientType === value}
                      name="recipientType"
                      type="radio"
                      value={value}
                      onChange={(e) =>
                        handleChange("recipientType", e.target.value)
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Rettsgrunnlag for utlevering:
              </label>
              <Textarea
                placeholder="Angi lovhjemmel eller annet grunnlag for å dele dataene..."
                value={handlingData.sharingLegalBasis || ""}
                onChange={(e) =>
                  handleChange("sharingLegalBasis", e.target.value)
                }
              />
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
                value={handlingData.shareFrequency || ""}
                onChange={(e) => handleChange("shareFrequency", e.target.value)}
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
                      checked={handlingData.dataTransferMethods.includes(value)}
                      className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                      type="checkbox"
                      onChange={() =>
                        toggleInArray("dataTransferMethods", value)
                      }
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
