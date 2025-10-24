import { render, screen, fireEvent } from "@testing-library/react";

import { Data } from "../checklist";

jest.mock("../../ui/input", () => ({
  Input: ({ placeholder }: { placeholder?: string }) => (
    <input placeholder={placeholder} />
  ),
}));

jest.mock("../../ui/textarea", () => ({
  Textarea: ({ placeholder }: { placeholder?: string }) => (
    <textarea placeholder={placeholder} />
  ),
}));

describe("Data", () => {
  test("renders with receive option selected", () => {
    render(<Data selectedOption="receive" />);

    expect(screen.getByText("Datahåndtering")).toBeInTheDocument();
    expect(
      screen.getByText("Informasjon om data du skal motta eller levere"),
    ).toBeInTheDocument();
  });

  test("renders with share option selected", () => {
    render(<Data selectedOption="share" />);

    expect(screen.getByText("Datahåndtering")).toBeInTheDocument();
    expect(
      screen.getByText("Informasjon om data du skal motta eller levere"),
    ).toBeInTheDocument();
  });

  test("renders data type checkboxes for receive option", () => {
    render(<Data selectedOption="receive" />);

    expect(
      screen.getByText("Grunnleggende (navn, adresse, telefon)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Identifikasjonsnummer (fødselsnummer, personnummer)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Økonomiske opplysninger")).toBeInTheDocument();
    expect(screen.getByText("Helseopplysninger")).toBeInTheDocument();
  });

  test("allows selecting multiple data types", () => {
    render(<Data selectedOption="receive" />);

    const basicDataCheckbox = screen
      .getByText("Grunnleggende (navn, adresse, telefon)")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    const healthDataCheckbox = screen
      .getByText("Helseopplysninger")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    fireEvent.click(basicDataCheckbox);
    fireEvent.click(healthDataCheckbox);

    expect(basicDataCheckbox.checked).toBe(true);
    expect(healthDataCheckbox.checked).toBe(true);
  });

  test("renders data source options", () => {
    render(<Data selectedOption="receive" />);

    expect(screen.getByText("Folkeregisteret")).toBeInTheDocument();
    expect(screen.getByText("Kommunens egne systemer")).toBeInTheDocument();
    expect(screen.getByText("Eksterne leverandører")).toBeInTheDocument();
  });

  test("renders collection method options", () => {
    render(<Data selectedOption="receive" />);

    expect(
      screen.getByText("Direkte fra de registrerte (skjema, søknad)"),
    ).toBeInTheDocument();
    expect(screen.getByText("API/systemintegrasjon")).toBeInTheDocument();
    expect(screen.getByText("Offentlige registre")).toBeInTheDocument();
  });

  test("renders collection method options for receive", () => {
    render(<Data selectedOption="receive" />);

    expect(
      screen.getByText("Hvordan skal dataene samles inn?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Direkte fra de registrerte (skjema, søknad)"),
    ).toBeInTheDocument();
  });

  test("renders share-specific fields when share option is selected", () => {
    render(<Data selectedOption="share" />);

    expect(screen.getByText("Hvem skal motta dataen?")).toBeInTheDocument();
    expect(screen.getByText("Mottaker type:")).toBeInTheDocument();
    expect(
      screen.getByText("Rettsgrunnlag for utlevering:"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hvor manger ganger skal data deles?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hvordan skal dataene overføres?"),
    ).toBeInTheDocument();
  });

  test("renders recipient type radio buttons for share option", () => {
    render(<Data selectedOption="share" />);

    expect(screen.getByText("Offentlig myndighet (Norge)")).toBeInTheDocument();
    expect(
      screen.getByText("Offentlig myndighet (EU/EØS)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Offentlig myndighet (tredjeland)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Privat aktør (Norge)")).toBeInTheDocument();
    expect(screen.getByText("Privat aktør (EU/EØS)")).toBeInTheDocument();
    expect(screen.getByText("Privat aktør (tredjeland)")).toBeInTheDocument();
  });

  test("allows selecting recipient type for share option", () => {
    render(<Data selectedOption="share" />);

    const govtNorwayRadio = screen
      .getByText("Offentlig myndighet (Norge)")
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;

    const privateEURadio = screen
      .getByText("Privat aktør (EU/EØS)")
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;

    fireEvent.click(govtNorwayRadio);
    expect(govtNorwayRadio.checked).toBe(true);

    fireEvent.change(privateEURadio, { target: { value: "privateEU" } });
    fireEvent.click(privateEURadio);
    expect(privateEURadio.checked).toBe(true);
    expect(govtNorwayRadio.checked).toBe(false);
  });

  test("allows cycling through all recipient types", () => {
    render(<Data selectedOption="share" />);

    const recipientTypes = [
      "Offentlig myndighet (Norge)",
      "Offentlig myndighet (EU/EØS)",
      "Offentlig myndighet (tredjeland)",
      "Privat aktør (Norge)",
      "Privat aktør (EU/EØS)",
      "Privat aktør (tredjeland)",
    ];

    recipientTypes.forEach((type) => {
      const radio = screen
        .getByText(type)
        .closest("label")
        ?.querySelector('input[type="radio"]') as HTMLInputElement;

      fireEvent.click(radio);
      expect(radio.checked).toBe(true);
    });
  });

  test("renders data transfer methods for share option", () => {
    render(<Data selectedOption="share" />);

    expect(screen.getByText("API/systemintegrasjon")).toBeInTheDocument();
    expect(screen.getByText("Sikker filoverføring (SFTP)")).toBeInTheDocument();
    expect(screen.getByText("Kryptert e-post")).toBeInTheDocument();
    expect(screen.getByText("Sikker portal")).toBeInTheDocument();
    expect(screen.getByText("Fysisk medium (kryptert)")).toBeInTheDocument();
  });

  test("allows selecting multiple data transfer methods", () => {
    render(<Data selectedOption="share" />);

    const apiCheckbox = screen
      .getByText("API/systemintegrasjon")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    const sftpCheckbox = screen
      .getByText("Sikker filoverføring (SFTP)")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    fireEvent.click(apiCheckbox);
    fireEvent.click(sftpCheckbox);

    expect(apiCheckbox.checked).toBe(true);
    expect(sftpCheckbox.checked).toBe(true);
  });

  test("allows deselecting data types", () => {
    render(<Data selectedOption="receive" />);

    const basicDataCheckbox = screen
      .getByText("Grunnleggende (navn, adresse, telefon)")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    fireEvent.click(basicDataCheckbox);
    expect(basicDataCheckbox.checked).toBe(true);

    fireEvent.click(basicDataCheckbox);
    expect(basicDataCheckbox.checked).toBe(false);
  });

  test("allows deselecting data sources", () => {
    render(<Data selectedOption="receive" />);

    const folkeregisteretCheckbox = screen
      .getByText("Folkeregisteret")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    fireEvent.click(folkeregisteretCheckbox);
    expect(folkeregisteretCheckbox.checked).toBe(true);

    fireEvent.click(folkeregisteretCheckbox);
    expect(folkeregisteretCheckbox.checked).toBe(false);
  });

  test("allows deselecting collection methods", () => {
    render(<Data selectedOption="receive" />);

    const directCheckbox = screen
      .getByText("Direkte fra de registrerte (skjema, søknad)")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    fireEvent.click(directCheckbox);
    expect(directCheckbox.checked).toBe(true);

    fireEvent.click(directCheckbox);
    expect(directCheckbox.checked).toBe(false);
  });

  test("allows deselecting data transfer methods", () => {
    render(<Data selectedOption="share" />);

    const apiCheckbox = screen
      .getByText("API/systemintegrasjon")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    fireEvent.click(apiCheckbox);
    expect(apiCheckbox.checked).toBe(true);

    fireEvent.click(apiCheckbox);
    expect(apiCheckbox.checked).toBe(false);
  });
});
