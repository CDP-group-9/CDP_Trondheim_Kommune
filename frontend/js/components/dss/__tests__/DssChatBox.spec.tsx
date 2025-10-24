import { render, screen } from "@testing-library/react";

import { DssChatBox } from "../DssChatBox";

jest.mock("../../../../assets/images/tk-avatar.png", () => "dss-avatar.png");
jest.mock("../../../../assets/images/user-avatar.svg", () => "user-avatar.svg");

describe("DssChatBox", () => {
  test("renders user message with correct avatar", () => {
    const { container } = render(
      <DssChatBox message="Hello from user" type="user" />,
    );

    expect(screen.getByText("Hello from user")).toBeInTheDocument();

    const avatar = screen.getByAltText("user avatar");
    expect(avatar).toHaveAttribute("src", "user-avatar.svg");

    expect(container.querySelector(".justify-end")).toBeInTheDocument();
  });

  test("renders bot message with correct avatar", () => {
    const { container } = render(
      <DssChatBox message="Hello from bot" type="bot" />,
    );

    expect(screen.getByText("Hello from bot")).toBeInTheDocument();

    const avatar = screen.getByAltText("dss avatar");
    expect(avatar).toBeInTheDocument();

    expect(container.querySelector(".justify-start")).toBeInTheDocument();
  });
});
