import { render, screen, fireEvent } from "@testing-library/react";

import { ReceiveOrShareData } from "../checklist";

describe("ReceiveOrShareData", () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  test("renders the section heading", () => {
    render(<ReceiveOrShareData selected={null} onSelect={mockOnSelect} />);

    expect(
      screen.getByText("Hva skal du gjøre med personopplysninger?"),
    ).toBeInTheDocument();
  });

  test("renders both option cards", () => {
    render(<ReceiveOrShareData selected={null} onSelect={mockOnSelect} />);

    expect(screen.getByText("Motta/samle inn data")).toBeInTheDocument();
    expect(screen.getByText("Dele/utlevere data")).toBeInTheDocument();
  });

  test("renders receive option description", () => {
    render(<ReceiveOrShareData selected={null} onSelect={mockOnSelect} />);

    expect(
      screen.getByText(
        /Jeg skal samle inn, motta eller behandle personopplysninger/,
      ),
    ).toBeInTheDocument();
  });

  test("renders share option description", () => {
    render(<ReceiveOrShareData selected={null} onSelect={mockOnSelect} />);

    expect(
      screen.getByText(
        /Jeg skal dele, utlevere eller overføre personopplysninger/,
      ),
    ).toBeInTheDocument();
  });

  test("shows warning message when nothing is selected", () => {
    render(<ReceiveOrShareData selected={null} onSelect={mockOnSelect} />);

    expect(
      screen.getByText(
        /Vennligst velg ett alternativ for å fortsette med sjekklisten/,
      ),
    ).toBeInTheDocument();
  });

  test("does not show warning when receive is selected", () => {
    render(<ReceiveOrShareData selected="receive" onSelect={mockOnSelect} />);

    expect(
      screen.queryByText(
        /Vennligst velg ett alternativ for å fortsette med sjekklisten/,
      ),
    ).not.toBeInTheDocument();
  });

  test("does not show warning when share is selected", () => {
    render(<ReceiveOrShareData selected="share" onSelect={mockOnSelect} />);

    expect(
      screen.queryByText(
        /Vennligst velg ett alternativ for å fortsette med sjekklisten/,
      ),
    ).not.toBeInTheDocument();
  });

  test("calls onSelect with 'receive' when receive card is clicked", () => {
    render(<ReceiveOrShareData selected={null} onSelect={mockOnSelect} />);

    const receiveButton = screen
      .getByText("Motta/samle inn data")
      .closest("button");
    fireEvent.click(receiveButton!);

    expect(mockOnSelect).toHaveBeenCalledWith("receive");
  });

  test("calls onSelect with 'share' when share card is clicked", () => {
    render(<ReceiveOrShareData selected={null} onSelect={mockOnSelect} />);

    const shareButton = screen
      .getByText("Dele/utlevere data")
      .closest("button");
    fireEvent.click(shareButton!);

    expect(mockOnSelect).toHaveBeenCalledWith("share");
  });

  test("calls onSelect with null when already selected option is clicked again", () => {
    render(<ReceiveOrShareData selected="receive" onSelect={mockOnSelect} />);

    const receiveButton = screen
      .getByText("Motta/samle inn data")
      .closest("button");
    fireEvent.click(receiveButton!);

    expect(mockOnSelect).toHaveBeenCalledWith(null);
  });

  test("applies correct styling to selected receive option", () => {
    render(<ReceiveOrShareData selected="receive" onSelect={mockOnSelect} />);

    const receiveButton = screen
      .getByText("Motta/samle inn data")
      .closest("button");

    expect(receiveButton?.className).toContain("border-primary");
    expect(receiveButton?.className).toContain("bg-white");
  });

  test("applies correct styling to selected share option", () => {
    render(<ReceiveOrShareData selected="share" onSelect={mockOnSelect} />);

    const shareButton = screen
      .getByText("Dele/utlevere data")
      .closest("button");

    expect(shareButton?.className).toContain("border-primary");
    expect(shareButton?.className).toContain("bg-white");
  });
});
