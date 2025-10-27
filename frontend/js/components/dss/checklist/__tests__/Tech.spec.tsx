import { render, screen, fireEvent } from "@testing-library/react";
import type { Dispatch, SetStateAction, TextareaHTMLAttributes } from "react";
import { useState } from "react";

import type { TechData } from "js/hooks/useChecklist";

import { Tech } from "..";

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

describe("Tech", () => {
  const baseData: TechData = {
    storage: "",
    security: [],
    integrations: false,
    integrationDetails: "",
    automated: false,
    automatedDescription: "",
  };

  const renderTech = (override?: Partial<Parameters<typeof Tech>[0]>) => {
    const {
      techData: overrideData,
      onChange: overrideOnChange,
      ...restProps
    } = override ?? {};

    const Wrapper = () => {
      const [techData, setTechData] = useState<TechData>({
        ...baseData,
        ...overrideData,
      });

      const handleChange =
        overrideOnChange ?? (setTechData as Dispatch<SetStateAction<TechData>>);

      return (
        <Tech techData={techData} onChange={handleChange} {...restProps} />
      );
    };

    return render(<Wrapper />);
  };

  test("renders the section heading", () => {
    renderTech();

    expect(screen.getByText("Teknisk Løsning")).toBeInTheDocument();
  });

  test("renders storage location options", () => {
    renderTech();

    expect(
      screen.getByText("Kommunens egne servere (on-premise)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Sky-løsning i Norge")).toBeInTheDocument();
    expect(screen.getByText("Sky-løsning i EU/EØS")).toBeInTheDocument();
    expect(screen.getByText("Sky-løsning utenfor EU/EØS")).toBeInTheDocument();
    expect(screen.getByText("Hybrid løsning")).toBeInTheDocument();
  });

  test("allows selecting a storage location", () => {
    renderTech();

    const cloudNorwayRadio = screen
      .getByText("Sky-løsning i Norge")
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;

    fireEvent.click(cloudNorwayRadio);

    expect(cloudNorwayRadio.checked).toBe(true);
  });

  test("only allows one storage location to be selected at a time", () => {
    renderTech();

    const onPremRadio = screen
      .getByText("Kommunens egne servere (on-premise)")
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;

    const cloudEURadio = screen
      .getByText("Sky-løsning i EU/EØS")
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;

    fireEvent.click(onPremRadio);
    expect(onPremRadio.checked).toBe(true);

    fireEvent.click(cloudEURadio);
    expect(cloudEURadio.checked).toBe(true);
    expect(onPremRadio.checked).toBe(false);
  });

  test("renders all security measure checkboxes", () => {
    renderTech();

    expect(
      screen.getByText("Kryptering under overføring (TLS/SSL)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Kryptering ved lagring")).toBeInTheDocument();
    expect(
      screen.getByText("Multifaktor autentisering (MFA)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Tilgangskontroll basert på roller"),
    ).toBeInTheDocument();
    expect(screen.getByText("Logging og sporbarhet")).toBeInTheDocument();
    expect(screen.getByText("Regelmessig backup")).toBeInTheDocument();
    expect(screen.getByText("Brannmur/nettverkssikkerhet")).toBeInTheDocument();
    expect(
      screen.getByText("Antivirus/malware beskyttelse"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Beredskapsplan for databrudd"),
    ).toBeInTheDocument();
  });

  test("allows selecting multiple security measures", () => {
    renderTech();

    const tlsCheckbox = screen
      .getByText("Kryptering under overføring (TLS/SSL)")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    const mfaCheckbox = screen
      .getByText("Multifaktor autentisering (MFA)")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    const backupCheckbox = screen
      .getByText("Regelmessig backup")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    fireEvent.click(tlsCheckbox);
    fireEvent.click(mfaCheckbox);
    fireEvent.click(backupCheckbox);

    expect(tlsCheckbox.checked).toBe(true);
    expect(mfaCheckbox.checked).toBe(true);
    expect(backupCheckbox.checked).toBe(true);
  });

  test("renders integrations switch", () => {
    renderTech();

    expect(
      screen.getByText("Integrasjoner med andre systemer?"),
    ).toBeInTheDocument();
  });

  test("renders automated processing switch", () => {
    renderTech();

    expect(
      screen.getByText("Brukes automatiserte beslutninger eller profilering?"),
    ).toBeInTheDocument();
  });

  test("shows integrations textarea when switch is enabled", () => {
    renderTech();

    const switches = screen.getAllByTestId("switch");
    const integrationsSwitch = switches[0];

    expect(
      screen.queryByPlaceholderText(
        "Beskriv hvilke systemer som skal kommunisere sammen...",
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(integrationsSwitch);

    expect(
      screen.getByPlaceholderText(
        "Beskriv hvilke systemer som skal kommunisere sammen...",
      ),
    ).toBeInTheDocument();
  });

  test("shows automated processing textarea when switch is enabled", () => {
    renderTech();

    const switches = screen.getAllByTestId("switch");
    const automatedSwitch = switches[1];

    expect(
      screen.queryByPlaceholderText(
        "F.eks. algoritmer for tildeling, scoring, profiling...",
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(automatedSwitch);

    expect(
      screen.getByPlaceholderText(
        "F.eks. algoritmer for tildeling, scoring, profiling...",
      ),
    ).toBeInTheDocument();
  });

  test("allows deselecting security measures", () => {
    renderTech();

    const tlsCheckbox = screen
      .getByText("Kryptering under overføring (TLS/SSL)")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    fireEvent.click(tlsCheckbox);
    expect(tlsCheckbox.checked).toBe(true);

    fireEvent.click(tlsCheckbox);
    expect(tlsCheckbox.checked).toBe(false);
  });
});
