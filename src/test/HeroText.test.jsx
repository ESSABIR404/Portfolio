import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../components/FlipWords", () => ({
  FlipWords: ({ words }) => (
    <div data-testid="flipwords" data-count={words.length}>
      {words.join(" ")}
    </div>
  ),
}));

import HeroText from "../components/HeroText";

test("renders hero text without crashing and passes words to FlipWords", () => {
  render(<HeroText />);
  const flipwords = screen.getAllByTestId("flipwords");
  expect(flipwords.length).toBeGreaterThan(0);
  flipwords.forEach((node) => {
    expect(Number(node.getAttribute("data-count"))).toBeGreaterThan(0);
  });
});
