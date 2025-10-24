import { render, fireEvent } from "@testing-library/react";

import { DssProgressBar } from "components/dss";

describe("DssProgressBar", () => {
  beforeEach(() => {
    window.scrollY = 0;
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      writable: true,
      configurable: true,
      value: 2000,
    });
  });

  test("does not render when scroll progress is 0", () => {
    const { container } = render(<DssProgressBar />);

    expect(container.firstChild).toBeNull();
  });

  test("renders progress bar when scrolled", () => {
    const { container } = render(<DssProgressBar />);

    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 500,
    });

    fireEvent.scroll(window);

    const progressBar = container.querySelector(".fixed");
    expect(progressBar).toBeInTheDocument();
  });

  test("manages scroll event listener lifecycle", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = render(<DssProgressBar />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });
});
