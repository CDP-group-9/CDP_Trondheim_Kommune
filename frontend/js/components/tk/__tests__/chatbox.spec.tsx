import { render, screen } from "@testing-library/react";

import { ChatBox } from "../chatbox";

jest.mock("../../../../assets/images/tk-avatar.png", () => "tk-avatar.png");
jest.mock("../../../../assets/images/user-avatar.svg", () => "user-avatar.svg");

describe("ChatBox", () => {
  describe("user message", () => {
    test("renders user message correctly", () => {
      render(<ChatBox message="Hello from user" type="user" />);

      expect(screen.getByText("Hello from user")).toBeInTheDocument();
    });

    test("displays user avatar", () => {
      render(<ChatBox message="Test message" type="user" />);

      const avatar = screen.getByAltText("user avatar");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute("src", "user-avatar.svg");
    });

    test("applies correct styling for user messages", () => {
      render(<ChatBox message="User message" type="user" />);

      const messageBox = screen.getByText("User message");
      expect(messageBox).toHaveClass("bg-[#002d52]");
      expect(messageBox).toHaveClass("text-white");
    });

    test("has justify-end layout for user messages", () => {
      const { container } = render(
        <ChatBox message="User message" type="user" />,
      );

      const wrapper = container.querySelector(".justify-end");
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("bot message", () => {
    test("renders bot message correctly", () => {
      render(<ChatBox message="Hello from bot" type="bot" />);

      expect(screen.getByText("Hello from bot")).toBeInTheDocument();
    });

    test("displays bot avatar", () => {
      render(<ChatBox message="Test message" type="bot" />);

      const avatar = screen.getByAltText("tk avatar");
      expect(avatar).toBeInTheDocument();
    });

    test("applies correct styling for bot messages", () => {
      render(<ChatBox message="Bot message" type="bot" />);

      const messageBox = screen.getByText("Bot message");
      expect(messageBox).toHaveClass("bg-muted");
    });

    test("has justify-start layout for bot messages", () => {
      const { container } = render(
        <ChatBox message="Bot message" type="bot" />,
      );

      const wrapper = container.querySelector(".justify-start");
      expect(wrapper).toBeInTheDocument();
    });
  });
});
