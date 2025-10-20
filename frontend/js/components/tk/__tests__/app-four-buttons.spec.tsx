import { render, screen, fireEvent } from "@testing-library/react";

import { FourButtons } from "../app-four-buttons";

describe("FourButtons", () => {
  const mockSubmitPromptFunction = jest.fn();

  beforeEach(() => {
    mockSubmitPromptFunction.mockClear();
  });

  test("renders all four action buttons", () => {
    render(<FourButtons submitPromptFunction={mockSubmitPromptFunction} />);

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

  test("renders buttons in a grid layout", () => {
    const { container } = render(
      <FourButtons submitPromptFunction={mockSubmitPromptFunction} />,
    );

    const gridContainer = container.querySelector(".grid-cols-2");
    expect(gridContainer).toBeInTheDocument();
  });

  test("calls submitPromptFunction when button is clicked", () => {
    render(<FourButtons submitPromptFunction={mockSubmitPromptFunction} />);

    const firstButton = screen.getByText(
      "Hjelp meg med å starte en DPIA for et nytt prosjekt.",
    );
    fireEvent.click(firstButton);

    expect(mockSubmitPromptFunction).toHaveBeenCalledWith(
      "Hjelp meg med å starte en DPIA for et nytt prosjekt.",
    );
  });

  test("calls submitPromptFunction with correct text for each button", () => {
    render(<FourButtons submitPromptFunction={mockSubmitPromptFunction} />);

    const buttons = [
      "Hjelp meg med å starte en DPIA for et nytt prosjekt.",
      "Hvordan skal jeg anonymisere personvernopplysninger?",
      "Hvilke GDPR-krav gjelder for datainnsamling?",
      "Gi meg en sjekkliste for personvernvurdering.",
    ];

    buttons.forEach((buttonText) => {
      const button = screen.getByText(buttonText);
      fireEvent.click(button);
      expect(mockSubmitPromptFunction).toHaveBeenCalledWith(buttonText);
    });
  });
});
