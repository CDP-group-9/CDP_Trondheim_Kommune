import { render, screen } from "@testing-library/react";

import { PersonalDataAndDataPrivacySection } from "components/dss/sections";

jest.mock("lucide-react", () => ({
  ExternalLink: () => <div>ExternalLink</div>,
  SquareArrowOutUpRight: () => <div>SquareArrowOutUpRight</div>,
}));

describe("PersonalDataAndDataPrivacySection", () => {
  test("renders section heading", () => {
    render(<PersonalDataAndDataPrivacySection />);

    expect(screen.getByText("Hva er en personopplysning?")).toBeInTheDocument();
  });

  test("displays description text", () => {
    render(<PersonalDataAndDataPrivacySection />);

    expect(
      screen.getByText(/En personopplysning er enhver opplysning/i),
    ).toBeInTheDocument();
  });

  test("displays privacy heading", () => {
    render(<PersonalDataAndDataPrivacySection />);

    expect(screen.getByText("Hva betyr personvern?")).toBeInTheDocument();
  });

  test("has correct structure with two columns", () => {
    const { container } = render(<PersonalDataAndDataPrivacySection />);

    const grid = container.querySelector(".md\\:grid-cols-2");
    expect(grid).toBeInTheDocument();
  });
});
