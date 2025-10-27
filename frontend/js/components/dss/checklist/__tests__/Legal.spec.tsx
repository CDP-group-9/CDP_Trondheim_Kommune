import { render, screen, fireEvent } from "@testing-library/react";
import type { Dispatch, SetStateAction, TextareaHTMLAttributes } from "react";
import { useState } from "react";

import type { LegalBasisData } from "js/hooks/useChecklist";

import { Legal } from "..";

jest.mock("js/components/ui/switch", () => ({
  Switch: ({
    checked,
    onCheckedChange,
  }: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  }) => (
    <input
      checked={checked}
      data-testid="switch"
      type="checkbox"
      onChange={(event) => onCheckedChange(event.target.checked)}
    />
  ),
}));

jest.mock("js/components/ui/textarea", () => ({
  Textarea: ({
    placeholder,
    ...props
  }: {
    placeholder?: string;
  } & TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea placeholder={placeholder} {...props} />
  ),
}));

describe("Legal", () => {
  const baseData: LegalBasisData = {
    legalBasis: "",
    handlesSensitiveData: false,
    selectedSensitiveDataReason: [],
    statutoryTasks: "",
  };

  const renderLegal = (override?: Partial<Parameters<typeof Legal>[0]>) => {
    const {
      legalBasisData: overrideData,
      onChange: overrideOnChange,
      ...restProps
    } = override ?? {};

    const Wrapper = () => {
      const [legalBasisData, setLegalBasisData] = useState<LegalBasisData>({
        ...baseData,
        ...overrideData,
      });

      const handleChange =
        overrideOnChange ??
        (setLegalBasisData as Dispatch<SetStateAction<LegalBasisData>>);

      return (
        <Legal
          legalBasisData={legalBasisData}
          onChange={handleChange}
          {...restProps}
        />
      );
    };

    return render(<Wrapper />);
  };

  test("renders the section heading", () => {
    renderLegal();

    expect(screen.getByText("Rettsgrunnlag og Formål")).toBeInTheDocument();
  });

  test("renders all legal basis options", () => {
    renderLegal();

    expect(
      screen.getByText(
        "Offentlig oppgave (GDPR art. 6(1)(e)) - Vanligst for kommuner",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Rettslig forpliktelse (GDPR art. 6(1)(c))"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Kontraktsoppfyllelse (GDPR art. 6(1)(b))"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Samtykke (GDPR art. 6(1)(a))"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Berettiget interesse (GDPR art. 6(1)(f))"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Usikker – trenger veiledning"),
    ).toBeInTheDocument();
  });

  test("allows selecting a legal basis", () => {
    renderLegal();

    const publicTaskRadio = screen
      .getByText(
        "Offentlig oppgave (GDPR art. 6(1)(e)) - Vanligst for kommuner",
      )
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;

    fireEvent.click(publicTaskRadio);

    expect(publicTaskRadio.checked).toBe(true);
  });

  test("only allows one legal basis to be selected at a time", () => {
    renderLegal();

    const publicTaskRadio = screen
      .getByText(
        "Offentlig oppgave (GDPR art. 6(1)(e)) - Vanligst for kommuner",
      )
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;

    const consentRadio = screen
      .getByText("Samtykke (GDPR art. 6(1)(a))")
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;

    fireEvent.click(publicTaskRadio);
    expect(publicTaskRadio.checked).toBe(true);

    fireEvent.click(consentRadio);
    expect(consentRadio.checked).toBe(true);
    expect(publicTaskRadio.checked).toBe(false);
  });

  test("renders sensitive data handling switch", () => {
    renderLegal();

    expect(
      screen.getByText("Behandles sensitive personopplysninger?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Nei")).toBeInTheDocument();
  });

  test("shows sensitive data reasons when switch is enabled", () => {
    renderLegal();

    const switchElement = screen.getByTestId("switch");

    expect(
      screen.queryByText("Uttrykkelig samtykke (art. 9(2)(a))"),
    ).not.toBeInTheDocument();

    fireEvent.click(switchElement);

    expect(
      screen.getByText("Uttrykkelig samtykke (art. 9(2)(a))"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Helsehjelp og forebygging (art. 9(2)(h))"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Samfunnsinteresser i folkehelsearbeid (art. 9(2)(i))"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Viktig samfunnsinteresse (art. 9(2)(g))"),
    ).toBeInTheDocument();
  });

  test("allows selecting multiple sensitive data reasons", () => {
    renderLegal();

    const switchElement = screen.getByTestId("switch");
    fireEvent.click(switchElement);

    const consentCheckbox = screen
      .getByText("Uttrykkelig samtykke (art. 9(2)(a))")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    const healthcareCheckbox = screen
      .getByText("Helsehjelp og forebygging (art. 9(2)(h))")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    fireEvent.click(consentCheckbox);
    fireEvent.click(healthcareCheckbox);

    expect(consentCheckbox.checked).toBe(true);
    expect(healthcareCheckbox.checked).toBe(true);
  });

  test("allows deselecting sensitive data reasons", () => {
    renderLegal();

    const switchElement = screen.getByTestId("switch");
    fireEvent.click(switchElement);

    const consentCheckbox = screen
      .getByText("Uttrykkelig samtykke (art. 9(2)(a))")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    fireEvent.click(consentCheckbox);
    expect(consentCheckbox.checked).toBe(true);

    fireEvent.click(consentCheckbox);
    expect(consentCheckbox.checked).toBe(false);
  });
});
