import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../utils/gsap";
import projects from "../data/projects";
import { closeOverlayLoader } from "../loader";
import { routeUrl } from "../utils/paths";
import { appendFallbackSrcSet, buildSrcSet } from "../utils/images";

const useWorkDetailAnimations = ({
  sectionRef,
  prefersReducedMotion,
  project,
  titleWordRefs,
  descriptionRef,
  metaRowRefs,
  metaLinkRef,
  heroMediaRef,
  tileRefs,
  insightRefs,
  insightMediaRefs,
  resultsHeaderRef,
  metricRefs,
  testimonialRef,
  moreTitleRef,
  moreCardRefs,
}) => {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !project || prefersReducedMotion) return;

    const titleWords = titleWordRefs.current.filter(Boolean);
    const description = descriptionRef.current;
    const metaRows = metaRowRefs.current.filter(Boolean);
    const metaLink = metaLinkRef.current;
    const heroMedia = heroMediaRef.current;
    const tiles = tileRefs.current.filter(Boolean);
    const insights = insightRefs.current.filter(Boolean);
    const insightMedia = insightMediaRefs.current.filter(Boolean);
    const resultsHeader = resultsHeaderRef.current;
    const metrics = metricRefs.current.filter(Boolean);
    const testimonial = testimonialRef.current;
    const moreTitle = moreTitleRef.current;
    const moreCards = moreCardRefs.current.filter(Boolean);

    const ctx = gsap.context(() => {
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
      });

      gsap.set([heroMedia, ...tiles].filter(Boolean), {
        autoAlpha: 0,
        y: 30,
        scale: 0.96,
      });

      if (insights.length) {
        gsap.set(insights, { autoAlpha: 0, y: 24 });
      }

      if (insightMedia.length) {
        gsap.set(insightMedia, { autoAlpha: 0, y: 24 });
      }

      if (resultsHeader) {
        gsap.set(resultsHeader, { autoAlpha: 0, y: 22 });
      }

      if (metrics.length) {
        gsap.set(metrics, { autoAlpha: 0, y: 16 });
      }

      if (testimonial) {
        gsap.set(testimonial, { autoAlpha: 0, y: 20 });
      }

      if (moreTitle) {
        gsap.set(moreTitle, { autoAlpha: 0, y: 20 });
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
  }, [prefersReducedMotion, project?.id]);
};

const WorkDetail = ({ id }) => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const titleWordRefs = useRef([]);
  const descriptionRef = useRef(null);
  const metaRowRefs = useRef([]);
  const metaLinkRef = useRef(null);
  const heroMediaRef = useRef(null);
  const tileRefs = useRef([]);
  const insightRefs = useRef([]);
  const insightMediaRefs = useRef([]);
  const resultsHeaderRef = useRef(null);
  const metricRefs = useRef([]);
  const testimonialRef = useRef(null);
  const moreTitleRef = useRef(null);
  const moreCardRefs = useRef([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const timeRafRef = useRef(null);
  const pendingTimeRef = useRef(0);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const saveData = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return Boolean(navigator.connection && navigator.connection.saveData);
  }, []);
  const shouldAutoplay = !prefersReducedMotion && !saveData;
  const shouldLoop = !prefersReducedMotion;
  const videoPreload = shouldLoadVideo
    ? saveData
      ? "none"
      : "metadata"
    : "none";

  useEffect(() => {
    closeOverlayLoader();
  }, []);

  const project = projects.find((item) => item.id === id);
  const challenges = project?.challenges;
  const solutions = project?.solutions;
  const solutionVideo = project?.solutionVideo;
  const solutionPoster = project?.solutionPoster;
  const solutionInsightIndex = challenges ? 1 : 0;
  const allowVideoLoad = Boolean(
    solutionVideo && !prefersReducedMotion && !saveData
  );

  useEffect(() => {
    if (!allowVideoLoad) {
      setShouldLoadVideo(false);
      return undefined;
    }
    const target = videoContainerRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setShouldLoadVideo(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [allowVideoLoad]);

  titleWordRefs.current = [];
  metaRowRefs.current = [];
  tileRefs.current = [];
  insightRefs.current = [];
  insightMediaRefs.current = [];
  metricRefs.current = [];
  moreCardRefs.current = [];

  useWorkDetailAnimations({
    sectionRef,
    prefersReducedMotion,
    project,
    titleWordRefs,
    descriptionRef,
    metaRowRefs,
    metaLinkRef,
    heroMediaRef,
    tileRefs,
    insightRefs,
    insightMediaRefs,
    resultsHeaderRef,
    metricRefs,
    testimonialRef,
    moreTitleRef,
    moreCardRefs,
  });

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
    pendingTimeRef.current = event.currentTarget.currentTime || 0;
    if (timeRafRef.current) return;
    timeRafRef.current = window.requestAnimationFrame(() => {
      timeRafRef.current = null;
      setCurrentTime(pendingTimeRef.current);
    });
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

  useEffect(() => {
    return () => {
      if (timeRafRef.current) {
        window.cancelAnimationFrame(timeRafRef.current);
      }
    };
  }, []);

  if (!project) {
    return (
      <section className="work-detail" ref={sectionRef}>
        <div className="work-detail__inner px-32 lg:px-48">
          <p className="work-detail__eyebrow">Work not found</p>
          <h1 className="work-detail__title">Project missing</h1>
          <p className="work-detail__description">
            The project you are looking for does not exist yet.
          </p>
          <a className="work-detail__back" href={routeUrl("#latest-work")}>
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
  const heroSrcSet = appendFallbackSrcSet(
    buildSrcSet(project.image),
    project.image
  );
  const heroSizes = "(max-width: 900px) 92vw, 70vw";

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
                  <span
                    className="work-detail__title-word-inner"
                    ref={(el) => {
                      titleWordRefs.current[index] = el;
                    }}
                  >
                    {word}
                  </span>
                  {index < titleWords.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>
            <p className="work-detail__description" ref={descriptionRef}>
              {description}
            </p>
          </div>

          <div className="work-detail__meta">
            <div
              className="work-detail__meta-row"
              ref={(el) => {
                metaRowRefs.current[0] = el;
              }}
            >
              <span className="work-detail__meta-label">(Year)</span>
              <span className="work-detail__meta-value">{project.year}</span>
            </div>
            <div
              className="work-detail__meta-row"
              ref={(el) => {
                metaRowRefs.current[1] = el;
              }}
            >
              <span className="work-detail__meta-label">(Timeline)</span>
              <span className="work-detail__meta-value">{project.timeline}</span>
            </div>
            <div
              className="work-detail__meta-row"
              ref={(el) => {
                metaRowRefs.current[2] = el;
              }}
            >
              <span className="work-detail__meta-label">(Services)</span>
              <span className="work-detail__meta-value">{serviceText}</span>
            </div>
            {project.liveUrl ? (
              <a
                className="work-detail__meta-link"
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                ref={metaLinkRef}
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
          <div className="work-detail__hero-media" ref={heroMediaRef}>
            <img
              src={project.image}
              srcSet={heroSrcSet || undefined}
              sizes={heroSrcSet ? heroSizes : undefined}
              alt={`${project.title} hero`}
              decoding="async"
            />
          </div>
          <div className="work-detail__grid">
            {project.gallery?.map((src, index) => (
              <div
                key={`${project.id}-gallery-${index}`}
                className="work-detail__tile"
                ref={(el) => {
                  tileRefs.current[index] = el;
                }}
              >
                <img
                  src={src}
                  srcSet={appendFallbackSrcSet(buildSrcSet(src), src) || undefined}
                  sizes="(max-width: 900px) 44vw, 22vw"
                  alt={`${project.title} detail ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

        {(challenges || solutions) && (
          <div className="work-detail__insights mt-56 xl:mt-80">
            {challenges && (
              <div
                className="work-detail__insight"
                ref={(el) => {
                  insightRefs.current[0] = el;
                }}
              >
                <p className="work-detail__insight-title">Challenges</p>
                <p className="work-detail__insight-body">{challenges}</p>
              </div>
            )}
            {solutions && (
              <div
                className="work-detail__insight"
                ref={(el) => {
                  insightRefs.current[solutionInsightIndex] = el;
                }}
              >
                <p className="work-detail__insight-title">Solutions</p>
                <div className="work-detail__insight-content">
                  <p className="work-detail__insight-body">{solutions}</p>
                </div>
                {solutionVideo && (
                  <div className="work-detail__insight-media-shell">
                    <div
                      className="work-detail__insight-media"
                      ref={(el) => {
                        insightMediaRefs.current[0] = el;
                        videoContainerRef.current = el;
                      }}
                    >
                      {shouldLoadVideo ? (
                        <>
                          <video
                            ref={videoRef}
                            className="work-detail__insight-video"
                            src={solutionVideo}
                            poster={solutionPoster}
                            autoPlay={shouldAutoplay}
                            loop={shouldLoop}
                            muted
                            playsInline
                            preload={videoPreload}
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
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 text-center">
                          <p className="text-sm text-neutral-400">
                            The video loads after you scroll near it or tap to
                            load, saving bandwidth until you are ready.
                          </p>
                          <button
                            type="button"
                            className="mt-2 text-xs font-semibold uppercase tracking-[0.2em]"
                            onClick={() => setShouldLoadVideo(true)}
                          >
                            Load preview
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {results && (
          <div className="work-detail__results">
            <div
              className="work-detail__results-header"
              ref={resultsHeaderRef}
            >
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
                        ref={(el) => {
                          metricRefs.current[index] = el;
                        }}
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
              <div className="work-detail__testimonial" ref={testimonialRef}>
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
                        loading="lazy"
                        decoding="async"
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
              <h2 className="work-detail__more-title" ref={moreTitleRef}>
                More Works
              </h2>
              <a className="work-detail__more-link" href={routeUrl("works")}>
                <span className="work-detail__more-link-text">See All</span>
                <span className="work-detail__more-link-icon" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
            <div className="work-detail__more-grid">
              {moreWorks.map((item, index) => (
                <a
                  key={item.id}
                  className="work-detail__more-card"
                  href={routeUrl(`works/${encodeURIComponent(item.id)}`)}
                  ref={(el) => {
                    moreCardRefs.current[index] = el;
                  }}
                >
                  <div className="work-detail__more-media">
                    <img
                      src={item.image}
                      srcSet={
                        appendFallbackSrcSet(
                          buildSrcSet(item.image),
                          item.image
                        ) || undefined
                      }
                      sizes="(max-width: 900px) 80vw, 26vw"
                      alt={`${item.title} preview`}
                      loading="lazy"
                      decoding="async"
                    />
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
