import { render, screen } from "@testing-library/react";

import { ContactInfoSection } from "components/dss/sections";

jest.mock("lucide-react", () => ({
  ExternalLink: () => <div>ExternalLink</div>,
  SquareArrowOutUpRight: () => <div>SquareArrowOutUpRight</div>,
}));

describe("ContactInfoSection", () => {
  test("renders section heading", () => {
    render(<ContactInfoSection />);

    expect(screen.getByText("Har du andre spørsmål?")).toBeInTheDocument();
  });

  test("displays personvernombud information", () => {
    render(<ContactInfoSection />);

    expect(
      screen.getByText("Personvernombud Trondheim Kommune"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("personvernombud@trondheim.kommune.no"),
    ).toBeInTheDocument();
    expect(screen.getByText("72 54 00 00")).toBeInTheDocument();
  });

  test("displays link to privacy law", () => {
    render(<ContactInfoSection />);

    const links = screen.getAllByRole("link");
    const privacyLawLink = links.find((link) =>
      link.textContent?.includes("Lov om personvern"),
    );
    expect(privacyLawLink).toBeDefined();
    expect(privacyLawLink).toHaveAttribute(
      "href",
      "https://lovdata.no/dokument/NL/lov/2018-06-15-38",
    );
  });
});
