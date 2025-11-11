import { render, screen } from "@testing-library/react";

import { TypesOfPersonalDataSection } from "components/dss/sections";

jest.mock("lucide-react", () => ({
  ExternalLink: () => <div>ExternalLink</div>,
  SquareArrowOutUpRight: () => <div>SquareArrowOutUpRight</div>,
}));

describe("TypesOfPersonalDataSection", () => {
  test("renders section heading", () => {
    render(<TypesOfPersonalDataSection />);

    expect(screen.getByText("Typer personopplysninger:")).toBeInTheDocument();
  });

  test("displays direct identifiable information", () => {
    render(<TypesOfPersonalDataSection />);

    expect(screen.getByText("Navn og personnummer")).toBeInTheDocument();
    expect(screen.getByText("Adresse og telefonnummer")).toBeInTheDocument();
    expect(screen.getByText("E-postadresse")).toBeInTheDocument();
  });

  test("displays indirect identifiable information", () => {
    render(<TypesOfPersonalDataSection />);

    expect(screen.getByText("IP-adresser og enhets-ID")).toBeInTheDocument();
    expect(
      screen.getByText("Kombinasjon av alder, yrke og bosted"),
    ).toBeInTheDocument();
  });

  test("displays sensitive data categories", () => {
    render(<TypesOfPersonalDataSection />);

    expect(
      screen.getByText("Rase eller etnisk opprinnelse"),
    ).toBeInTheDocument();
    expect(screen.getByText("Politiske meninger")).toBeInTheDocument();
    expect(screen.getByText("Helseopplysninger")).toBeInTheDocument();
  });

  test("has grid structure for direct and indirect categories", () => {
    const { container } = render(<TypesOfPersonalDataSection />);

    const grid = container.querySelector(".md\\:grid-cols-2");
    expect(grid).toBeInTheDocument();
  });
});
