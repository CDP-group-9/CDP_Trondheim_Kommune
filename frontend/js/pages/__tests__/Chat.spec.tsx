import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Chat from "../Chat";

jest.mock("components/dss/DssChatBox", () => ({
  DssChatBox: ({
    message,
    type,
  }: {
    message: string;
    type: "user" | "bot";
  }) => (
    <div data-testid={`chatbox-${type}`}>
      <span>{message}</span>
    </div>
  ),
}));

jest.mock("components/dss/DssChecklistLink", () => ({
  DssChecklistLink: () => (
    <div data-testid="checklist-link">Checklist Link</div>
  ),
}));

jest.mock("lucide-react", () => ({
  Send: () => <div>Send Icon</div>,
}));

jest.mock("js/components/ui/sidebar", () => ({
  useSidebar: () => ({
    state: "expanded",
    isMobile: false,
  }),
}));

describe("Chat", () => {
  const mockSetInputValue = jest.fn();
  const mockOnSend = jest.fn();

  const defaultProps = {
    messages: [],
    errorMsg: null,
    inputValue: "",
    setInputValue: mockSetInputValue,
    isSending: false,
    onSend: mockOnSend,
  };

  beforeEach(() => {
    mockSetInputValue.mockClear();
    mockOnSend.mockClear();
  });

  const renderChat = (props = {}) => {
    return render(
      <MemoryRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
      >
        <Chat {...defaultProps} {...props} />
      </MemoryRouter>,
    );
  };

  test("renders the checklist link", () => {
    renderChat();

    expect(screen.getByTestId("checklist-link")).toBeInTheDocument();
  });

  test("renders the input textarea with correct placeholder", () => {
    renderChat();

    expect(
      screen.getByPlaceholderText(
        "Spør om GDPR, DPIA eller personvernspørsmål...",
      ),
    ).toBeInTheDocument();
  });

  test("renders the send button", () => {
    renderChat();

    expect(
      screen.getByRole("button", { name: "Send melding" }),
    ).toBeInTheDocument();
  });

  test("send button is disabled when input is empty", () => {
    renderChat();

    const sendButton = screen.getByRole("button", { name: "Send melding" });
    expect(sendButton).toBeDisabled();
  });

  test("send button is enabled when input has text", () => {
    renderChat({ inputValue: "Test message" });

    const sendButton = screen.getByRole("button", { name: "Send melding" });
    expect(sendButton).toBeEnabled();
  });

  test("send button is disabled when sending", () => {
    renderChat({ inputValue: "Test message", isSending: true });

    const sendButton = screen.getByRole("button", { name: "Send melding" });
    expect(sendButton).toBeDisabled();
  });

  test("calls onSend when send button is clicked", () => {
    renderChat({ inputValue: "Test message" });

    const sendButton = screen.getByRole("button", { name: "Send melding" });
    fireEvent.click(sendButton);

    expect(mockOnSend).toHaveBeenCalledTimes(1);
  });

  test("calls onSend when Enter key is pressed", () => {
    renderChat({ inputValue: "Test message" });

    const textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(mockOnSend).toHaveBeenCalledTimes(1);
  });

  test("does not call onSend when Shift+Enter is pressed", () => {
    renderChat({ inputValue: "Test message" });

    const textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  test("calls setInputValue when textarea value changes", () => {
    renderChat();

    const textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    fireEvent.change(textarea, { target: { value: "New message" } });

    expect(mockSetInputValue).toHaveBeenCalledTimes(1);
  });

  test("displays error message when errorMsg prop is provided", () => {
    renderChat({ errorMsg: "Something went wrong" });

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  test("renders chat messages", () => {
    const messages = [
      { id: "1", message: "User message", type: "user" as const },
      { id: "2", message: "Bot response", type: "bot" as const },
    ];

    renderChat({ messages });

    expect(screen.getByTestId("chatbox-user")).toBeInTheDocument();
    expect(screen.getByTestId("chatbox-bot")).toBeInTheDocument();
    expect(screen.getByText("User message")).toBeInTheDocument();
    expect(screen.getByText("Bot response")).toBeInTheDocument();
  });

  test("renders multiple messages in correct order", () => {
    const messages = [
      { id: "1", message: "First message", type: "user" as const },
      { id: "2", message: "Bot reply 1", type: "bot" as const },
      { id: "3", message: "Second message", type: "user" as const },
      { id: "4", message: "Bot reply 2", type: "bot" as const },
    ];

    renderChat({ messages });

    const allMessages = screen.getAllByTestId(/chatbox/);
    expect(allMessages).toHaveLength(4);
  });

  test("textarea adjusts rows based on input length", () => {
    const { rerender } = renderChat({ inputValue: "Short" });

    let textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    expect(textarea).toHaveAttribute("rows", "2");

    const longInput = "A".repeat(80);
    rerender(
      <MemoryRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
      >
        <Chat {...defaultProps} inputValue={longInput} />
      </MemoryRouter>,
    );

    textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    expect(textarea).toHaveAttribute("rows", "4");

    const veryLongInput = "A".repeat(150);
    rerender(
      <MemoryRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
      >
        <Chat {...defaultProps} inputValue={veryLongInput} />
      </MemoryRouter>,
    );

    textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    expect(textarea).toHaveAttribute("rows", "4");
  });
});
