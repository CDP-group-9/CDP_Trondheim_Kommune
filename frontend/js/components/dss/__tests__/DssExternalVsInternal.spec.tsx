import { render, screen, fireEvent } from "@testing-library/react";

import { DssExternalVsInternal } from "../DssExternalVsInternal";

describe("DssExternalVsInternal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders trigger button when autoOpen is false", () => {
    render(<DssExternalVsInternal />);

    expect(
      screen.getByLabelText("Velg om du jobber i Trondheim kommune"),
    ).toBeInTheDocument();
  });

  test("opens dialog when autoOpen is true", () => {
    render(<DssExternalVsInternal autoOpen />);

    expect(
      screen.queryByLabelText("Velg om du jobber i Trondheim kommune"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Jobber du i Trondheim kommune?"),
    ).toBeInTheDocument();
  });

  test("sets internal status to true and calls callbacks when clicking internal button", () => {
    const mockOnSelect = jest.fn();
    const mockOnClose = jest.fn();

    render(
      <DssExternalVsInternal
        autoOpen
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />,
    );

    fireEvent.click(screen.getByText("Ansatt i Trondheim kommune"));

    expect(localStorage.getItem("isInternal")).toBe("true");
    expect(mockOnSelect).toHaveBeenCalledWith(true);
    expect(mockOnClose).toHaveBeenCalledWith();
  });

  test("sets internal status to false and calls callbacks when clicking external button", () => {
    const mockOnSelect = jest.fn();
    const mockOnClose = jest.fn();

    render(
      <DssExternalVsInternal
        autoOpen
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />,
    );

    fireEvent.click(screen.getByText("Ikke ansatt i Trondheim kommune"));

    expect(localStorage.getItem("isInternal")).toBe("false");
    expect(mockOnSelect).toHaveBeenCalledWith(false);
    expect(mockOnClose).toHaveBeenCalledWith();
  });

  test("dispatches custom event when status is selected", () => {
    const eventListener = jest.fn();
    window.addEventListener("internalStatusChanged", eventListener);

    render(<DssExternalVsInternal autoOpen />);
    fireEvent.click(screen.getByText("Ansatt i Trondheim kommune"));

    expect(eventListener).toHaveBeenCalledWith(expect.any(Event));

    window.removeEventListener("internalStatusChanged", eventListener);
  });

  test("renders dialog with correct accessibility attributes", () => {
    render(<DssExternalVsInternal autoOpen />);

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-describedby");
  });
});
