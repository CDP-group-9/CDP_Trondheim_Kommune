import { render, screen, fireEvent } from "@testing-library/react";

import Checklist from "../Checklist";

jest.mock("components/dss/checklist/Context", () => ({
  Context: () => <div data-testid="context-component">Context Component</div>,
}));

jest.mock("components/dss/checklist/Data", () => ({
  Data: ({ selectedOption }: { selectedOption: string }) => (
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
    selected: string | null;
    onSelect: (value: "receive" | "share") => void;
  }) => (
    <div data-testid="receive-or-share-component">
      <button type="button" onClick={() => onSelect("receive")}>
        Receive
      </button>
      <button type="button" onClick={() => onSelect("share")}>
        Share
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

jest.mock("components/dss/DssProgressBarUpdated", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="progressbar-component">ProgressBar Component</div>
  ),
}));

jest.mock("../../components/ui/button", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe("Checklist", () => {
  const originalLocation = window.location;
  const mockReload = jest.fn();

  beforeEach(() => {
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
  });

  test("renders the page heading and description", () => {
    render(<Checklist />);

    expect(screen.getByText("Personvernsjekkliste")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Systematisk gjennomgang av alle personvernkrav for ditt prosjekt",
      ),
    ).toBeInTheDocument();
  });

  test("renders ProgressBarUpdated component", () => {
    render(<Checklist />);

    expect(screen.getByTestId("progressbar-component")).toBeInTheDocument();
  });

  test("renders ReceiveOrShareData component", () => {
    render(<Checklist />);

    expect(
      screen.getByTestId("receive-or-share-component"),
    ).toBeInTheDocument();
  });

  test("does not render checklist components initially", () => {
    render(<Checklist />);

    expect(screen.queryByTestId("context-component")).not.toBeInTheDocument();
    expect(screen.queryByTestId("data-component")).not.toBeInTheDocument();
    expect(screen.queryByTestId("legal-component")).not.toBeInTheDocument();
  });

  test("renders checklist components when receive option is selected", () => {
    render(<Checklist />);

    const receiveButton = screen.getByText("Receive");
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
    render(<Checklist />);

    const shareButton = screen.getByText("Share");
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
    render(<Checklist />);

    const receiveButton = screen.getByText("Receive");
    fireEvent.click(receiveButton);

    expect(screen.getByText("Data Component - receive")).toBeInTheDocument();
  });

  test("renders helper text when option is selected", () => {
    render(<Checklist />);

    const receiveButton = screen.getByText("Receive");
    fireEvent.click(receiveButton);

    expect(
      screen.getByText(/Fyll ut informasjonen nedenfor/),
    ).toBeInTheDocument();
  });

  test("renders action buttons when option is selected", () => {
    render(<Checklist />);

    const receiveButton = screen.getByText("Receive");
    fireEvent.click(receiveButton);

    expect(screen.getByText("Nullstill skjema")).toBeInTheDocument();
    expect(screen.getByText("Generer veiledning")).toBeInTheDocument();
  });

  test("nullstill skjema button reloads the page", () => {
    render(<Checklist />);

    const receiveButton = screen.getByText("Receive");
    fireEvent.click(receiveButton);

    const resetButton = screen.getByText("Nullstill skjema");
    fireEvent.click(resetButton);

    expect(window.location.reload).toHaveBeenCalledWith();
  });

  test("generer veiledning button is clickable", () => {
    render(<Checklist />);

    const receiveButton = screen.getByText("Receive");
    fireEvent.click(receiveButton);

    const generateButton = screen.getByText("Generer veiledning");
    expect(generateButton).toBeInTheDocument();

    fireEvent.click(generateButton);
    expect(generateButton).toBeInTheDocument();
  });
});
