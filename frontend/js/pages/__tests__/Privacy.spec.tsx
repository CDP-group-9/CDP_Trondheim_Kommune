import { render, screen } from "@testing-library/react";

import Privacy from "../Privacy";

jest.mock("components/dss", () => ({
  DssProgressBar: () => (
    <div data-testid="progressbar-component">ProgressBar Component</div>
  ),
  ContactInfoSection: () => (
    <div data-testid="contact-info-section">ContactInfoSection</div>
  ),
  ChecklistForHandlingPersonalDataSection: () => (
    <div data-testid="checklist-section">ChecklistSection</div>
  ),
  PersonalDataAndDataPrivacySection: () => (
    <div data-testid="personal-data-section">PersonalDataSection</div>
  ),
  ImpactAssessmentTemplateSection: () => (
    <div data-testid="impact-assessment-section">ImpactAssessmentSection</div>
  ),
  TypesOfPersonalDataSection: () => (
    <div data-testid="types-section">TypesSection</div>
  ),
  DataProtectionRightsSection: () => (
    <div data-testid="rights-section">RightsSection</div>
  ),
  PrinciplesOfDataProtectionSection: () => (
    <div data-testid="principles-section">PrinciplesSection</div>
  ),
}));

describe("Privacy", () => {
  test("renders the page heading", () => {
    render(<Privacy />);

    expect(
      screen.getByText("Informasjon om personvern og dette verktøyet"),
    ).toBeInTheDocument();
  });

  test("renders the page description", () => {
    render(<Privacy />);

    expect(
      screen.getByText(
        /Her kan du finne informasjon om personopplysninger, personvern/,
      ),
    ).toBeInTheDocument();
  });

  test("renders ProgressBar component", () => {
    render(<Privacy />);

    expect(screen.getByTestId("progressbar-component")).toBeInTheDocument();
  });

  test("renders PersonalDataAndDataPrivacySection", () => {
    render(<Privacy />);

    expect(screen.getByTestId("personal-data-section")).toBeInTheDocument();
  });

  test("renders TypesOfPersonalDataSection", () => {
    render(<Privacy />);

    expect(screen.getByTestId("types-section")).toBeInTheDocument();
  });

  test("renders DataProtectionRightsSection", () => {
    render(<Privacy />);

    expect(screen.getByTestId("rights-section")).toBeInTheDocument();
  });

  test("renders ChecklistForHandlingPersonalDataSection", () => {
    render(<Privacy />);

    expect(screen.getByTestId("checklist-section")).toBeInTheDocument();
  });

  test("renders ImpactAssessmentTemplateSection", () => {
    render(<Privacy />);

    expect(screen.getByTestId("impact-assessment-section")).toBeInTheDocument();
  });

  test("renders PrinciplesOfDataProtectionSection", () => {
    render(<Privacy />);

    expect(screen.getByTestId("principles-section")).toBeInTheDocument();
  });

  test("renders ContactInfoSection", () => {
    render(<Privacy />);

    expect(screen.getByTestId("contact-info-section")).toBeInTheDocument();
  });
});
