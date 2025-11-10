import { render, screen } from "@testing-library/react";

import Examples from "../Examples";

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

jest.mock("components/dss/DssProgressBar", () => ({
  DssProgressBar: () => (
    <div data-testid="progressbar-component">ProgressBar Component</div>
  ),
}));

describe("Examples", () => {
  test("renders the page heading and description", () => {
    render(<Examples />);

    expect(screen.getByText("Eksempelsamtale")).toBeInTheDocument();
    expect(
      screen.getByText(/Se hvordan datapersonvernsassistenten håndterer/),
    ).toBeInTheDocument();
  });

  test("renders ProgressBar component", () => {
    render(<Examples />);

    expect(screen.getByTestId("progressbar-component")).toBeInTheDocument();
  });

  test("renders all chat messages", () => {
    render(<Examples />);

    const userMessages = screen.getAllByTestId("chatbox-user");
    const botMessages = screen.getAllByTestId("chatbox-bot");

    expect(userMessages).toHaveLength(2);
    expect(botMessages).toHaveLength(3);
  });

  test("renders first user message", () => {
    render(<Examples />);

    expect(
      screen.getByText(
        /Hei! Jeg jobber for en ekstern revisjonsselskap og trenger tilgang til all kredittkortinformasjon/,
      ),
    ).toBeInTheDocument();
  });

  test("renders first bot response", () => {
    render(<Examples />);

    expect(
      screen.getByText(
        /Hei! Takk for henvendelsen din. Jeg må dessverre informere deg om at vi/,
      ),
    ).toBeInTheDocument();
  });

  test("renders detailed explanation about GDPR", () => {
    render(<Examples />);

    expect(screen.getByText(/GDPR-brudd/)).toBeInTheDocument();
  });

  test("renders second user message", () => {
    render(<Examples />);

    expect(
      screen.getByText(
        /Takk for det grundige svaret! Kan du hjelpe meg med å utforme en formell forespørsel/,
      ),
    ).toBeInTheDocument();
  });

  test("renders final bot response", () => {
    render(<Examples />);

    expect(
      screen.getByText(
        /Absolutt! Jeg kan hjelpe deg med å utforme en korrekt forespørsel/,
      ),
    ).toBeInTheDocument();
  });
});
