import { forwardRef } from "react";
import { routeUrl } from "../utils/paths";
import { appendFallbackSrcSet, buildSrcSet } from "../utils/images";

const ProjectCard = forwardRef(
  ({ id, index, title, subtitle, image, deviceRef }, ref) => {
  const numeral = String(index + 1).padStart(2, "0");
  const href = routeUrl(`works/${encodeURIComponent(id)}`);
  const srcSet = appendFallbackSrcSet(buildSrcSet(image), image);
  const sizes = "(max-width: 900px) 92vw, 55vw";

  return (
    <a
      className="latest-work__item"
      href={href}
      aria-label={`View ${title} project`}
      ref={ref}
    >
      <div className="latest-work__left">
        <span className="latest-work__index" aria-hidden="true">
          {numeral}.
        </span>
        <div className="latest-work__meta">
          <h3 className="latest-work__name">{title}</h3>
          <p className="latest-work__tagline">{subtitle}</p>
        </div>
      </div>

      <div className="latest-work__right">
          <div className="latest-work__device" ref={deviceRef}>
            <img
              src={image}
              srcSet={srcSet || undefined}
              sizes={srcSet ? sizes : undefined}
              alt={`${title} preview`}
              width={1400}
              height={900}
              loading="lazy"
              decoding="async"
            />
          </div>
      </div>
    </a>
  );
});

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
