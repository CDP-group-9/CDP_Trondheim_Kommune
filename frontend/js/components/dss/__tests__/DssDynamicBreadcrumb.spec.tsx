import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { DssDynamicBreadcrumb } from "components/dss";

jest.mock("lucide-react", () => ({
  House: () => <div>House</div>,
  ChevronRight: () => <div>ChevronRight</div>,
}));

const renderWithRouter = (path: string, component: React.ReactElement) =>
  render(
    <MemoryRouter
      future={{
        // eslint-disable-next-line camelcase
        v7_startTransition: true,
        // eslint-disable-next-line camelcase
        v7_relativeSplatPath: true,
      }}
      initialEntries={[path]}
    >
      {component}
    </MemoryRouter>,
  );

describe("DssDynamicBreadcrumb", () => {
  test("renders breadcrumb trail with capitalized path parts", () => {
    renderWithRouter("/personvern/sjekkliste", <DssDynamicBreadcrumb />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Personvern")).toBeInTheDocument();
    expect(screen.getByText("Sjekkliste")).toBeInTheDocument();
  });

  test("applies custom className", () => {
    const { container } = renderWithRouter(
      "/",
      <DssDynamicBreadcrumb className="custom-class" />,
    );

    expect(container.querySelector("nav")).toHaveClass("custom-class");
  });

  test("renders separator icons between breadcrumb items", () => {
    renderWithRouter("/personvern/test", <DssDynamicBreadcrumb />);

    expect(screen.getAllByText("ChevronRight").length).toBeGreaterThan(0);
  });
});
