import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { DssHeader } from "../DssHeader";

const mockUpdateInternalStatus = jest.fn();

jest.mock("js/hooks/useInternalStatus", () => ({
  useInternalStatus: () => ({
    isInternal: false,
    updateInternalStatus: mockUpdateInternalStatus,
  }),
}));

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

jest.mock("../DssDynamicBreadcrumb", () => ({
  DssDynamicBreadcrumb: () => <div>Breadcrumb</div>,
}));

jest.mock("../../../../assets/images/tk-logo-wide.svg", () => "tk-logo.svg");

const renderWithRouter = (component: React.ReactElement) =>
  render(
    <MemoryRouter
      future={{
        // eslint-disable-next-line camelcase
        v7_startTransition: true,
        // eslint-disable-next-line camelcase
        v7_relativeSplatPath: true,
      }}
    >
      {component}
    </MemoryRouter>,
  );

describe("DssHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Trondheim Kommune logo with link", () => {
    renderWithRouter(<DssHeader />);

    const logoLink = screen.getByLabelText(
      "Gå til Trondheim Kommune sin hjemmeside (åpner i ny fane)",
    );
    expect(logoLink).toHaveAttribute(
      "href",
      "https://www.trondheim.kommune.no/",
    );
    expect(logoLink).toHaveAttribute("target", "_blank");

    const logo = screen.getByAltText("Trondheim Kommunes logo");
    expect(logo).toHaveAttribute("src", "tk-logo.svg");
  });

  test("renders breadcrumb component", () => {
    renderWithRouter(<DssHeader />);

    expect(screen.getByText("Breadcrumb")).toBeInTheDocument();
  });

  test("renders internal status switch with correct label when external", () => {
    renderWithRouter(<DssHeader />);

    expect(
      screen.getByText("Ikke ansatt i Trondheim kommune"),
    ).toBeInTheDocument();
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).not.toBeChecked();
  });

  test("calls updateInternalStatus when switch is toggled", () => {
    renderWithRouter(<DssHeader />);

    const switchElement = screen.getByRole("switch");
    fireEvent.click(switchElement);

    expect(mockUpdateInternalStatus).toHaveBeenCalledWith(true);
  });

  test("renders custom brand when provided", () => {
    renderWithRouter(<DssHeader brand={<div>Custom Brand</div>} />);

    expect(screen.getByText("Custom Brand")).toBeInTheDocument();
    expect(
      screen.queryByAltText("Trondheim Kommunes logo"),
    ).not.toBeInTheDocument();
  });

  test("applies data-collapsed attribute correctly", () => {
    const { container } = renderWithRouter(<DssHeader isCollapsed />);

    const header = container.querySelector("header");
    expect(header).toHaveAttribute("data-collapsed", "true");
  });

  test("applies custom className", () => {
    const { container } = renderWithRouter(
      <DssHeader className="custom-class" />,
    );

    const header = container.querySelector("header");
    expect(header).toHaveClass("custom-class");
  });

  test("forwards ref correctly", () => {
    const ref = jest.fn();
    render(<DssHeader ref={ref} />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLElement));
  });
});
