import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { DynamicBreadcrumb } from "../app-breadcrumb";

jest.mock("lucide-react", () => ({
  ChevronRight: () => <div>ChevronRight</div>,
}));

describe("DynamicBreadcrumb", () => {
  test("renders Home link when at root path", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <DynamicBreadcrumb />
      </MemoryRouter>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("renders breadcrumb trail for nested path", () => {
    render(
      <MemoryRouter initialEntries={["/personvern/sjekkliste"]}>
        <DynamicBreadcrumb />
      </MemoryRouter>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Personvern")).toBeInTheDocument();
    expect(screen.getByText("Sjekkliste")).toBeInTheDocument();
  });

  test("capitalizes first letter of path parts", () => {
    render(
      <MemoryRouter initialEntries={["/eksempel"]}>
        <DynamicBreadcrumb />
      </MemoryRouter>,
    );

    expect(screen.getByText("Eksempel")).toBeInTheDocument();
  });

  test("applies custom className when provided", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <DynamicBreadcrumb className="custom-class" />
      </MemoryRouter>,
    );

    const breadcrumb = container.querySelector("nav");
    expect(breadcrumb).toHaveClass("custom-class");
  });

  test("renders separator icons between breadcrumb items", () => {
    render(
      <MemoryRouter initialEntries={["/personvern/test"]}>
        <DynamicBreadcrumb />
      </MemoryRouter>,
    );

    const separators = screen.getAllByText("ChevronRight");
    expect(separators.length).toBeGreaterThan(0);
  });
});
