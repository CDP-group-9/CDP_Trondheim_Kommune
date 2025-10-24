import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";

import { ReceiveOrShareData } from "../index";

describe("ReceiveOrShareData", () => {
  const renderComponent = (
    initialSelected: "motta" | "dele" | null = null,
    onSelect?: (value: "motta" | "dele" | null) => void,
  ) => {
    const Wrapper = () => {
      const [selected, setSelected] =
        useState<"motta" | "dele" | null>(initialSelected);

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

  test("does not show warning when receive is selected", () => {
    renderComponent("motta");

    expect(
      screen.queryByText(
        /Vennligst velg ett alternativ for å fortsette med sjekklisten/,
      ),
    ).not.toBeInTheDocument();
  });

  test("does not show warning when share is selected", () => {
    renderComponent("dele");

    expect(
      screen.queryByText(
        /Vennligst velg ett alternativ for å fortsette med sjekklisten/,
      ),
    ).not.toBeInTheDocument();
  });

  test("calls onSelect with 'motta' when receive card is clicked", () => {
    const onSelect = jest.fn();
    renderComponent(null, onSelect);

    const receiveButton = screen
      .getByText("Motta/samle inn data")
      .closest("button");
    fireEvent.click(receiveButton!);

    expect(onSelect).toHaveBeenCalledWith("motta");
  });

  test("calls onSelect with 'dele' when share card is clicked", () => {
    const onSelect = jest.fn();
    renderComponent(null, onSelect);

    const shareButton = screen
      .getByText("Dele/utlevere data")
      .closest("button");
    fireEvent.click(shareButton!);

    expect(onSelect).toHaveBeenCalledWith("dele");
  });

  test("calls onSelect with null when already selected option is clicked again", () => {
    const onSelect = jest.fn();
    renderComponent("motta", onSelect);

    const receiveButton = screen
      .getByText("Motta/samle inn data")
      .closest("button");
    fireEvent.click(receiveButton!);

    expect(onSelect).toHaveBeenCalledWith(null);
  });

  test("applies correct styling to selected receive option", () => {
    renderComponent("motta");

    const receiveButton = screen
      .getByText("Motta/samle inn data")
      .closest("button");

    expect(receiveButton?.className).toContain("border-primary");
    expect(receiveButton?.className).toContain("bg-white");
  });

  test("applies correct styling to selected share option", () => {
    renderComponent("dele");

    const shareButton = screen
      .getByText("Dele/utlevere data")
      .closest("button");

    expect(shareButton?.className).toContain("border-primary");
    expect(shareButton?.className).toContain("bg-white");
  });
});
