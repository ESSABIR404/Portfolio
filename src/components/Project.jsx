const Project = ({ title, image, index, titles = [] }) => {
  const projectIndex = String(index + 1).padStart(2, "0");
  const listItems = (() => {
    if (!titles.length) return [];
    if (titles.length <= 3) return titles.map((name, idx) => ({ name, idx }));
    const start = Math.max(0, Math.min(titles.length - 3, index - 1));
    return titles.slice(start, start + 3).map((name, offset) => ({
      name,
      idx: start + offset,
    }));
  })();

  return (
    <article className="project-row">
      <div className="project-info">
        <span className="project-index" aria-hidden="true">
          {projectIndex}.
        </span>

        <ul className="project-list" aria-label="Project list">
          {listItems.map(({ name, idx }) => (
            <li
              key={`${name}-${idx}`}
              className={`project-list__item${
                idx === index ? " project-list__item--active" : ""
              }`}
            >
              {name}
            </li>
          ))}
        </ul>

        <div className="project-summary">
          <h3 className="project-title">{title}</h3>
        </div>
      </div>

      <div className="project-card">
        <div className="project-card__frame">
          <img src={image} alt={`${title} preview`} loading="lazy" />
        </div>
      </div>
    </article>
  );
};

export default Project;
