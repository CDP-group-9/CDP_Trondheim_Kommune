import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import Home from "../Home";

describe("Home", () => {
  test("renders the main UI elements", () => {
    render(<Home />);

    expect(screen.getByPlaceholderText("Skriv noe her...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
    expect(
      screen.getByText("Hjelp meg med å starte en DPIA for et nytt prosjekt."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hvordan skal jeg anonymisere personvernopplysninger?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Hvilke GDPR-krav gjelder for datainnsamling?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Gi meg en sjekkliste for personvernvurdering."),
    ).toBeInTheDocument();
  });

  test("renders four action buttons as links", () => {
    render(<Home />);

    const buttons = screen.getAllByRole("link");
    expect(buttons).toHaveLength(4);

    buttons.forEach((button) => {
      expect(button).toHaveAttribute("href", "#");
    });
  });

  test("textarea is interactive", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const textarea = screen.getByPlaceholderText("Skriv noe her...");

    await user.type(textarea, "Test input");
    expect(textarea).toHaveValue("Test input");
  });

  test("send button is clickable", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const sendButton = screen.getByRole("button", { name: "Send" });

    await user.click(sendButton);
    expect(sendButton).toBeInTheDocument();
  });
});
