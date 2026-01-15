import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../utils/gsap", () => {
  const timeline = {
    to: vi.fn(() => timeline),
    from: vi.fn(() => timeline),
    fromTo: vi.fn(() => timeline),
    kill: vi.fn(),
  };

  const contextMock = {
    revert: vi.fn(),
  };

  const matchMediaMock = {
    add: (_query, cb) => {
      const cleanup = cb();
      return () => {
        if (typeof cleanup === "function") cleanup();
      };
    },
    revert: vi.fn(),
  };

  const gsap = {
    context: vi.fn((cb) => {
      cb();
      return contextMock;
    }),
    matchMedia: vi.fn(() => matchMediaMock),
    utils: {
      toArray: () => [],
    },
    set: vi.fn(),
    timeline: vi.fn(() => timeline),
    to: vi.fn(),
  };

  return {
    gsap,
    ScrollTrigger: {
      getAll: vi.fn(() => []),
      create: vi.fn(),
    },
  };
});

import LatestWorkPricing from "../components/LatestWorkPricing";
import { gsap } from "../utils/gsap";

beforeEach(() => {
  vi.clearAllMocks();
});

test("pricing toggle triggers animation and updates aria state", async () => {
  render(<LatestWorkPricing />);

  const singleToggle = screen.getByRole("button", { name: /^projects$/i });
  const doubleToggle = screen.getByRole("button", { name: /2 projects/i });

  expect(singleToggle).toHaveAttribute("aria-pressed", "true");
  expect(doubleToggle).toHaveAttribute("aria-pressed", "false");

  fireEvent.click(doubleToggle);

  await waitFor(() => {
    expect(doubleToggle).toHaveAttribute("aria-pressed", "true");
  });

  expect(gsap.timeline).toHaveBeenCalled();
});
