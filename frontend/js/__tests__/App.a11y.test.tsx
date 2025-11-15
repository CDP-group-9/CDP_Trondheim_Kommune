import { render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { act } from "react";

import App from "../App";

const routeScenarios = [
  {
    name: "home",
    path: "/",
    waitForReady: () => screen.findByRole("heading", { name: /ASQ/, level: 1 }),
  },
  {
    name: "privacy",
    path: "/personvern",
    waitForReady: () =>
      screen.findByRole("heading", {
        name: /Informasjon om personvern/,
        level: 1,
      }),
  },
  {
    name: "checklist",
    path: "/sjekkliste",
    waitForReady: () =>
      screen.findByRole("heading", { name: /Personvernsjekkliste/, level: 1 }),
  },
  {
    name: "examples",
    path: "/eksempel",
    waitForReady: () =>
      screen.findByRole("heading", { name: /Eksempelsamtale/, level: 1 }),
  },
] as const;

describe("App accessibility", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.localStorage.setItem("hasSeenDssModal", "true");
    window.localStorage.setItem("isInternal", "true");
  });

  test.each(routeScenarios)(
    "has no basic accessibility violations on %s route",
    async ({ path, waitForReady }) => {
      window.history.pushState({}, "", path);

      let container: HTMLElement;

      await act(async () => {
        const { container: renderedContainer } = render(<App />);
        container = renderedContainer;

        await waitFor(
          () => {
            return new Promise((resolve) => setTimeout(resolve, 0));
          },
          { timeout: 1000 },
        );
      });

      await waitForReady();

      const results = await axe(container!);
      expect(results).toHaveNoViolations();
    },
  );
});