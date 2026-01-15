import { useEffect } from "react";
import projects from "../data/projects";
import { closeOverlayLoader } from "../loader";
import { routeUrl } from "../utils/paths";

const Works = () => {
  useEffect(() => {
    closeOverlayLoader();
  }, []);

  return (
    <section className="works-page" id="work">
      <div className="works-page__inner px-32 lg:px-48">
        <div className="works-page__header">
          <h1 className="works-page__title">Our Works</h1>
        </div>

        <div className="works-page__grid">
          {projects.map((project, index) => (
            <a
              key={project.id}
              className="works-page__card"
              href={routeUrl(`works/${encodeURIComponent(project.id)}`)}
            >
              <div className="works-page__media">
                <img
                  src={project.image}
                  alt={`${project.title} preview`}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
              <div className="works-page__meta">
                <p className="works-page__name">{project.title}</p>
                <p className="works-page__subtitle">{project.subtitle}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Works;
