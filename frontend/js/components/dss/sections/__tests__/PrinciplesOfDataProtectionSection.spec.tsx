import { render, screen } from "@testing-library/react";

import { PrinciplesOfDataProtectionSection } from "components/dss/sections";

jest.mock("lucide-react", () => ({
  ExternalLink: () => <div>ExternalLink</div>,
  SquareArrowOutUpRight: () => <div>SquareArrowOutUpRight</div>,
}));

describe("PrinciplesOfDataProtectionSection", () => {
  test("renders section heading", () => {
    render(<PrinciplesOfDataProtectionSection />);

    expect(
      screen.getByText("Grunnleggende personvernprinsipper"),
    ).toBeInTheDocument();
  });

  test("displays all seven GDPR principles", () => {
    render(<PrinciplesOfDataProtectionSection />);

    expect(
      screen.getByText("Lovlig, rettferdig og gjennomsiktig behandling"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Formålsbegrensning/)).toBeInTheDocument();
    expect(screen.getByText(/Dataminimering/)).toBeInTheDocument();
    expect(screen.getByText(/Riktighet/)).toBeInTheDocument();
    expect(screen.getByText(/Lagringsbegrensning/)).toBeInTheDocument();
    expect(
      screen.getByText(/Integritet og konfidensialitet/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Ansvarlighet/)).toBeInTheDocument();
  });

  test("displays principles description", () => {
    render(<PrinciplesOfDataProtectionSection />);

    expect(
      screen.getByText(/Alle virksomheter som behandler personopplysninger/i),
    ).toBeInTheDocument();
  });
});
