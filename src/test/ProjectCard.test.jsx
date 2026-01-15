import { render, screen } from "@testing-library/react";
import ProjectCard from "../components/ProjectCard";
import { assetUrl } from "../utils/paths";

test("builds a work detail link for each project", () => {
  render(
    <ProjectCard
      id="demo-project"
      index={0}
      title="Demo Project"
      subtitle="Subtitle"
      image={assetUrl("projects/image.png")}
    />
  );

  const link = screen.getByRole("link", { name: /view demo project project/i });
  expect(link).toHaveAttribute(
    "href",
    expect.stringContaining("/works/demo-project")
  );
});
