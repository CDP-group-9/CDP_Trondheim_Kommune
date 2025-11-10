import { render, screen } from "@testing-library/react";

import { ImpactAssessmentTemplateSection } from "components/dss/sections";

jest.mock("lucide-react", () => ({
  ExternalLink: () => <div>ExternalLink</div>,
  SquareArrowOutUpRight: () => <div>SquareArrowOutUpRight</div>,
}));

describe("ImpactAssessmentTemplateSection", () => {
  test("renders section heading", () => {
    render(<ImpactAssessmentTemplateSection />);

    expect(
      screen.getByText("Data Protection Impact Assessment (DPIA)"),
    ).toBeInTheDocument();
  });

  test("displays DPIA description", () => {
    render(<ImpactAssessmentTemplateSection />);

    expect(
      screen.getByText(/En personvernkonsekvensvurdering/i),
    ).toBeInTheDocument();
  });

  test("displays when DPIA is necessary", () => {
    render(<ImpactAssessmentTemplateSection />);

    expect(screen.getByText("Når er den nødvendig?")).toBeInTheDocument();
    expect(
      screen.getByText(/Når behandling «sannsynligvis gir høy risiko»/i),
    ).toBeInTheDocument();
  });

  test("displays main DPIA steps", () => {
    render(<ImpactAssessmentTemplateSection />);

    expect(screen.getByText("Hovedtrinnene for en DPIA")).toBeInTheDocument();
    expect(
      screen.getByText(/Kartlegg og beskriv den planlagte behandlingen/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Vurder risikoene/i)).toBeInTheDocument();
  });

  test("displays link to Helsedirektoratet guide", () => {
    render(<ImpactAssessmentTemplateSection />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("helsedirektoratet.no"),
    );
  });
});
