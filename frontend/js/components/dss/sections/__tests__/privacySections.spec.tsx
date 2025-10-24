import { render, screen } from "@testing-library/react";

import { PersonalDataSection, SensitiveDataSection, DataSubjectRightsSection, KeyPrinciplesSection, ContactInfoSection } from "components/dss/sections";

jest.mock("lucide-react", () => ({
  ExternalLink: () => <div>ExternalLink</div>,
}));

describe("sections folder", () => {
  describe("PersonalDataSection", () => {
    test("renders section heading", () => {
      render(<PersonalDataSection />);

      expect(
        screen.getByText("Hva er personopplysninger?"),
      ).toBeInTheDocument();
    });

    test("displays direct identifiable information", () => {
      render(<PersonalDataSection />);

      expect(screen.getByText("Navn og personnummer")).toBeInTheDocument();
      expect(screen.getByText("Adresse og telefonnummer")).toBeInTheDocument();
      expect(screen.getByText("E-postadresse")).toBeInTheDocument();
    });

    test("displays indirect identifiable information", () => {
      render(<PersonalDataSection />);

      expect(screen.getByText("IP-adresser og enhets-ID")).toBeInTheDocument();
      expect(
        screen.getByText("Kombinasjon av alder, yrke og bosted"),
      ).toBeInTheDocument();
    });

    test("has correct structure with two columns", () => {
      const { container } = render(<PersonalDataSection />);

      const grid = container.querySelector(".md\\:grid-cols-2");
      expect(grid).toBeInTheDocument();
    });
  });

  describe("SensitiveDataSection", () => {
    test("renders section heading", () => {
      render(<SensitiveDataSection />);

      expect(
        screen.getByText("Særlige kategorier personopplysninger"),
      ).toBeInTheDocument();
    });

    test("displays sensitive data categories", () => {
      render(<SensitiveDataSection />);

      expect(
        screen.getByText(/Rase eller etnisk opprinnelse/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Politiske meninger/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Religiøse eller filosofiske oppfatninger/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Fagforeningsmedlemskap/i)).toBeInTheDocument();
      expect(screen.getByText(/Helseopplysninger/i)).toBeInTheDocument();
    });

    test("has warning styling", () => {
      const { container } = render(<SensitiveDataSection />);

      const warningBox = container.querySelector(".border-destructive\\/20");
      expect(warningBox).toBeInTheDocument();
    });
  });

  describe("DataSubjectRightsSection", () => {
    test("renders section heading", () => {
      render(<DataSubjectRightsSection />);

      expect(
        screen.getByText("De registrertes rettigheter"),
      ).toBeInTheDocument();
    });

    test("displays main description text", () => {
      render(<DataSubjectRightsSection />);

      expect(
        screen.getByText(/Personer har flere rettigheter/i),
      ).toBeInTheDocument();
    });
  });

  describe("KeyPrinciplesSection", () => {
    test("renders section heading", () => {
      render(<KeyPrinciplesSection />);

      expect(
        screen.getByText("Grunnprinsipper for personvernbehandling"),
      ).toBeInTheDocument();
    });

    test("displays all seven GDPR principles", () => {
      render(<KeyPrinciplesSection />);

      expect(
        screen.getByText("Lovlighet, rettferdighet og gjennomsiktig"),
      ).toBeInTheDocument();
      expect(screen.getByText("Formålsbegrensning")).toBeInTheDocument();
      expect(screen.getByText("Dataminimering")).toBeInTheDocument();
      expect(screen.getByText("Riktighet")).toBeInTheDocument();
      expect(screen.getByText("Lagringsbegrensning")).toBeInTheDocument();
      expect(
        screen.getByText("Integritet og konfidensialitet"),
      ).toBeInTheDocument();
      expect(screen.getByText("Ansvarlighet")).toBeInTheDocument();
    });

    test("displays GDPR principles description", () => {
      render(<KeyPrinciplesSection />);

      expect(
        screen.getByText(/GDPR bygger på syv grunnprinsipper/i),
      ).toBeInTheDocument();
    });
  });

  describe("ContactInfoSection", () => {
    test("renders section heading", () => {
      render(<ContactInfoSection />);

      expect(screen.getByText("Trenger du mer hjelp?")).toBeInTheDocument();
    });

    test("displays personvernombud information", () => {
      render(<ContactInfoSection />);

      expect(
        screen.getByText("Personvernombud Trondheim Kommune"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("E-post: personvernombud@trondheim.kommune.no"),
      ).toBeInTheDocument();
      expect(screen.getByText("Telefon: 73 83 00 00")).toBeInTheDocument();
    });

    test("displays link to privacy law", () => {
      render(<ContactInfoSection />);

      expect(screen.getByText("Lov om personvern")).toBeInTheDocument();
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "href",
        "https://lovdata.no/dokument/NL/lov/2018-06-15-38",
      );
    });
  });
});
