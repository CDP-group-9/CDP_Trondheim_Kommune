import { render, screen } from "@testing-library/react";

import { DssChatBox } from "../DssChatBox";

jest.mock("lucide-react", () => ({
  UserRound: () => <div>User Icon</div>,
}));

jest.mock("../../../assets/images/tk-avatar.svg", () => "dss-avatar.svg");

describe("DssChatBox", () => {
  test("renders user message with correct styling and avatar", () => {
    const { container } = render(
      <DssChatBox message="Hello from user" type="user" />,
    );

    expect(screen.getByText("Hello from user")).toBeInTheDocument();

    const avatar = screen.getByLabelText("bruker avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("role", "img");

    expect(container.querySelector(".justify-end")).toBeInTheDocument();
    expect(container.querySelector(".bg-brand-blue")).toBeInTheDocument();
  });

  test("renders bot message with correct styling and avatar", () => {
    const { container } = render(
      <DssChatBox message="Hello from bot" type="bot" />,
    );

    expect(screen.getByText("Hello from bot")).toBeInTheDocument();

    const avatar = screen.getByAltText("Trondheim Kommune avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "dss-avatar.svg");

    expect(container.querySelector(".justify-start")).toBeInTheDocument();
    expect(container.querySelector(".bg-muted")).toBeInTheDocument();
  });

  test("renders markdown content for bot messages", () => {
    const messageWithLink = "Check out [this link](https://example.com)";
    render(<DssChatBox message={messageWithLink} type="bot" />);

    expect(screen.getByText(/Check out/i)).toBeInTheDocument();
  });

  test("preserves multiline content", () => {
    const multilineMessage = "Line 1\nLine 2\nLine 3";
    render(<DssChatBox message={multilineMessage} type="user" />);

    const messageElement = screen.getByText(/Line 1/);
    expect(messageElement).toHaveTextContent("Line 1");
    expect(messageElement).toHaveTextContent("Line 2");
    expect(messageElement).toHaveTextContent("Line 3");
  });
});
