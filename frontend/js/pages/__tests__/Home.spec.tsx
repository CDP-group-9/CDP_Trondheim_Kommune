import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Home from "../Home";

const mockCreateNewChat = jest.fn();
const mockConsumePendingChecklistContext = jest.fn(() => null);
const mockSwitchToChecklist = jest.fn();
const mockGetChatChecklistId = jest.fn(() => null);

jest.mock("../../contexts/AppStateContext", () => ({
  useAppState: () => ({
    currentChatId: "chat-1",
    createNewChat: mockCreateNewChat,
    consumePendingChecklistContext: mockConsumePendingChecklistContext,
    loadChatMessages: jest.fn(async () => []),
    saveChatMessages: jest.fn(async () => undefined),
    switchToChecklist: mockSwitchToChecklist,
    getChatChecklistId: mockGetChatChecklistId,
  }),
}));

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

jest.mock("lucide-react", () => ({
  Send: () => <div>Send Icon</div>,
}));

jest.mock("components/dss/DssExternalVsInternal", () => ({
  DssExternalVsInternal: () => null,
}));

jest.mock("../../components/dss/DssExternalVsInternal", () => ({
  DssExternalVsInternal: () => null,
}));

const mockFetch = jest.fn();
(global as typeof globalThis & { fetch: jest.Mock }).fetch = mockFetch;

describe("Home", () => {
  const renderHome = async () => {
    const utils = render(
      <MemoryRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
      >
        <Home />
      </MemoryRouter>,
    );

    const modalUser = userEvent.setup();
    try {
      const closeButton = await screen.findByRole(
        "button",
        { name: /ikke ansatt i trondheim kommune/i },
        { timeout: 300 },
      );
      await modalUser.click(closeButton);
    } catch {
      /* empty comment to make eslint happy */
    }

    return utils;
  };

  beforeEach(() => {
    mockFetch.mockClear();
    mockCreateNewChat.mockClear();
    mockConsumePendingChecklistContext.mockClear();
    mockSwitchToChecklist.mockClear();
    mockGetChatChecklistId.mockClear();
    localStorage.clear();
    localStorage.setItem("hasSeenDssModal", "true");
  });

  test("renders the textarea and submit button with correct initial state", async () => {
    await renderHome();

    const textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    const submitButton = screen.getByRole("button", { name: "Send melding" });

    expect(textarea).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test("enables submit button when input has text", async () => {
    const user = userEvent.setup();
    await renderHome();

    const textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    const submitButton = screen.getByRole("button", { name: "Send melding" });

    await user.type(textarea, "Test input");
    expect(textarea).toHaveValue("Test input");
    expect(submitButton).toBeEnabled();
  });

  test("sending a prompt displays user and bot messages", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "Bot response" }),
    } as Response);

    const user = userEvent.setup();
    await renderHome();

    const textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    const submitButton = screen.getByRole("button", { name: "Send melding" });

    await user.type(
      textarea,
      "Hjelp meg med å starte en DPIA for et nytt prosjekt.",
    );
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/chat/chat/",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          credentials: "include",
          body: JSON.stringify({
            prompt: "Hjelp meg med å starte en DPIA for et nytt prosjekt.",
            history: [],
            // eslint-disable-next-line camelcase
            context_text: "",
          }),
        }),
      );
      expect(screen.getByTestId("chatbox-user")).toBeInTheDocument();
      expect(screen.getByTestId("chatbox-bot")).toBeInTheDocument();
      expect(screen.getByText("Bot response")).toBeInTheDocument();
    });
  });

  test("displays error message on API failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "API Error" }),
    } as Response);

    const user = userEvent.setup();
    await renderHome();

    const textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    const submitButton = screen.getByRole("button", { name: "Send melding" });

    await user.type(
      textarea,
      "Hjelp meg med å starte en DPIA for et nytt prosjekt.",
    );
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to send message")).toBeInTheDocument();
    });
  });

  test("displays connection error when fetch fails", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const user = userEvent.setup();
    await renderHome();

    const textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    const submitButton = screen.getByRole("button", { name: "Send melding" });

    await user.type(
      textarea,
      "Hjelp meg med å starte en DPIA for et nytt prosjekt.",
    );
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("No connection to server")).toBeInTheDocument();
    });
  });

  test("clears input after form submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "Bot response" }),
    } as Response);

    const user = userEvent.setup();
    await renderHome();

    const textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );

    await user.type(textarea, "Test question");
    expect(textarea).toHaveValue("Test question");

    const submitButton = screen.getByRole("button", { name: "Send melding" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(
          "Spør om GDPR, DPIA eller personvernspørsmål...",
        ),
      ).toHaveValue("");
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/chat/chat/",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            prompt: "Test question",
            history: [],
            // eslint-disable-next-line camelcase
            context_text: "",
          }),
        }),
      );
    });
  });
});
