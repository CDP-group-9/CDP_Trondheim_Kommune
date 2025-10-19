import { render, screen, fireEvent } from "@testing-library/react";

import { Context } from "../checklist/context";

jest.mock("../../ui/select", () => ({
  Select: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select">{children}</div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <div>{placeholder}</div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <option value={value}>{children}</option>,
}));

jest.mock("../../ui/input", () => ({
  Input: ({ placeholder }: { placeholder?: string }) => (
    <input placeholder={placeholder} />
  ),
}));

jest.mock("../../ui/textarea", () => ({
  Textarea: ({ placeholder }: { placeholder?: string }) => (
    <textarea placeholder={placeholder} />
  ),
}));

describe("Context", () => {
  test("renders the section heading", () => {
    render(<Context />);

    expect(screen.getByText("Prosjekt/Initiativ Kontekst")).toBeInTheDocument();
  });

  test("renders project name input field", () => {
    render(<Context />);

    expect(
      screen.getByPlaceholderText(
        "F.eks. 'Digital Skoleportal - ny løsning for elevdata'",
      ),
    ).toBeInTheDocument();
  });

  test("renders department selection dropdown", () => {
    render(<Context />);

    expect(screen.getByText("Ansvarlig avdeling/enhet:")).toBeInTheDocument();
    expect(screen.getByText("Velg et alternativ...")).toBeInTheDocument();
  });

  test("renders all project status radio buttons", () => {
    render(<Context />);

    expect(screen.getByText("Planlegging")).toBeInTheDocument();
    expect(screen.getByText("Utvikling")).toBeInTheDocument();
    expect(screen.getByText("Testing")).toBeInTheDocument();
    expect(screen.getByText("Implementering")).toBeInTheDocument();
    expect(screen.getByText("Produksjon")).toBeInTheDocument();
  });

  test("allows selecting a project status", () => {
    render(<Context />);

    const planningRadio = screen
      .getByText("Planlegging")
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;
    fireEvent.click(planningRadio);
    expect(planningRadio.checked).toBe(true);

    const developmentRadio = screen
      .getByText("Utvikling")
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;
    fireEvent.click(developmentRadio);
    expect(developmentRadio.checked).toBe(true);

    const testingRadio = screen
      .getByText("Testing")
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;
    fireEvent.click(testingRadio);
    expect(testingRadio.checked).toBe(true);

    const implementationRadio = screen
      .getByText("Implementering")
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;
    fireEvent.click(implementationRadio);
    expect(implementationRadio.checked).toBe(true);

    const productionRadio = screen
      .getByText("Produksjon")
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;
    fireEvent.click(productionRadio);
    expect(productionRadio.checked).toBe(true);
  });

  test("only allows one status to be selected at a time", () => {
    render(<Context />);

    const planningRadio = screen
      .getByText("Planlegging")
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;
    const testingRadio = screen
      .getByText("Testing")
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;

    fireEvent.click(planningRadio);
    expect(planningRadio.checked).toBe(true);

    fireEvent.click(testingRadio);
    expect(testingRadio.checked).toBe(true);
    expect(planningRadio.checked).toBe(false);
  });
});
