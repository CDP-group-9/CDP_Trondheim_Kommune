import { render, screen, fireEvent } from "@testing-library/react";

import { RiskAndConcern } from "../checklist/riskAndConcern";

jest.mock("js/components/ui/slider", () => ({
  Slider: ({
    value,
    onValueChange,
    min,
    max,
  }: {
    value: number[];
    onValueChange: (value: number[]) => void;
    min: number;
    max: number;
  }) => (
    <input
      data-testid="slider"
      max={max}
      min={min}
      type="range"
      value={value[0]}
      onChange={(e) => onValueChange([parseInt(e.target.value, 10)])}
    />
  ),
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
      onChange={(e) => onCheckedChange(e.target.checked)}
    />
  ),
}));

jest.mock("../../ui/textarea", () => ({
  Textarea: ({
    placeholder,
    value,
    onChange,
  }: {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  }) => (
    <textarea placeholder={placeholder} value={value} onChange={onChange} />
  ),
}));

describe("RiskAndConcern", () => {
  test("renders the section heading", () => {
    render(<RiskAndConcern />);

    expect(screen.getByText("Risikoer og Bekymringer")).toBeInTheDocument();
  });

  test("renders privacy risk slider", () => {
    render(<RiskAndConcern />);

    expect(
      screen.getByText("Samlet vurdering av personvernsrisiko"),
    ).toBeInTheDocument();
    const labels = screen.getAllByText("Svært lav (1)");
    expect(labels.length).toBeGreaterThan(0);
  });

  test("renders unauthorized access risk slider", () => {
    render(<RiskAndConcern />);

    expect(
      screen.getByText("Risiko for uautorisert tilgang"),
    ).toBeInTheDocument();
  });

  test("renders data loss risk slider", () => {
    render(<RiskAndConcern />);

    expect(screen.getByText("Risiko for datatap")).toBeInTheDocument();
  });

  test("renders re-identification risk slider", () => {
    render(<RiskAndConcern />);

    expect(
      screen.getByText("Risiko for re-identifisering av anonymiserte data"),
    ).toBeInTheDocument();
  });

  test("displays correct risk labels", () => {
    render(<RiskAndConcern />);

    const labels = screen.getAllByText("Svært lav (1)");
    expect(labels.length).toBeGreaterThan(0);
  });

  test("slider values can be changed", () => {
    render(<RiskAndConcern />);

    const sliders = screen.getAllByTestId("slider");
    const firstSlider = sliders[0] as HTMLInputElement;

    fireEvent.change(firstSlider, { target: { value: "3" } });

    expect(screen.getByText("Moderat (3)")).toBeInTheDocument();
  });

  test("renders employee concern switch", () => {
    render(<RiskAndConcern />);

    expect(
      screen.getByText("Er det bekymringer fra registrerte eller ansatte?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Nei")).toBeInTheDocument();
  });

  test("renders regulatory concern section", () => {
    render(<RiskAndConcern />);

    expect(
      screen.getByText("Bekymringer om regelverksetterlevelse:"),
    ).toBeInTheDocument();
  });

  test("shows employee concern textarea when switch is enabled", () => {
    render(<RiskAndConcern />);

    const switches = screen.getAllByTestId("switch");
    const employeeConcernSwitch = switches[0];

    fireEvent.click(employeeConcernSwitch);

    expect(
      screen.getByPlaceholderText("Innspill eller bekymringer som er reist..."),
    ).toBeInTheDocument();
  });

  test("can change all slider values to different levels", () => {
    render(<RiskAndConcern />);

    const sliders = screen.getAllByTestId("slider");

    fireEvent.change(sliders[1], { target: { value: "2" } });
    expect(screen.getByText("Lav (2)")).toBeInTheDocument();

    fireEvent.change(sliders[2], { target: { value: "4" } });
    expect(screen.getByText("Høy (4)")).toBeInTheDocument();

    fireEvent.change(sliders[3], { target: { value: "5" } });
    expect(screen.getByText("Svært høy (5)")).toBeInTheDocument();
  });

  test("handles regulatory concern textarea input", () => {
    render(<RiskAndConcern />);

    const textarea = screen.getByPlaceholderText(
      "Områder hvor dere er usikre på lovlighet...",
    );
    fireEvent.change(textarea, {
      target: { value: "Usikker på riktig lagringsfrist" },
    });

    expect(textarea).toHaveValue("Usikker på riktig lagringsfrist");
  });
});
