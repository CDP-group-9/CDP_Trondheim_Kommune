import { render, screen } from "@testing-library/react";

import { FourButtons } from "../app-four-buttons";

describe("FourButtons", () => {
  test("renders all four action buttons", () => {
    render(<FourButtons />);

    expect(
      screen.getByText("Hjelp meg med å starte en DPIA for et nytt prosjekt."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hvordan skal jeg anonymisere personvernopplysninger?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hvilke GDPR-krav gjelder for datainnsamling?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Gi meg en sjekkliste for personvernvurdering."),
    ).toBeInTheDocument();
  });

  test("all buttons are rendered as links", () => {
    render(<FourButtons />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(4);
  });

  test("all links have correct href attribute", () => {
    render(<FourButtons />);

    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "#");
    });
  });

  test("renders buttons in a grid layout", () => {
    const { container } = render(<FourButtons />);

    const gridContainer = container.querySelector(".grid-cols-2");
    expect(gridContainer).toBeInTheDocument();
  });
});
