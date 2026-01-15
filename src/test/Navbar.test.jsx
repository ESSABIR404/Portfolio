import { render, screen } from "@testing-library/react";
import Navbar from "../sections/Navbar";

test("renders primary navigation links", () => {
  render(<Navbar />);
  expect(screen.getByRole("link", { name: /^home$/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /^about$/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /^work$/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /^contact$/i })).toBeInTheDocument();
});
