import { render, screen } from "@testing-library/react";

import { DssFooter } from "../DssFooter";

describe("DssFooter", () => {
  test("renders footer with disclaimer text", () => {
    const { container } = render(<DssFooter />);

    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();

    expect(
      screen.getByText(
        "Dette verktøyet kan gi feil informasjon. Alle råd, oppfordringer eller opplysninger som systemet gir, må vurderes av en relevant fagperson før videre behandling.",
      ),
    ).toBeInTheDocument();
  });
});
