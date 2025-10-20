import { render, screen } from "@testing-library/react";

import { ChatBox } from "../chatbox";

jest.mock("../../../../assets/images/tk-avatar.png", () => "tk-avatar.png");
jest.mock("../../../../assets/images/user-avatar.svg", () => "user-avatar.svg");

describe("ChatBox", () => {
  test("renders user message with correct avatar", () => {
    const { container } = render(
      <ChatBox message="Hello from user" type="user" />,
    );

    expect(screen.getByText("Hello from user")).toBeInTheDocument();

    const avatar = screen.getByAltText("user avatar");
    expect(avatar).toHaveAttribute("src", "user-avatar.svg");

    expect(container.querySelector(".justify-end")).toBeInTheDocument();
  });

  test("renders bot message with correct avatar", () => {
    const { container } = render(
      <ChatBox message="Hello from bot" type="bot" />,
    );

    expect(screen.getByText("Hello from bot")).toBeInTheDocument();

    const avatar = screen.getByAltText("tk avatar");
    expect(avatar).toBeInTheDocument();

    expect(container.querySelector(".justify-start")).toBeInTheDocument();
  });
});
