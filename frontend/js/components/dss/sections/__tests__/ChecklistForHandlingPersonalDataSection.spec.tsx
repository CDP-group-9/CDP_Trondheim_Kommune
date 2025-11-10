import { render, screen } from "@testing-library/react";

import { ChecklistForHandlingPersonalDataSection } from "components/dss/sections";

jest.mock("lucide-react", () => ({
  ExternalLink: () => <div>ExternalLink</div>,
  SquareArrowOutUpRight: () => <div>SquareArrowOutUpRight</div>,
}));

describe("ChecklistForHandlingPersonalDataSection", () => {
  test("renders section heading", () => {
    render(<ChecklistForHandlingPersonalDataSection />);

    expect(
      screen.getByText("Sjekkliste for behandling av persondata"),
    ).toBeInTheDocument();
  });

  test("displays introduction text", () => {
    render(<ChecklistForHandlingPersonalDataSection />);

    expect(
      screen.getByText(/Virksomheter som behandler personopplysninger/i),
    ).toBeInTheDocument();
  });

  test("displays all checklist items", () => {
    render(<ChecklistForHandlingPersonalDataSection />);

    expect(
      screen.getByText(/Sett dere inn i personvernprinsippene/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Kartlegg hvilke typer personopplysninger/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Definer formålet med behandlingen/i),
    ).toBeInTheDocument();
  });

  test("displays link to Datatilsynet", () => {
    render(<ChecklistForHandlingPersonalDataSection />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      "https://www.datatilsynet.no/rettigheter-og-plikter/virksomhetenes-plikter/sjekkliste/",
    );
  });
});
