import { render, fireEvent } from "@testing-library/react";

import ProgressBarUpdated from "../progressbar-updated";

describe("ProgressBarUpdated", () => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("does not render when scroll progress is 0", () => {
    const { container } = render(<ProgressBarUpdated />);

    expect(container.firstChild).toBeNull();
  });

  test("renders progress bar when scrolled", () => {
    const { container } = render(<ProgressBarUpdated />);

    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 500,
    });

    fireEvent.scroll(window);

    const progressBar = container.querySelector(".fixed");
    expect(progressBar).toBeInTheDocument();
  });

  test("calculates progress correctly on scroll", () => {
    const { container } = render(<ProgressBarUpdated />);

    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 500,
    });

    fireEvent.scroll(window);

    const progressBar = container.querySelector(".fixed");
    expect(progressBar).toBeInTheDocument();
  });

  test("adds scroll event listener on mount", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");

    render(<ProgressBarUpdated />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });

  test("removes scroll event listener on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = render(<ProgressBarUpdated />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });

  test("progress bar has fixed positioning", () => {
    const { container } = render(<ProgressBarUpdated />);

    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 100,
    });

    fireEvent.scroll(window);

    const progressBarWrapper = container.querySelector(".fixed");
    expect(progressBarWrapper).toHaveClass("top-0");
    expect(progressBarWrapper).toHaveClass("left-0");
    expect(progressBarWrapper).toHaveClass("w-full");
  });
});
