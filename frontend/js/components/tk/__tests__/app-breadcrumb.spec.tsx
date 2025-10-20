import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { DynamicBreadcrumb } from "../app-breadcrumb";

jest.mock("lucide-react", () => ({
  House: () => <div>House</div>,
  ChevronRight: () => <div>ChevronRight</div>,
}));

describe("DynamicBreadcrumb", () => {
  test("renders Home link at root path", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <DynamicBreadcrumb />
      </MemoryRouter>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("renders breadcrumb trail with capitalized path parts", () => {
    render(
      <MemoryRouter initialEntries={["/personvern/sjekkliste"]}>
        <DynamicBreadcrumb />
      </MemoryRouter>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Personvern")).toBeInTheDocument();
    expect(screen.getByText("Sjekkliste")).toBeInTheDocument();
  });

  test("applies custom className", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <DynamicBreadcrumb className="custom-class" />
      </MemoryRouter>,
    );

    expect(container.querySelector("nav")).toHaveClass("custom-class");
  });

  test("renders separator icons between breadcrumb items", () => {
    render(
      <MemoryRouter initialEntries={["/personvern/test"]}>
        <DynamicBreadcrumb />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("ChevronRight").length).toBeGreaterThan(0);
  });
});
