import { render, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { act } from "react";

import App from "../App";

describe("App accessibility", () => {
  test("has no basic accessibility violations", async () => {
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

    const results = await axe(container!);
    expect(results).toHaveNoViolations();
  });
});
