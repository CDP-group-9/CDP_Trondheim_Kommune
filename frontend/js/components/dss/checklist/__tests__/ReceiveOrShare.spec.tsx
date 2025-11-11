import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";

import { ReceiveOrShareData } from "..";

describe("ReceiveOrShareData", () => {
  const renderComponent = (
    onSelect?: (value: "motta" | "dele" | null) => void,
    initialSelected: "motta" | "dele" | null = null,
  ) => {
    const Wrapper = () => {
      const [selected, setSelected] = useState<"motta" | "dele" | null>(
        initialSelected,
      );

      const handleSelect = (value: "motta" | "dele" | null) => {
        setSelected(value);
        onSelect?.(value);
      };

      return <ReceiveOrShareData selected={selected} onSelect={handleSelect} />;
    };

    return render(<Wrapper />);
  };

  test("renders the section heading", () => {
    renderComponent();

    expect(
      screen.getByText("Hva skal du gjøre med personopplysninger?"),
    ).toBeInTheDocument();
  });

  test("renders both option cards", () => {
    renderComponent();

    expect(screen.getByText("Motta/samle inn data")).toBeInTheDocument();
    expect(screen.getByText("Dele/utlevere data")).toBeInTheDocument();
  });

  test("renders receive option description", () => {
    renderComponent();

    expect(
      screen.getByText(
        /Jeg skal samle inn, motta eller behandle personopplysninger/,
      ),
    ).toBeInTheDocument();
  });

  test("renders share option description", () => {
    renderComponent();

    expect(
      screen.getByText(
        /Jeg skal dele, utlevere eller overføre personopplysninger/,
      ),
    ).toBeInTheDocument();
  });

  test("shows warning message when nothing is selected", () => {
    renderComponent();

    expect(
      screen.getByText(
        /Vennligst velg ett alternativ for å fortsette med sjekklisten/,
      ),
    ).toBeInTheDocument();
  });

  test("does not show warning when an option is selected", () => {
    renderComponent(undefined, "motta");

    expect(
      screen.queryByText(
        /Vennligst velg ett alternativ for å fortsette med sjekklisten/,
      ),
    ).not.toBeInTheDocument();
  });

  test("calls onSelect with 'motta' when receive card is clicked", () => {
    const onSelect = jest.fn();
    renderComponent(onSelect, null);

    const receiveInput = screen.getByLabelText(/Motta\/samle inn data/i);
    fireEvent.click(receiveInput);

    expect(onSelect).toHaveBeenCalledWith("motta");
  });

  test("calls onSelect with 'dele' when share card is clicked", () => {
    const onSelect = jest.fn();
    renderComponent(onSelect, null);

    const shareInput = screen.getByLabelText(/Dele\/utlevere data/i);
    fireEvent.click(shareInput);

    expect(onSelect).toHaveBeenCalledWith("dele");
  });

  test("calls onSelect with null when Nullstill is clicked", () => {
    const onSelect = jest.fn();
    renderComponent(onSelect, "motta");

    fireEvent.click(screen.getByRole("button", { name: /Nullstill valg/i }));

    expect(onSelect).toHaveBeenCalledWith(null);
  });

  test("applies correct styling to selected option", () => {
    renderComponent(undefined, "motta");

    expect(screen.getByLabelText(/Motta\/samle inn data/i)).toBeChecked();
  });
});
