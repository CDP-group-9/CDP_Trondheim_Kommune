import { render, screen, fireEvent } from "@testing-library/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import Checklist from "../Checklist";

const originalFetch = global.fetch;
const mockFetch = jest.fn();

jest.mock("components/dss/checklist/Context", () => ({
  Context: () => <div data-testid="context-component">Context Component</div>,
}));

jest.mock("components/dss/checklist/Data", () => ({
  Data: ({ selectedOption }: { selectedOption: "motta" | "dele" }) => (
    <div data-testid="data-component">Data Component - {selectedOption}</div>
  ),
}));

jest.mock("components/dss/checklist/InvolvedParties", () => ({
  InvolvedParties: () => (
    <div data-testid="involved-parties-component">
      InvolvedParties Component
    </div>
  ),
}));

jest.mock("components/dss/checklist/Legal", () => ({
  Legal: () => <div data-testid="legal-component">Legal Component</div>,
}));

jest.mock("components/dss/checklist/ReceiveOrShareData", () => ({
  ReceiveOrShareData: ({
    selected,
    onSelect,
  }: {
    selected: "motta" | "dele" | null;
    onSelect: (value: "motta" | "dele" | null) => void;
  }) => (
    <div data-testid="receive-or-share-component">
      <button
        type="button"
        onClick={() => onSelect(selected === "motta" ? null : "motta")}
      >
        Motta
      </button>
      <button
        type="button"
        onClick={() => onSelect(selected === "dele" ? null : "dele")}
      >
        Dele
      </button>
      {selected && <div>Selected: {selected}</div>}
    </div>
  ),
}));

jest.mock("components/dss/checklist/RiskAndConcern", () => ({
  RiskAndConcern: () => (
    <div data-testid="risk-and-concern-component">RiskAndConcern Component</div>
  ),
}));

jest.mock("components/dss/checklist/Tech", () => ({
  Tech: () => <div data-testid="tech-component">Tech Component</div>,
}));

jest.mock("components/dss/DssProgressBar", () => ({
  DssProgressBar: () => (
    <div data-testid="progressbar-component">ProgressBar Component</div>
  ),
}));

jest.mock("components/ui/button", () => ({
  Button: ({ children, onClick, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) => (
    <button type="button" onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}));

describe("Checklist", () => {
  const originalLocation = window.location;
  const mockReload = jest.fn();

  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);
    (global as typeof globalThis & { fetch: typeof fetch }).fetch =
      mockFetch as unknown as typeof fetch;

    Object.defineProperty(window, "location", {
      value: {
        ...originalLocation,
        reload: mockReload,
      },
      writable: true,
    });
  });

  afterEach(() => {
    mockReload.mockClear();
    mockFetch.mockReset();
    (global as typeof globalThis & { fetch: typeof fetch }).fetch =
      originalFetch;
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  test("renders the page heading and description", () => {
    renderChecklist();

    expect(screen.getByText("Personvernsjekkliste")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Systematisk gjennomgang av alle personvernkrav for ditt prosjekt",
      ),
    ).toBeInTheDocument();
  });

  test("renders ProgressBarUpdated component", () => {
    renderChecklist();

    expect(screen.getByTestId("progressbar-component")).toBeInTheDocument();
  });

  test("renders ReceiveOrShareData component", () => {
    renderChecklist();

    expect(
      screen.getByTestId("receive-or-share-component"),
    ).toBeInTheDocument();
  });

  test("does not render checklist components initially", () => {
    renderChecklist();

    expect(screen.queryByTestId("context-component")).not.toBeInTheDocument();
    expect(screen.queryByTestId("data-component")).not.toBeInTheDocument();
    expect(screen.queryByTestId("legal-component")).not.toBeInTheDocument();
  });

  test("renders checklist components when receive option is selected", () => {
    renderChecklist();

    const receiveButton = screen.getByText("Motta");
    fireEvent.click(receiveButton);

    expect(screen.getByTestId("context-component")).toBeInTheDocument();
    expect(screen.getByTestId("data-component")).toBeInTheDocument();
    expect(screen.getByTestId("legal-component")).toBeInTheDocument();
    expect(
      screen.getByTestId("involved-parties-component"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("tech-component")).toBeInTheDocument();
    expect(
      screen.getByTestId("risk-and-concern-component"),
    ).toBeInTheDocument();
  });

  test("renders checklist components when share option is selected", () => {
    renderChecklist();

    const shareButton = screen.getByText("Dele");
    fireEvent.click(shareButton);

    expect(screen.getByTestId("context-component")).toBeInTheDocument();
    expect(screen.getByTestId("data-component")).toBeInTheDocument();
    expect(screen.getByTestId("legal-component")).toBeInTheDocument();
    expect(
      screen.getByTestId("involved-parties-component"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("tech-component")).toBeInTheDocument();
    expect(
      screen.getByTestId("risk-and-concern-component"),
    ).toBeInTheDocument();
  });

  test("passes selectedOption to Data component", () => {
    renderChecklist();

    const receiveButton = screen.getByText("Motta");
    fireEvent.click(receiveButton);

    expect(screen.getByText("Data Component - motta")).toBeInTheDocument();
  });

  test("renders helper text when option is selected", () => {
    renderChecklist();

    const receiveButton = screen.getByText("Motta");
    fireEvent.click(receiveButton);

    expect(
      screen.getByText(/Fyll ut informasjonen nedenfor/),
    ).toBeInTheDocument();
  });

  test("renders action buttons when option is selected", () => {
    renderChecklist();

    const receiveButton = screen.getByText("Motta");
    fireEvent.click(receiveButton);

    expect(screen.getByText("Nullstill skjema")).toBeInTheDocument();
    expect(screen.getByText("Generer veiledning")).toBeInTheDocument();
  });

  test("nullstill skjema button reloads the page", () => {
    renderChecklist();

    const receiveButton = screen.getByText("Motta");
    fireEvent.click(receiveButton);

    const resetButton = screen.getByText("Nullstill skjema");
    fireEvent.click(resetButton);

    expect(window.location.reload).toHaveBeenCalledWith();
  });

  test("generer veiledning button is clickable", () => {
    renderChecklist();

    const receiveButton = screen.getByText("Motta");
    fireEvent.click(receiveButton);

    const generateButton = screen.getByText("Generer veiledning");
    expect(generateButton).toBeInTheDocument();

    fireEvent.click(generateButton);
    expect(generateButton).toBeInTheDocument();
  });
});
  const renderChecklist = () =>
    render(
      <MemoryRouter>
        <Checklist />
      </MemoryRouter>,
    );
