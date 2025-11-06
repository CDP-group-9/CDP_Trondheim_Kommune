import { useId } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { ChecklistOption, HandlingData } from "js/hooks/useChecklist";

import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";

type Props = {
  selectedOption: Exclude<ChecklistOption, null>;
  handlingData: HandlingData;
  onChange: Dispatch<SetStateAction<HandlingData>>;
};

type ArrayField = {
  [K in keyof HandlingData]: HandlingData[K] extends string[] ? K : never;
}[keyof HandlingData];

type NumericField = {
  [K in keyof HandlingData]: HandlingData[K] extends number | "" ? K : never;
}[keyof HandlingData];

export const Data = ({ selectedOption, handlingData, onChange }: Props) => {
  const baseId = useId();
  const purposeId = `${baseId}-purpose`;
  const dataTypesGroupId = `${baseId}-data-types`;
  const dataSourcesGroupId = `${baseId}-data-sources`;
  const personCountId = `${baseId}-person-count`;
  const retentionId = `${baseId}-retention`;
  const collectionGroupId = `${baseId}-collection-methods`;
  const recipientId = `${baseId}-recipient`;
  const recipientTypeGroupId = `${baseId}-recipient-type`;
  const sharingBasisId = `${baseId}-sharing-basis`;
  const shareFrequencyId = `${baseId}-share-frequency`;
  const transferGroupId = `${baseId}-transfer-methods`;

  const handleChange = <K extends keyof HandlingData>(
    field: K,
    value: HandlingData[K],
  ) => {
    onChange({ ...handlingData, [field]: value });
  };

  const toggleInArray = <K extends ArrayField>(field: K, value: string) => {
    const current = handlingData[field];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    handleChange(field, updated as HandlingData[K]);
  };

  const handleNumericInput = <K extends NumericField>(
    field: K,
    value: string,
  ) => {
    const parsedValue =
      value === "" ? "" : Number.isNaN(Number(value)) ? "" : Number(value);
    handleChange(field, parsedValue as HandlingData[K]);
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
      <h3 className="mb-1 flex items-center gap-2">Datahåndtering</h3>
      <p className="text-muted-foreground mb-4">
        Informasjon om data du skal motta eller levere
      </p>

      <div className="space-y-6 p-2">
        {/* Both */}
        <div className="inputGroup space-y-2">
          <label htmlFor={purposeId}>
            Hva er formålet med dataen som skal hånteres?
          </label>
          <Textarea
            className="bg-white"
            id={purposeId}
            placeholder="Beskriv hva dataen skal brukes til..."
            value={handlingData.purpose || ""}
            onChange={(e) => handleChange("purpose", e.target.value)}
          />
        </div>
        {/* Both */}
        <div
          aria-labelledby={dataTypesGroupId}
          className="buttonGroup space-y-2"
          role="group"
        >
          <span id={dataTypesGroupId} role="presentation">
            Hvilke typer personopplysninger skal behandles?
          </span>
          <div className="flex flex-col space-y-2">
            {datatypes.map(({ value, label }) => (
              <label
                key={value}
                className="inline-flex items-center space-x-2 cursor-pointer"
                htmlFor={`${dataTypesGroupId}-${value}`}
              >
                <input
                  checked={handlingData.selectedDataTypes.includes(value)}
                  className="h-4 w-4 rounded border border-gray-300 text-primary text-base focus:ring-primary"
                  id={`${dataTypesGroupId}-${value}`}
                  type="checkbox"
                  onChange={() => toggleInArray("selectedDataTypes", value)}
                />
                <span className="text-base">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {selectedOption === "motta" && (
          <>
            <div
              aria-labelledby={dataSourcesGroupId}
              className="buttonGroup space-y-2"
              role="group"
            >
              <span id={dataSourcesGroupId} role="presentation">
                Hvor kommer dataene fra?
              </span>
              <div className="flex flex-col space-y-2">
                {dataSources.map(({ value, label }) => (
                  <label
                    key={value}
                    className="inline-flex items-center space-x-2 cursor-pointer"
                    htmlFor={`${dataSourcesGroupId}-${value}`}
                  >
                    <input
                      checked={handlingData.selectedDataSources.includes(value)}
                      className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                      id={`${dataSourcesGroupId}-${value}`}
                      type="checkbox"
                      onChange={() =>
                        toggleInArray("selectedDataSources", value)
                      }
                    />
                    <span className="text-base">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="inputGroup space-y-2">
              <label htmlFor={personCountId}>
                Hvor mange personer er inkludert i dataen?
              </label>
              <Input
                className="bg-white font-medium text-base"
                id={personCountId}
                min={0}
                placeholder="Oppgi svaret som et heltall"
                step={1}
                type="number"
                value={handlingData.personCount || ""}
                onChange={(e) =>
                  handleNumericInput("personCount", e.target.value)
                }
              />
            </div>
            <div className="inputGroup space-y-2">
              <label htmlFor={retentionId}>
                Hvor lenge skal dataene oppbevares?
              </label>
              <Input
                className="bg-white text-base font-medium"
                id={retentionId}
                min={0}
                placeholder="Oppgi svaret i antall år (bruk desimaltall om nødvendig)"
                type="number"
                value={handlingData.retentionTime || ""}
                onChange={(e) =>
                  handleNumericInput("retentionTime", e.target.value)
                }
              />
            </div>
            <div
              aria-labelledby={collectionGroupId}
              className="buttonGroup space-y-2"
              role="group"
            >
              <span id={collectionGroupId} role="presentation">
                Hvordan skal dataene samles inn?
              </span>
              <div className="flex flex-col space-y-2">
                {collectionMethodTypes.map(({ value, label }) => (
                  <label
                    key={value}
                    className="inline-flex items-center space-x-2 cursor-pointer "
                    htmlFor={`${collectionGroupId}-${value}`}
                  >
                    <input
                      checked={handlingData.collectionMethods.includes(value)}
                      className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                      id={`${collectionGroupId}-${value}`}
                      type="checkbox"
                      onChange={() => toggleInArray("collectionMethods", value)}
                    />
                    <span className="text-base">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {selectedOption === "dele" && (
          <>
            <div className="inputGroup space-y-2">
              <label htmlFor={recipientId}>Hvem skal motta dataen?</label>
              <Input
                className="bg-white"
                id={recipientId}
                placeholder="F.eks. 'Helsedirektoratet', 'Annen kommune', 'Privat leverandør'..."
                value={handlingData.recipient || ""}
                onChange={(e) => handleChange("recipient", e.target.value)}
              />
            </div>
            <div
              aria-labelledby={recipientTypeGroupId}
              className="buttonGroup space-y-2"
              role="radiogroup"
            >
              <span id={recipientTypeGroupId} role="presentation">
                Mottaker type:
              </span>
              <div className="space-y-2">
                {[
                  ["govtN", "Offentlig myndighet (Norge)"],
                  ["govtEU", "Offentlig myndighet (EU/EØS)"],
                  ["govt3rd", "Offentlig myndighet (tredjeland)"],
                  ["privateN", "Privat aktør (Norge)"],
                  ["privateEU", "Privat aktør (EU/EØS)"],
                  ["private3rd", "Privat aktør (tredjeland)"],
                ].map(([value, label]) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 cursor-pointer text-base font-normal"
                    htmlFor={`${recipientTypeGroupId}-${value}`}
                  >
                    <input
                      checked={handlingData.recipientType === value}
                      className="text-base"
                      id={`${recipientTypeGroupId}-${value}`}
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
            <div className="inputGroup space-y-2">
              <label
                className="block text-md font-medium"
                htmlFor={sharingBasisId}
              >
                Rettsgrunnlag for utlevering:
              </label>
              <Textarea
                className="bg-white"
                id={sharingBasisId}
                placeholder="Angi lovhjemmel eller annet grunnlag for å dele dataene..."
                value={handlingData.sharingLegalBasis || ""}
                onChange={(e) =>
                  handleChange("sharingLegalBasis", e.target.value)
                }
              />
            </div>
            <div className="inputGroup space-y-2">
              <label htmlFor={shareFrequencyId}>
                Hvor manger ganger skal data deles?
              </label>
              <Input
                className="bg-white text-base"
                id={shareFrequencyId}
                min={0}
                placeholder="Oppgi som et heltall"
                step={1}
                type="number"
                value={handlingData.shareFrequency || ""}
                onChange={(e) =>
                  handleNumericInput("shareFrequency", e.target.value)
                }
              />
            </div>
            <div
              aria-labelledby={transferGroupId}
              className="buttonGroup space-y-2"
              role="group"
            >
              <span id={transferGroupId} role="presentation">
                Hvordan skal dataene overføres?
              </span>
              <div className="flex flex-col space-y-2">
                {datatransferMethods.map(({ value, label }) => (
                  <label
                    key={value}
                    className="inline-flex items-center space-x-2 cursor-pointer text-base font-normal"
                    htmlFor={`${transferGroupId}-${value}`}
                  >
                    <input
                      checked={handlingData.dataTransferMethods.includes(value)}
                      className="h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                      id={`${transferGroupId}-${value}`}
                      type="checkbox"
                      onChange={() =>
                        toggleInArray("dataTransferMethods", value)
                      }
                    />
                    <span className="text-base">{label}</span>
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
