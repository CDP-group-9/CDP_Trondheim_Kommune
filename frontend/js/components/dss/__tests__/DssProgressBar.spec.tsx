import { render, fireEvent } from "@testing-library/react";

import { DssProgressBar } from "components/dss";

describe("DssProgressBar", () => {
  let addEventListenerSpy: jest.SpyInstance;
  let removeEventListenerSpy: jest.SpyInstance;

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
    addEventListenerSpy = jest.spyOn(window, "addEventListener");
    removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  test("does not render progress bar initially", () => {
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
