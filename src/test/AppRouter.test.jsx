import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";

function createStub(testId) {
  return () => <div data-testid={testId}>{testId}</div>;
}

vi.mock("../sections/Hero", () => ({
  __esModule: true,
  default: createStub("hero-section"),
}));
vi.mock("../sections/About", () => ({
  __esModule: true,
  default: createStub("about-section"),
}));
vi.mock("../sections/LatestWork", () => ({
  __esModule: true,
  default: createStub("latest-work-section"),
}));
vi.mock("../components/LazyMount", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="lazy-mount">{children}</div>,
}));
vi.mock("../sections/Footer", () => ({
  __esModule: true,
  default: createStub("footer-section"),
}));
vi.mock("../components/LatestWorkPricing", () => ({
  __esModule: true,
  default: createStub("pricing-section"),
}));
vi.mock("../components/TidyCall", () => ({
  __esModule: true,
  default: createStub("tidycall-section"),
}));
vi.mock("../sections/Works", () => ({
  __esModule: true,
  default: createStub("works-page"),
}));
vi.mock("../sections/WorkDetail", () => ({
  __esModule: true,
  default: createStub("work-detail-page"),
}));

import App from "../App";

test("mounts app and navigates to works route without hydration issues", async () => {
  render(<App />);
  expect(await screen.findByTestId("hero-section")).toBeInTheDocument();
  const workLink = screen.getByRole("link", { name: /^work$/i });
  fireEvent.click(workLink);
  await waitFor(() =>
    expect(screen.getByTestId("works-page")).toBeInTheDocument()
  );
  expect(window.location.pathname).toContain("/works");
});
