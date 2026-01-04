import { FlipWords } from "./FlipWords";

const HeroText = () => {
  const words = ["Secure", "Modern", "Scalable"];
  return (
    <div className="z-10 mt-28 text-center md:mt-32 md:text-left">
      {/* Desktop View */}
      <div className="flex-col hidden md:flex c-space hero-panel">
        <h1 className="hero-kicker text-5xl font-medium lg:text-6xl js-hero-item">
          Hi I'm Yassine ESSABIR
        </h1>
        <div className="flex flex-col items-start">
          <p className="hero-line text-6xl font-medium lg:text-7xl leading-tight js-hero-item">
            A Developer <br /> Dedicated to Crafting
          </p>
          <div className="js-hero-item">
            <FlipWords
              words={words}
              className="hero-word font-black text-white text-8xl lg:text-9xl"
            />
          </div>
          <p className="hero-subline text-5xl font-medium lg:text-6xl js-hero-item">
            Web Solutions
          </p>
          <a
            href="#contact"
            className="btn-neon hover-animation mt-8 self-start js-hero-item"
          >
            Start a Project
          </a>
        </div>
      </div>
      {/* Mobile View */}
      <div className="flex flex-col space-y-6 md:hidden c-space">
        <p className="hero-kicker text-5xl font-medium sm:text-6xl js-hero-item">
          Hi,I'm Ali
        </p>
        <div>
          <p className="hero-line text-6xl font-black sm:text-7xl leading-tight js-hero-item">
            Building
          </p>
          <div className="js-hero-item">
            <FlipWords
              words={words}
              className="hero-word font-bold text-white text-8xl"
            />
          </div>
          <p className="hero-subline text-5xl font-black sm:text-6xl js-hero-item">
            Web Applications
          </p>
          <a
            href="#contact"
            className="btn-neon hover-animation mt-6 mx-auto js-hero-item"
          >
            Start a Project
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroText;
