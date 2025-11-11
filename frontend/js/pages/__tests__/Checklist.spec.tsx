import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import Checklist from "../Checklist";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockRedirectToChat = jest.fn();
const mockDownloadAsTextFile = jest.fn();
const mockResetChecklist = jest.fn();
const mockCreateNewChecklist = jest.fn();
const mockSetSelectedOption = jest.fn();
const mockSetContextData = jest.fn();
const mockSetHandlingData = jest.fn();
const mockSetLegalBasisData = jest.fn();
const mockSetInvolvedPartiesData = jest.fn();
const mockSetTechData = jest.fn();
const mockSetRiskConcernData = jest.fn();

let mockSelectedOption: "motta" | "dele" | null = null;

jest.mock("hooks/useChecklist", () => ({
  useChecklist: () => ({
    selectedOption: mockSelectedOption,
    setSelectedOption: (value: "motta" | "dele" | null) => {
      mockSelectedOption = value;
      mockSetSelectedOption(value);
    },
    contextData: {},
    setContextData: mockSetContextData,
    handlingData: {},
    setHandlingData: mockSetHandlingData,
    legalBasisData: {},
    setLegalBasisData: mockSetLegalBasisData,
    involvedPartiesData: {},
    setInvolvedPartiesData: mockSetInvolvedPartiesData,
    techData: {},
    setTechData: mockSetTechData,
    riskConcernData: {},
    setRiskConcernData: mockSetRiskConcernData,
    redirectToChat: mockRedirectToChat,
    downloadAsTextFile: mockDownloadAsTextFile,
    resetChecklist: mockResetChecklist,
    createNewChecklist: mockCreateNewChecklist,
    isSubmitting: false,
    submitError: null,
  }),
}));

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
  Button: ({
    children,
    onClick,
    ...rest
  }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) => (
    <button type="button" onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}));

describe("Checklist", () => {
  beforeEach(() => {
    mockSelectedOption = null;
    mockNavigate.mockClear();
    mockRedirectToChat.mockClear();
    mockDownloadAsTextFile.mockClear();
    mockResetChecklist.mockClear();
    mockCreateNewChecklist.mockClear();
    mockSetSelectedOption.mockClear();
    mockSetContextData.mockClear();
    mockSetHandlingData.mockClear();
    mockSetLegalBasisData.mockClear();
    mockSetInvolvedPartiesData.mockClear();
    mockSetTechData.mockClear();
    mockSetRiskConcernData.mockClear();
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

  test("renders ProgressBar component", () => {
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
    mockSelectedOption = null;
    renderChecklist();

    expect(screen.queryByTestId("context-component")).not.toBeInTheDocument();
    expect(screen.queryByTestId("data-component")).not.toBeInTheDocument();
    expect(screen.queryByTestId("legal-component")).not.toBeInTheDocument();
  });

  test("renders checklist components when option is selected", () => {
    mockSelectedOption = "motta";
    renderChecklist();

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
    mockSelectedOption = "motta";
    renderChecklist();

    expect(screen.getByText("Data Component - motta")).toBeInTheDocument();
  });

  test("renders helper text when option is selected", () => {
    mockSelectedOption = "motta";
    renderChecklist();

    expect(
      screen.getByText(/Fyll ut informasjonen nedenfor/),
    ).toBeInTheDocument();
  });

  test("renders action buttons when option is selected", () => {
    mockSelectedOption = "motta";
    renderChecklist();

    expect(screen.getByText("Nullstill skjema")).toBeInTheDocument();
    expect(screen.getByText("Generer veiledning")).toBeInTheDocument();
    expect(screen.getByText("Eksporter til tekstfil")).toBeInTheDocument();
  });

  test("nullstill skjema button calls resetChecklist", () => {
    mockSelectedOption = "motta";
    renderChecklist();

    const resetButton = screen.getByText("Nullstill skjema");
    fireEvent.click(resetButton);

    expect(mockResetChecklist).toHaveBeenCalledTimes(1);
  });

  test("generer veiledning button calls redirectToChat", async () => {
    mockRedirectToChat.mockResolvedValue(undefined);
    mockSelectedOption = "motta";
    renderChecklist();

    const generateButton = screen.getByText("Generer veiledning");
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockRedirectToChat).toHaveBeenCalledTimes(1);
    });
  });

  test("eksporter til tekstfil button calls downloadAsTextFile", () => {
    mockSelectedOption = "motta";
    renderChecklist();

    const exportButton = screen.getByText("Eksporter til tekstfil");
    fireEvent.click(exportButton);

    expect(mockDownloadAsTextFile).toHaveBeenCalledTimes(1);
  });

  test("handles error when redirectToChat fails", async () => {
    mockRedirectToChat.mockRejectedValueOnce(new Error("Network error"));
    mockSelectedOption = "motta";
    renderChecklist();

    const generateButton = screen.getByText("Generer veiledning");
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockRedirectToChat).toHaveBeenCalledTimes(1);
    });
    // Navigation should not occur if redirectToChat fails
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

const renderChecklist = () =>
  render(
    <MemoryRouter
      future={{
        // eslint-disable-next-line camelcase
        v7_startTransition: true,
        // eslint-disable-next-line camelcase
        v7_relativeSplatPath: true,
      }}
    >
      <Checklist />
    </MemoryRouter>,
  );
