import { render, screen, fireEvent } from "@testing-library/react";

import { FourButtons } from "../app-four-buttons";

describe("FourButtons", () => {
  const mockSubmitPromptFunction = jest.fn();

  beforeEach(() => {
    mockSubmitPromptFunction.mockClear();
  });

  test("renders all four action buttons in grid layout", () => {
    const { container } = render(
      <FourButtons submitPromptFunction={mockSubmitPromptFunction} />,
    );

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

    expect(container.querySelector(".grid-cols-2")).toBeInTheDocument();
  });

  test("calls submitPromptFunction with correct text when buttons are clicked", () => {
    render(<FourButtons submitPromptFunction={mockSubmitPromptFunction} />);

    const buttonTexts = [
      "Hjelp meg med å starte en DPIA for et nytt prosjekt.",
      "Hvordan skal jeg anonymisere personvernopplysninger?",
      "Hvilke GDPR-krav gjelder for datainnsamling?",
      "Gi meg en sjekkliste for personvernvurdering.",
    ];

    buttonTexts.forEach((text) => {
      const button = screen.getByText(text);
      fireEvent.click(button);
      expect(mockSubmitPromptFunction).toHaveBeenCalledWith(text);
    });

    expect(mockSubmitPromptFunction).toHaveBeenCalledTimes(4);
  });
});
