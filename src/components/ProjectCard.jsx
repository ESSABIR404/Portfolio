const ProjectCard = ({ id, index, title, subtitle, image, list = [] }) => {
  const numeral = String(index + 1).padStart(2, "0");
  const href = `/works/${id}`;

  return (
    <a
      className="latest-work__item"
      href={href}
      aria-label={`View ${title} project`}
    >
      <div className="latest-work__left">
        <span className="latest-work__index" aria-hidden="true">
          {numeral}.
        </span>
        <ul className="latest-work__list" aria-label="Project list">
          {list.map((name, idx) => (
            <li
              key={`${name}-${idx}`}
              className={`latest-work__list-item${
                idx === index ? " is-active" : ""
              }`}
            >
              {name}
            </li>
          ))}
        </ul>
        <div className="latest-work__meta">
          <h3 className="latest-work__name">{title}</h3>
          <p className="latest-work__tagline">{subtitle}</p>
        </div>
      </div>

      <div className="latest-work__right">
        <div className="latest-work__device">
          <img
            src={image}
            alt={`${title} preview`}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </a>
  );
};

export default ProjectCard;
