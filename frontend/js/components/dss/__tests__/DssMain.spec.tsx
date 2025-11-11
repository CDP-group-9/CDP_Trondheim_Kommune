import { render } from "@testing-library/react";

import { DssMain } from "../DssMain";

jest.mock("js/hooks/useSidebarSectionLayout", () => ({
  useSidebarSectionLayout: ({
    collapsedOverride,
  }: {
    collapsedOverride?: boolean;
  }) => ({
    computedStyle: { width: "100%" },
    isCollapsed: collapsedOverride ?? false,
  }),
}));

describe("DssMain", () => {
  test("renders main section with correct styling", () => {
    const { container } = render(<DssMain />);

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("flex-1");
    expect(section).toHaveClass("scroll-smooth");
    expect(section).toHaveAttribute("data-collapsed", "false");
  });

  test("applies data-collapsed attribute when isCollapsed is true", () => {
    const { container } = render(<DssMain isCollapsed />);

    const section = container.querySelector("section");
    expect(section).toHaveAttribute("data-collapsed", "true");
  });

  test("renders children correctly", () => {
    const { container } = render(
      <DssMain>
        <div>Test Content</div>
      </DssMain>,
    );

    expect(container.textContent).toBe("Test Content");
  });

  test("applies custom className", () => {
    const { container } = render(<DssMain className="custom-class" />);

    const section = container.querySelector("section");
    expect(section).toHaveClass("custom-class");
  });

  test("forwards ref correctly", () => {
    const ref = jest.fn();
    render(<DssMain ref={ref} />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });
});
