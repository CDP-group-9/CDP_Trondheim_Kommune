import { render } from "@testing-library/react";
import { axe } from "jest-axe";

import App from "../App";

describe("App accessibility", () => {
  test("has no basic accessibility violations", async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
