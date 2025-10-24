import { render, screen, fireEvent } from "@testing-library/react";

import { InvolvedParties } from "../index";

jest.mock("js/components/ui/select", () => ({
  Select: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select">{children}</div>
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

jest.mock("components/ui/switch", () => ({
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
      onChange={(e) => onCheckedChange(e.target.checked)}
    />
  ),
}));

jest.mock("components/ui/textarea", () => ({
  Textarea: ({ placeholder }: { placeholder?: string }) => (
    <textarea placeholder={placeholder} />
  ),
}));

describe("InvolvedParties", () => {
  test("renders the section heading", () => {
    render(<InvolvedParties />);

    expect(screen.getByText("Involverte Parter")).toBeInTheDocument();
  });

  test("renders all registered groups checkboxes", () => {
    render(<InvolvedParties />);

    expect(screen.getByText("Barn (under 16 år)")).toBeInTheDocument();
    expect(screen.getByText("Elever/studenter")).toBeInTheDocument();
    expect(screen.getByText("Ansatte")).toBeInTheDocument();
    expect(screen.getByText("Innbyggere generelt")).toBeInTheDocument();
    expect(screen.getByText("Pasienter")).toBeInTheDocument();
    expect(screen.getByText("Sårbare grupper")).toBeInTheDocument();
    expect(screen.getByText("Søkere til tjenester")).toBeInTheDocument();
  });

  test("allows selecting multiple registered groups", () => {
    render(<InvolvedParties />);

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
    render(<InvolvedParties />);

    expect(
      screen.getByText("Brukes eksterne leverandører/databehandlere?"),
    ).toBeInTheDocument();
    const neiElements = screen.getAllByText("Nei");
    expect(neiElements.length).toBeGreaterThan(0);
  });

  test("shows external processors textarea when switch is enabled", () => {
    render(<InvolvedParties />);

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
    render(<InvolvedParties />);

    expect(
      screen.getByText("Hvor mange ansatte skal ha tilgang?"),
    ).toBeInTheDocument();
  });

  test("renders data sharing switch", () => {
    render(<InvolvedParties />);

    expect(
      screen.getByText("Deles data med andre organisasjoner?"),
    ).toBeInTheDocument();
  });

  test("allows deselecting registered groups", () => {
    render(<InvolvedParties />);

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
    render(<InvolvedParties />);

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
