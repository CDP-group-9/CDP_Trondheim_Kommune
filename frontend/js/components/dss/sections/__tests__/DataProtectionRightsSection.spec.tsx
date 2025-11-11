import { render, screen } from "@testing-library/react";

import { DataProtectionRightsSection } from "components/dss/sections";

jest.mock("lucide-react", () => ({
  ExternalLink: () => <div>ExternalLink</div>,
  SquareArrowOutUpRight: () => <div>SquareArrowOutUpRight</div>,
}));

describe("DataProtectionRightsSection", () => {
  test("renders section heading", () => {
    render(<DataProtectionRightsSection />);

    expect(
      screen.getByText("Personopplysninger og den registrertes rettigheter"),
    ).toBeInTheDocument();
  });

  test("displays main description text", () => {
    render(<DataProtectionRightsSection />);

    expect(
      screen.getByText(/GDPR og personopplysningsloven fastsetter/i),
    ).toBeInTheDocument();
  });
});
