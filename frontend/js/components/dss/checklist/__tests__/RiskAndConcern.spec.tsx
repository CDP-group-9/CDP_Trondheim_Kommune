import { render, screen, fireEvent } from "@testing-library/react";
import type {
  Dispatch,
  SetStateAction,
  TextareaHTMLAttributes,
} from "react";
import { useState } from "react";

import type { RiskConcernData } from "js/hooks/useChecklist";

import { RiskAndConcern } from "../index";

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

jest.mock("js/components/ui/textarea", () => ({
  Textarea: ({
    placeholder,
    value,
    onChange,
  }: {
    placeholder?: string;
    value?: string;
    onChange?: TextareaHTMLAttributes<HTMLTextAreaElement>["onChange"];
  }) => (
    <textarea placeholder={placeholder} value={value} onChange={onChange} />
  ),
}));

describe("RiskAndConcern", () => {
  const baseData: RiskConcernData = {
    privacyRisk: 1,
    unauthAccess: 1,
    dataLoss: 1,
    reidentification: 1,
    employeeConcern: false,
    writtenConcern: "",
    regulatoryConcern: "",
  };

  const renderRisk = (
    override?: Partial<Parameters<typeof RiskAndConcern>[0]>,
  ) => {
    const {
      riskConcernData: overrideData,
      onChange: overrideOnChange,
      ...restProps
    } = override ?? {};

    const Wrapper = () => {
      const [riskConcernData, setRiskConcernData] = useState<RiskConcernData>({
        ...baseData,
        ...overrideData,
      });

      const handleChange =
        overrideOnChange ??
        (setRiskConcernData as Dispatch<SetStateAction<RiskConcernData>>);

      return (
        <RiskAndConcern
          riskConcernData={riskConcernData}
          onChange={handleChange}
          {...restProps}
        />
      );
    };

    return render(<Wrapper />);
  };

  test("renders the section heading", () => {
    renderRisk();

    expect(screen.getByText("Risikoer og Bekymringer")).toBeInTheDocument();
  });

  test("renders privacy risk slider", () => {
    renderRisk();

    expect(
      screen.getByText("Samlet vurdering av personvernsrisiko"),
    ).toBeInTheDocument();
    const labels = screen.getAllByText("Svært lav (1)");
    expect(labels.length).toBeGreaterThan(0);
  });

  test("renders unauthorized access risk slider", () => {
    renderRisk();

    expect(
      screen.getByText("Risiko for uautorisert tilgang"),
    ).toBeInTheDocument();
  });

  test("renders data loss risk slider", () => {
    renderRisk();

    expect(screen.getByText("Risiko for datatap")).toBeInTheDocument();
  });

  test("renders re-identification risk slider", () => {
    renderRisk();

    expect(
      screen.getByText("Risiko for re-identifisering av anonymiserte data"),
    ).toBeInTheDocument();
  });

  test("displays correct risk labels", () => {
    renderRisk();

    const labels = screen.getAllByText("Svært lav (1)");
    expect(labels.length).toBeGreaterThan(0);
  });

  test("slider values can be changed", () => {
    renderRisk();

    const sliders = screen.getAllByTestId("slider");
    const firstSlider = sliders[0] as HTMLInputElement;

    fireEvent.change(firstSlider, { target: { value: "3" } });

    expect(screen.getByText("Moderat (3)")).toBeInTheDocument();
  });

  test("renders employee concern switch", () => {
    renderRisk();

    expect(
      screen.getByText("Er det bekymringer fra registrerte eller ansatte?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Nei")).toBeInTheDocument();
  });

  test("renders regulatory concern section", () => {
    renderRisk();

    expect(
      screen.getByText("Bekymringer om regelverksetterlevelse:"),
    ).toBeInTheDocument();
  });

  test("shows employee concern textarea when switch is enabled", () => {
    renderRisk();

    const switches = screen.getAllByTestId("switch");
    const employeeConcernSwitch = switches[0];

    fireEvent.click(employeeConcernSwitch);

    expect(
      screen.getByPlaceholderText("Innspill eller bekymringer som er reist..."),
    ).toBeInTheDocument();
  });

  test("can change all slider values to different levels", () => {
    renderRisk();

    const sliders = screen.getAllByTestId("slider");

    fireEvent.change(sliders[1], { target: { value: "2" } });
    expect(screen.getByText("Lav (2)")).toBeInTheDocument();

    fireEvent.change(sliders[2], { target: { value: "4" } });
    expect(screen.getByText("Høy (4)")).toBeInTheDocument();

    fireEvent.change(sliders[3], { target: { value: "5" } });
    expect(screen.getByText("Svært høy (5)")).toBeInTheDocument();
  });

  test("handles regulatory concern textarea input", () => {
    renderRisk();

    const textarea = screen.getByPlaceholderText(
      "Områder hvor dere er usikre på lovlighet...",
    );
    fireEvent.change(textarea, {
      target: { value: "Usikker på riktig lagringsfrist" },
    });

    expect(textarea).toHaveValue("Usikker på riktig lagringsfrist");
  });
});
