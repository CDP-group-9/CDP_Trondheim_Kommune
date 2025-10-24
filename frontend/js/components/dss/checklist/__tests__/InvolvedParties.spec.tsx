import { render, screen, fireEvent } from "@testing-library/react";
import type {
  Dispatch,
  SetStateAction,
  TextareaHTMLAttributes,
} from "react";
import { useState } from "react";

import type { InvolvedPartiesData } from "js/hooks/useChecklist";

import { InvolvedParties } from "../index";

jest.mock("js/components/ui/select", () => ({
  Select: ({
    children,
    value,
    onValueChange,
  }: {
    children: React.ReactNode;
    value?: string;
    onValueChange?: (value: string) => void;
  }) => (
    <div data-testid="select">
      <select
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
      >
        {children}
      </select>
    </div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <div>{placeholder}</div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <option value={value}>{children}</option>,
}));

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

describe("InvolvedParties", () => {
  const baseData: InvolvedPartiesData = {
    registeredGroups: [],
    usesExternalProcessors: false,
    externalProcessors: "",
    employeeAccess: "",
    sharesWithOthers: false,
    sharedWith: "",
  };

  const renderInvolvedParties = (
    override?: Partial<Parameters<typeof InvolvedParties>[0]>,
  ) => {
    const {
      involvedPartiesData: overrideData,
      onChange: overrideOnChange,
      ...restProps
    } = override ?? {};

    const Wrapper = () => {
      const [involvedPartiesData, setInvolvedPartiesData] =
        useState<InvolvedPartiesData>({
          ...baseData,
          ...overrideData,
        });

      const handleChange =
        overrideOnChange ??
        (setInvolvedPartiesData as Dispatch<
          SetStateAction<InvolvedPartiesData>
        >);

      return (
        <InvolvedParties
          involvedPartiesData={involvedPartiesData}
          onChange={handleChange}
          {...restProps}
        />
      );
    };

    return render(<Wrapper />);
  };

  test("renders the section heading", () => {
    renderInvolvedParties();

    expect(screen.getByText("Involverte Parter")).toBeInTheDocument();
  });

  test("renders all registered groups checkboxes", () => {
    renderInvolvedParties();

    expect(screen.getByText("Barn (under 16 år)")).toBeInTheDocument();
    expect(screen.getByText("Elever/studenter")).toBeInTheDocument();
    expect(screen.getByText("Ansatte")).toBeInTheDocument();
    expect(screen.getByText("Innbyggere generelt")).toBeInTheDocument();
    expect(screen.getByText("Pasienter")).toBeInTheDocument();
    expect(screen.getByText("Sårbare grupper")).toBeInTheDocument();
    expect(screen.getByText("Søkere til tjenester")).toBeInTheDocument();
  });

  test("allows selecting multiple registered groups", () => {
    renderInvolvedParties();

    const childrenCheckbox = screen
      .getByText("Barn (under 16 år)")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    const employeesCheckbox = screen
      .getByText("Ansatte")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    fireEvent.click(childrenCheckbox);
    fireEvent.click(employeesCheckbox);

    expect(childrenCheckbox.checked).toBe(true);
    expect(employeesCheckbox.checked).toBe(true);
  });

  test("renders external processors switch", () => {
    renderInvolvedParties();

    expect(
      screen.getByText("Brukes eksterne leverandører/databehandlere?"),
    ).toBeInTheDocument();
    const neiElements = screen.getAllByText("Nei");
    expect(neiElements.length).toBeGreaterThan(0);
  });

  test("shows external processors textarea when switch is enabled", () => {
    renderInvolvedParties();

    const switches = screen.getAllByTestId("switch");
    const externalProcessorsSwitch = switches[0];

    expect(
      screen.queryByPlaceholderText(
        "Liste over eksterne som behandler data på kommunens vegne...",
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(externalProcessorsSwitch);

    expect(
      screen.getByPlaceholderText(
        "Liste over eksterne som behandler data på kommunens vegne...",
      ),
    ).toBeInTheDocument();
  });

  test("renders employee access section", () => {
    renderInvolvedParties();

    expect(
      screen.getByText("Hvor mange ansatte skal ha tilgang?"),
    ).toBeInTheDocument();
  });

  test("renders data sharing switch", () => {
    renderInvolvedParties();

    expect(
      screen.getByText("Deles data med andre organisasjoner?"),
    ).toBeInTheDocument();
  });

  test("allows deselecting registered groups", () => {
    renderInvolvedParties();

    const childrenCheckbox = screen
      .getByText("Barn (under 16 år)")
      .closest("label")
      ?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    fireEvent.click(childrenCheckbox);
    expect(childrenCheckbox.checked).toBe(true);

    fireEvent.click(childrenCheckbox);
    expect(childrenCheckbox.checked).toBe(false);
  });

  test("shows data sharing textarea when switch is enabled", () => {
    renderInvolvedParties();

    const switches = screen.getAllByTestId("switch");
    const dataShareSwitch = switches[1];

    expect(
      screen.queryByPlaceholderText(
        "F.eks. andre kommuner, statlige etater, private aktører...",
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(dataShareSwitch);

    expect(
      screen.getByPlaceholderText(
        "F.eks. andre kommuner, statlige etater, private aktører...",
      ),
    ).toBeInTheDocument();
  });
});
