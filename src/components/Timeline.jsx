import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "../utils/gsap";

export const Timeline = ({ data }) => {
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const progressRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const update = () => {
      const rect = content.getBoundingClientRect();
      setHeight(rect.height);
    };

    update();

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(content);
    } else {
      window.addEventListener("resize", update);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const progress = progressRef.current;
    if (!container || !progress) return;

    gsap.set(progress, { height: 0, opacity: 0 });

    const ctx = gsap.context(() => {
      gsap.to(progress, {
        height,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "start 10%",
          end: "end 50%",
          scrub: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [height]);

  return (
    <div className="c-space section-spacing" ref={containerRef}>
      <h2 className="text-heading">My Work Experience</h2>
      <div ref={contentRef} className="relative pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky z-40 flex flex-col items-center self-start max-w-xs md:flex-row top-40 lg:max-w-sm md:w-full">
              <div className="absolute flex items-center justify-center w-10 h-10 rounded-full -left-[15px] bg-midnight">
                <div className="w-4 h-4 p-2 border rounded-full bg-neutral-800 border-neutral-700" />
              </div>
              <div className="flex-col hidden gap-2 text-xl font-bold md:flex md:pl-20 md:text-4xl text-neutral-300">
                <h3>{item.date}</h3>
                <h3 className="text-3xl text-neutral-400">{item.title}</h3>
                <h3 className="text-3xl text-neutral-500">{item.job}</h3>
              </div>
            </div>

            <div className="relative w-full pl-20 pr-4 md:pl-4">
              <div className="block mb-4 text-2xl font-bold text-left text-neutral-300 md:hidden ">
                <h3>{item.date}</h3>
                <h3>{item.job}</h3>
              </div>
              {item.contents.map((content, index) => (
                <p className="mb-3 font-normal text-neutral-400" key={index}>
                  {content}
                </p>
              ))}
            </div>
          </div>
        ))}
        <div
          ref={lineRef}
          style={{ height: height + "px" }}
          className="absolute md:left-1 left-1 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <div
            ref={progressRef}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-lavender/50 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
