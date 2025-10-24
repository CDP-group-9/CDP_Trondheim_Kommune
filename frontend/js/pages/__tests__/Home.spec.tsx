import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import Home from "../Home";

jest.mock("components/dss/DssFourButtons", () => ({
  DssFourButtons: ({
    submitPromptFunction,
  }: {
    submitPromptFunction: (input: string) => void;
  }) => (
    <div data-testid="four-buttons">
      <button
        type="button"
        onClick={() =>
          submitPromptFunction(
            "Hjelp meg med å starte en DPIA for et nytt prosjekt.",
          )
        }
      >
        Hjelp meg med å starte en DPIA for et nytt prosjekt.
      </button>
      <button
        type="button"
        onClick={() =>
          submitPromptFunction(
            "Hvordan skal jeg anonymisere personvernopplysninger?",
          )
        }
      >
        Hvordan skal jeg anonymisere personvernopplysninger?
      </button>
      <button
        type="button"
        onClick={() =>
          submitPromptFunction("Hvilke GDPR-krav gjelder for datainnsamling?")
        }
      >
        Hvilke GDPR-krav gjelder for datainnsamling?
      </button>
      <button
        type="button"
        onClick={() =>
          submitPromptFunction("Gi meg en sjekkliste for personvernvurdering.")
        }
      >
        Gi meg en sjekkliste for personvernvurdering.
      </button>
    </div>
  ),
}));

jest.mock("components/dss/DssChatBox", () => ({
  DssChatBox: ({ message, type }: { message: string; type: "user" | "bot" }) => (
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
  });

  test("renders the textarea and submit button with correct initial state", () => {
    render(<Home />);

    const textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    const submitButton = screen.getByRole("button", { name: "Submit" });

    expect(textarea).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(screen.getByTestId("four-buttons")).toBeInTheDocument();
  });

  test("enables submit button when input has text", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await user.type(textarea, "Test input");
    expect(textarea).toHaveValue("Test input");
    expect(submitButton).toBeEnabled();
  });

  test("clicking FourButtons action button submits prompt and displays messages", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "Bot response" }),
    } as Response);

    render(<Home />);

    const actionButton = screen.getByText(
      "Hjelp meg med å starte en DPIA for et nytt prosjekt.",
    );
    fireEvent.click(actionButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8000/api/chat/chat/",
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
          }),
        }),
      );
      expect(screen.getByTestId("chatbox-user")).toBeInTheDocument();
      expect(screen.getByTestId("chatbox-bot")).toBeInTheDocument();
      expect(screen.getByText("Bot response")).toBeInTheDocument();
      expect(screen.queryByTestId("four-buttons")).not.toBeInTheDocument();
    });
  });

  test("displays error message on API failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "API Error" }),
    } as Response);

    render(<Home />);

    const actionButton = screen.getByText(
      "Hjelp meg med å starte en DPIA for et nytt prosjekt.",
    );
    fireEvent.click(actionButton);

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });

  test("displays connection error when fetch fails", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<Home />);

    const actionButton = screen.getByText(
      "Hjelp meg med å starte en DPIA for et nytt prosjekt.",
    );
    fireEvent.click(actionButton);

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

    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(textarea).toHaveValue("");
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:8000/api/chat/chat/",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            prompt: "Test question",
            history: [],
          }),
        }),
      );
    });
  });
});
