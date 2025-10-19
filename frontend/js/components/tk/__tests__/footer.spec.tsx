import { render, screen } from "@testing-library/react";

import Footer from "../footer";

describe("Footer", () => {
  test("renders footer element", () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  test("displays disclaimer text", () => {
    render(<Footer />);

    expect(
      screen.getByText(/Dette verktøyet kan gi feil informasjon/i),
    ).toBeInTheDocument();
  });

  test("displays complete disclaimer message", () => {
    render(<Footer />);

    const disclaimerText =
      "Dette verktøyet kan gi feil informasjon. Alle råd, oppfordringer eller opplysninger som systemet gir, må vurderes av en relevant fagperson før videre behandling.";

    expect(screen.getByText(disclaimerText)).toBeInTheDocument();
  });

  test("has correct styling classes", () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("w-full");
    expect(footer).toHaveClass("bg-gray-100");
    expect(footer).toHaveClass("text-center");
  });
});
