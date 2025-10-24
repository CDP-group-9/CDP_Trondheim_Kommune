import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { DssDynamicBreadcrumb } from "components/dss";

jest.mock("lucide-react", () => ({
  House: () => <div>House</div>,
  ChevronRight: () => <div>ChevronRight</div>,
}));

describe("DssDynamicBreadcrumb", () => {
  test("renders Home link at root path", () => {
    render(
      <MemoryRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
        initialEntries={["/"]}
      >
        <DssDynamicBreadcrumb />
      </MemoryRouter>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("renders breadcrumb trail with capitalized path parts", () => {
    render(
      <MemoryRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
        initialEntries={["/personvern/sjekkliste"]}
      >
        <DssDynamicBreadcrumb />
      </MemoryRouter>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Personvern")).toBeInTheDocument();
    expect(screen.getByText("Sjekkliste")).toBeInTheDocument();
  });

  test("applies custom className", () => {
    const { container } = render(
      <MemoryRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
        initialEntries={["/"]}
      >
        <DssDynamicBreadcrumb className="custom-class" />
      </MemoryRouter>,
    );

    expect(container.querySelector("nav")).toHaveClass("custom-class");
  });

  test("renders separator icons between breadcrumb items", () => {
    render(
      <MemoryRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
        initialEntries={["/personvern/test"]}
      >
        <DssDynamicBreadcrumb />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("ChevronRight").length).toBeGreaterThan(0);
  });
});
