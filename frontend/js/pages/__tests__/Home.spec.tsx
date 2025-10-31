import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import Home from "../Home";

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

const mockFetch = jest.fn();
(global as typeof globalThis & { fetch: jest.Mock }).fetch = mockFetch;

describe("Home", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    localStorage.clear();
  });

  test("renders the textarea and submit button with correct initial state", () => {
    render(<Home />);

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
    render(<Home />);

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
    render(<Home />);

    const textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    const submitButton = screen.getByRole("button", { name: "Send melding" });

    await user.type(textarea, "Hjelp meg med å starte en DPIA for et nytt prosjekt.");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/chat/chat/",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            "X-CSRFTOKEN": "",
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
    render(<Home />);

    const textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    const submitButton = screen.getByRole("button", { name: "Send melding" });

    await user.type(textarea, "Hjelp meg med å starte en DPIA for et nytt prosjekt.");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });

  test("displays connection error when fetch fails", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const user = userEvent.setup();
    render(<Home />);

    const textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    const submitButton = screen.getByRole("button", { name: "Send melding" });

    await user.type(textarea, "Hjelp meg med å starte en DPIA for et nytt prosjekt.");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("No connection to server.")).toBeInTheDocument();
    });
  });

  test("clears input after form submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "Bot response" }),
    } as Response);

    const user = userEvent.setup();
    render(<Home />);

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
