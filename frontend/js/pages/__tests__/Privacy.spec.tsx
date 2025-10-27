import { render, screen } from "@testing-library/react";

import Privacy from "../Privacy";

jest.mock("components/dss/sections", () => ({
  PersonalDataSection: () => (
    <div data-testid="personal-data-section">PersonalDataSection</div>
  ),
  SensitiveDataSection: () => (
    <div data-testid="sensitive-data-section">SensitiveDataSection</div>
  ),
  DataSubjectRightsSection: () => (
    <div data-testid="data-subject-rights-section">
      DataSubjectRightsSection
    </div>
  ),
  KeyPrinciplesSection: () => (
    <div data-testid="key-principles-section">KeyPrinciplesSection</div>
  ),
  ContactInfoSection: () => (
    <div data-testid="contact-info-section">ContactInfoSection</div>
  ),
}));

jest.mock("components/dss/DssProgressBar", () => ({
  DssProgressBar: () => (
    <div data-testid="progressbar-component">ProgressBar Component</div>
  ),
}));

describe("Privacy", () => {
  test("renders the page heading", () => {
    render(<Privacy />);

    expect(
      screen.getByText("Generell informasjon om personopplysninger"),
    ).toBeInTheDocument();
  });

  test("renders the page description", () => {
    render(<Privacy />);

    expect(
      screen.getByText(
        /Grunnleggende informasjon om personopplysninger og personvern/,
      ),
    ).toBeInTheDocument();
  });

  test("renders ProgressBarUpdated component", () => {
    render(<Privacy />);

    expect(screen.getByTestId("progressbar-component")).toBeInTheDocument();
  });

  test("renders PersonalDataSection component", () => {
    render(<Privacy />);

    expect(screen.getByTestId("personal-data-section")).toBeInTheDocument();
  });

  test("renders SensitiveDataSection component", () => {
    render(<Privacy />);

    expect(screen.getByTestId("sensitive-data-section")).toBeInTheDocument();
  });

  test("renders DataSubjectRightsSection component", () => {
    render(<Privacy />);

    expect(
      screen.getByTestId("data-subject-rights-section"),
    ).toBeInTheDocument();
  });

  test("renders KeyPrinciplesSection component", () => {
    render(<Privacy />);

    expect(screen.getByTestId("key-principles-section")).toBeInTheDocument();
  });

  test("renders ContactInfoSection component", () => {
    render(<Privacy />);

    expect(screen.getByTestId("contact-info-section")).toBeInTheDocument();
  });

  test("renders all five privacy sections", () => {
    render(<Privacy />);

    expect(screen.getByTestId("personal-data-section")).toBeInTheDocument();
    expect(screen.getByTestId("sensitive-data-section")).toBeInTheDocument();
    expect(
      screen.getByTestId("data-subject-rights-section"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("key-principles-section")).toBeInTheDocument();
    expect(screen.getByTestId("contact-info-section")).toBeInTheDocument();
  });
});
