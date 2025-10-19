import { render, screen, fireEvent } from "@testing-library/react";

import { Data } from "../checklist/data";

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
});
