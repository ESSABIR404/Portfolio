import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projects from "../data/projects";
import { closeOverlayLoader } from "../loader";

gsap.registerPlugin(ScrollTrigger);

const WorkDetail = ({ id }) => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);

  useEffect(() => {
    closeOverlayLoader();
  }, []);

  const project = projects.find((item) => item.id === id);
  const challenges = project?.challenges;
  const solutions = project?.solutions;
  const solutionVideo = project?.solutionVideo;
  const solutionPoster = project?.solutionPoster;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !project) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const titleWords = gsap.utils.toArray(
        ".work-detail__title-word-inner",
        section
      );
      const description = section.querySelector(".work-detail__description");
      const metaRows = gsap.utils.toArray(".work-detail__meta-row", section);
      const metaLink = section.querySelector(".work-detail__meta-link");
      const heroMedia = section.querySelector(".work-detail__hero-media");
      const tiles = gsap.utils.toArray(".work-detail__tile", section);
      const insights = gsap.utils.toArray(".work-detail__insight", section);
      const insightMedia = gsap.utils.toArray(
        ".work-detail__insight-media",
        section
      );
      const resultsHeader = section.querySelector(
        ".work-detail__results-header"
      );
      const metrics = gsap.utils.toArray(".work-detail__metric", section);
      const testimonial = section.querySelector(
        ".work-detail__testimonial-card"
      );
      const moreTitle = section.querySelector(".work-detail__more-title");
      const moreCards = gsap.utils.toArray(".work-detail__more-card", section);

      if (titleWords.length) {
        gsap.set(titleWords, {
          yPercent: 120,
          rotateX: -80,
          autoAlpha: 0,
          transformOrigin: "50% 100%",
        });
      }

      gsap.set([description, ...metaRows, metaLink].filter(Boolean), {
        autoAlpha: 0,
        y: 18,
        filter: "blur(8px)",
      });

      gsap.set([heroMedia, ...tiles].filter(Boolean), {
        autoAlpha: 0,
        y: 30,
        scale: 0.96,
        filter: "blur(8px)",
      });

      if (insights.length) {
        gsap.set(insights, { autoAlpha: 0, y: 24, filter: "blur(8px)" });
      }

      if (insightMedia.length) {
        gsap.set(insightMedia, { autoAlpha: 0, y: 24, filter: "blur(8px)" });
      }

      if (resultsHeader) {
        gsap.set(resultsHeader, { autoAlpha: 0, y: 22, filter: "blur(6px)" });
      }

      if (metrics.length) {
        gsap.set(metrics, { autoAlpha: 0, y: 16 });
      }

      if (testimonial) {
        gsap.set(testimonial, { autoAlpha: 0, y: 20, filter: "blur(6px)" });
      }

      if (moreTitle) {
        gsap.set(moreTitle, { autoAlpha: 0, y: 20, filter: "blur(6px)" });
      }

      if (moreCards.length) {
        gsap.set(moreCards, { autoAlpha: 0, y: 24, scale: 0.98 });
      }

      const heroTl = gsap.timeline();

      if (titleWords.length) {
        heroTl.to(titleWords, {
          yPercent: 0,
          rotateX: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.06,
        });
      }

      heroTl.to(
        description,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.45"
      );

      heroTl.to(
        metaRows,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
        },
        "-=0.4"
      );

      if (metaLink) {
        heroTl.to(
          metaLink,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.35"
        );
      }

      if (heroMedia) {
        gsap.to(heroMedia, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heroMedia,
            start: "top 80%",
          },
        });
      }

      if (tiles.length) {
        gsap.to(tiles, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: tiles[0],
            start: "top 85%",
          },
        });
      }

      if (insights.length) {
        gsap.to(insights, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.18,
          scrollTrigger: {
            trigger: insights[0],
            start: "top 82%",
          },
        });
      }

      if (insightMedia.length) {
        gsap.to(insightMedia, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: insightMedia[0],
            start: "top 85%",
          },
        });
      }

      if (resultsHeader) {
        gsap.to(resultsHeader, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: resultsHeader,
            start: "top 85%",
          },
        });
      }

      if (metrics.length) {
        gsap.to(metrics, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: metrics[0],
            start: "top 85%",
          },
        });
      }

      if (testimonial) {
        gsap.to(testimonial, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: testimonial,
            start: "top 85%",
          },
        });
      }

      if (moreTitle) {
        gsap.to(moreTitle, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: moreTitle,
            start: "top 88%",
          },
        });
      }

      if (moreCards.length) {
        gsap.to(moreCards, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: moreCards[0],
            start: "top 85%",
          },
        });
      }

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [id, project]);

  const handleVideoToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
    }
  };

  const handleLoadedMetadata = (event) => {
    const video = event.currentTarget;
    setDuration(video.duration || 0);
    setCurrentTime(video.currentTime || 0);
  };

  const handleTimeUpdate = (event) => {
    if (isScrubbing) return;
    setCurrentTime(event.currentTarget.currentTime || 0);
  };

  const handleScrubStart = () => {
    setIsScrubbing(true);
  };

  const handleScrubEnd = () => {
    setIsScrubbing(false);
  };

  const handleScrub = (event) => {
    const value = Number(event.target.value);
    if (Number.isNaN(value)) return;
    setCurrentTime(value);
    if (videoRef.current) {
      videoRef.current.currentTime = value;
    }
  };

  const formatTime = (value) => {
    if (!Number.isFinite(value)) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  if (!project) {
    return (
      <section className="work-detail" ref={sectionRef}>
        <div className="work-detail__inner px-32 lg:px-48">
          <p className="work-detail__eyebrow">Work not found</p>
          <h1 className="work-detail__title">Project missing</h1>
          <p className="work-detail__description">
            The project you are looking for does not exist yet.
          </p>
          <a className="work-detail__back" href="/#latest-work">
            Back to latest work
          </a>
        </div>
      </section>
    );
  }

  const serviceText = project.services?.join(" / ");
  const description = project.description || project.subtitle;
  const titleWords = project.title.split(" ");
  const results = project.results;
  const metrics = results?.metrics || [];
  const client = results?.client;
  const clientInitials = client?.name
    ? client.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";
  const moreWorks = projects.filter((item) => item.id !== id).slice(0, 2);
  const safeCurrentTime = duration ? Math.min(currentTime, duration) : 0;
  const progress = duration ? (safeCurrentTime / duration) * 100 : 0;

  return (
    <section className="work-detail" ref={sectionRef}>
      <div className="work-detail__inner px-32 lg:px-48">
        {/* <a className="work-detail__back" href="/#latest-work">
          Back to latest work
        </a> */}

        <div className="work-detail__hero">
          <div className="work-detail__copy">
            {/* <p className="work-detail__eyebrow">Case Study</p> */}
            <h1 className="work-detail__title">
              {titleWords.map((word, index) => (
                <span
                  key={`${project.id}-word-${index}`}
                  className="work-detail__title-word"
                >
                  <span className="work-detail__title-word-inner">{word}</span>
                  {index < titleWords.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>
            <p className="work-detail__description">{description}</p>
          </div>

          <div className="work-detail__meta">
            <div className="work-detail__meta-row">
              <span className="work-detail__meta-label">(Year)</span>
              <span className="work-detail__meta-value">{project.year}</span>
            </div>
            <div className="work-detail__meta-row">
              <span className="work-detail__meta-label">(Timeline)</span>
              <span className="work-detail__meta-value">{project.timeline}</span>
            </div>
            <div className="work-detail__meta-row">
              <span className="work-detail__meta-label">(Services)</span>
              <span className="work-detail__meta-value">{serviceText}</span>
            </div>
            {project.liveUrl ? (
              <a
                className="work-detail__meta-link"
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span className="work-detail__meta-link-text">Live Website</span>
                <svg
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="work-detail__meta-link-icon"
                  width="12"
                  aria-hidden="true"
                >
                  <path
                    d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                    fill="currentColor"
                  ></path>
                </svg>
              </a>
            ) : null}
          </div>
        </div>

        <div className="work-detail__media">
          <div className="work-detail__hero-media">
            <img src={project.image} alt={`${project.title} hero`} />
          </div>
          <div className="work-detail__grid">
            {project.gallery?.map((src, index) => (
              <div
                key={`${project.id}-gallery-${index}`}
                className="work-detail__tile"
              >
                <img src={src} alt={`${project.title} detail ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {(challenges || solutions) && (
          <div className="work-detail__insights mt-56 xl:mt-80">
            {challenges && (
              <div className="work-detail__insight">
                <p className="work-detail__insight-title">Challenges</p>
                <p className="work-detail__insight-body">{challenges}</p>
              </div>
            )}
            {solutions && (
              <div className="work-detail__insight">
                <p className="work-detail__insight-title">Solutions</p>
                <div className="work-detail__insight-content">
                  <p className="work-detail__insight-body">{solutions}</p>
                </div>
                {solutionVideo && (
                  <div className="work-detail__insight-media-shell">
                    <div className="work-detail__insight-media">
                      <video
                        ref={videoRef}
                        className="work-detail__insight-video"
                        src={solutionVideo}
                        poster={solutionPoster}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onLoadedMetadata={handleLoadedMetadata}
                        onTimeUpdate={handleTimeUpdate}
                        aria-label={`${project.title} solution video`}
                      />
                      <div className="work-detail__video-controls">
                        <div className="work-detail__video-time">
                          <span>{formatTime(safeCurrentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                        <input
                          className="work-detail__video-progress"
                          type="range"
                          min="0"
                          max={duration || 0}
                          step="0.1"
                          value={safeCurrentTime}
                          onChange={handleScrub}
                          onPointerDown={handleScrubStart}
                          onPointerUp={handleScrubEnd}
                          onPointerCancel={handleScrubEnd}
                          onMouseDown={handleScrubStart}
                          onMouseUp={handleScrubEnd}
                          onTouchStart={handleScrubStart}
                          onTouchEnd={handleScrubEnd}
                          style={{ "--progress": `${progress}%` }}
                          aria-label="Video progress"
                        />
                      </div>
                      <button
                        type="button"
                        className="work-detail__video-button"
                        onClick={handleVideoToggle}
                        aria-label={isPlaying ? "Pause video" : "Play video"}
                        aria-pressed={isPlaying}
                      >
                        {isPlaying ? (
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <rect x="6.5" y="5" width="4.5" height="14" />
                            <rect x="13" y="5" width="4.5" height="14" />
                          </svg>
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path d="M8 5.5l10 6.5-10 6.5z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {results && (
          <div className="work-detail__results">
            <div className="work-detail__results-header">
              <p className="work-detail__insight-title">Results</p>
              <div className="work-detail__results-content">
                {results.summary && (
                  <p className="work-detail__results-summary">
                    {results.summary}
                  </p>
                )}
                {metrics.length > 0 && (
                  <div className="work-detail__metrics">
                    {metrics.map((metric, index) => (
                      <div
                        key={`${project.id}-metric-${index}`}
                        className="work-detail__metric"
                      >
                        <span className="work-detail__metric-value">
                          {metric.value}
                        </span>
                        <span className="work-detail__metric-label">
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {client?.quote && (
              <div className="work-detail__testimonial">
                <div className="work-detail__testimonial-card">
                  <span
                    className="work-detail__testimonial-mark"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <p className="work-detail__testimonial-body">{client.quote}</p>
                  <div className="work-detail__testimonial-divider" />
                  <div className="work-detail__client">
                    {client.avatar ? (
                      <img
                        className="work-detail__client-avatar"
                        src={client.avatar}
                        alt={`${client.name} portrait`}
                      />
                    ) : (
                      <div className="work-detail__client-avatar work-detail__client-avatar--placeholder">
                        {clientInitials}
                      </div>
                    )}
                    <div className="work-detail__client-meta">
                      <p className="work-detail__client-name">{client.name}</p>
                      <p className="work-detail__client-role">
                        {client.role}
                        {client.company ? ` at ${client.company}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {moreWorks.length > 0 && (
          <div className="work-detail__more">
            <div className="work-detail__more-header">
              <h2 className="work-detail__more-title">More Works</h2>
              <a className="work-detail__more-link" href="/works">
                <span className="work-detail__more-link-text">See All</span>
                <span className="work-detail__more-link-icon" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
            <div className="work-detail__more-grid">
              {moreWorks.map((item) => (
                <a
                  key={item.id}
                  className="work-detail__more-card"
                  href={`/works/${encodeURIComponent(item.id)}`}
                >
                  <div className="work-detail__more-media">
                    <img src={item.image} alt={`${item.title} preview`} />
                  </div>
                  <div className="work-detail__more-meta">
                    <p className="work-detail__more-name">{item.title}</p>
                    <p className="work-detail__more-subtitle">
                      {item.subtitle}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkDetail;
