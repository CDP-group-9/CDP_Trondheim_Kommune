import { render, screen } from "@testing-library/react";

import { DssFooter } from "../DssFooter";

jest.mock("js/hooks/useSidebarSectionLayout", () => ({
  useSidebarSectionLayout: ({
    collapsedOverride,
  }: {
    collapsedOverride?: boolean;
  }) => ({
    computedStyle: {},
    isCollapsed: collapsedOverride ?? false,
  }),
}));

describe("DssFooter", () => {
  test("renders footer with disclaimer text", () => {
    render(<DssFooter />);

    expect(
      screen.getByText(
        "Dette verktøyet kan gi feil informasjon. Alle råd, oppfordringer eller opplysninger som systemet gir, må vurderes av en relevant fagperson før videre behandling.",
      ),
    ).toBeInTheDocument();
  });

  test("renders custom children when provided", () => {
    render(<DssFooter>Custom footer content</DssFooter>);

    expect(screen.getByText("Custom footer content")).toBeInTheDocument();
  });

  test("applies collapsed state when isCollapsed is true", () => {
    const { container } = render(<DssFooter isCollapsed />);

    const footer = container.querySelector("footer");
    expect(footer).toHaveAttribute("data-collapsed", "true");
  });

  test("applies custom className", () => {
    const { container } = render(
      <DssFooter className="custom-class">Test</DssFooter>,
    );

    const footer = container.querySelector("footer");
    expect(footer).toHaveClass("custom-class");
  });

  test("forwards ref correctly", () => {
    const ref = jest.fn();
    render(<DssFooter ref={ref} />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });
});
