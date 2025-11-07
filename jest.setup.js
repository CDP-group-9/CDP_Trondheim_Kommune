import "@testing-library/jest-dom";
import "jest-axe/extend-expect";
import React from "react";

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}));

if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}
