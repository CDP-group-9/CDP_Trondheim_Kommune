import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import Home from "../Home";

jest.mock("../../components/tk/app-four-buttons", () => ({
  FourButtons: ({
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

jest.mock("../../components/tk/chatbox", () => ({
  ChatBox: ({ message, type }: { message: string; type: "user" | "bot" }) => (
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

  test("renders the textarea and submit button", () => {
    render(<Home />);

    expect(
      screen.getByPlaceholderText(
        "Spør om GDPR, DPIA eller personvernspørsmål...",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  test("renders FourButtons component initially", () => {
    render(<Home />);

    expect(screen.getByTestId("four-buttons")).toBeInTheDocument();
    expect(
      screen.getByText("Hjelp meg med å starte en DPIA for et nytt prosjekt."),
    ).toBeInTheDocument();
  });

  test("submit button is disabled when input is empty", () => {
    render(<Home />);

    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeDisabled();
  });

  test("submit button is enabled when input has text", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await user.type(textarea, "Test input");
    expect(submitButton).toBeEnabled();
  });

  test("textarea is interactive", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const textarea = screen.getByPlaceholderText(
      "Spør om GDPR, DPIA eller personvernspørsmål...",
    );

    await user.type(textarea, "Test question");
    expect(textarea).toHaveValue("Test question");
  });

  test("clicking FourButtons action button submits prompt", async () => {
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
        "http://localhost:8000/api/test-response/fetch_by_keyword/",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            input: "Hjelp meg med å starte en DPIA for et nytt prosjekt.",
          }),
        }),
      );
    });
  });

  test("displays user message after submission", async () => {
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
      expect(screen.getByTestId("chatbox-user")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Hjelp meg med å starte en DPIA for et nytt prosjekt.",
        ),
      ).toBeInTheDocument();
    });
  });

  test("displays bot response after successful API call", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "Here is the bot response" }),
    } as Response);

    render(<Home />);

    const actionButton = screen.getByText(
      "Hjelp meg med å starte en DPIA for et nytt prosjekt.",
    );
    fireEvent.click(actionButton);

    await waitFor(() => {
      expect(screen.getByTestId("chatbox-bot")).toBeInTheDocument();
      expect(screen.getByText("Here is the bot response")).toBeInTheDocument();
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

  test("hides FourButtons after first message is sent", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "Bot response" }),
    } as Response);

    render(<Home />);

    expect(screen.getByTestId("four-buttons")).toBeInTheDocument();

    const actionButton = screen.getByText(
      "Hjelp meg med å starte en DPIA for et nytt prosjekt.",
    );
    fireEvent.click(actionButton);

    await waitFor(() => {
      expect(screen.queryByTestId("four-buttons")).not.toBeInTheDocument();
    });
  });

  test("clears input after submission", async () => {
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
    });
  });
});
