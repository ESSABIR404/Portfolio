import { useState } from "react";
import { assetUrl, routeUrl } from "../utils/paths";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Work", href: "works" },
  { label: "Contact", href: "#tidycall" },
];

/**
 * Navigation menu component.
 * Renders responsive navigation with mobile support.
 */
const Navigation = ({ onNavigate }) => (
  <ul className="nav-ul">
    {NAV_ITEMS.map(({ label, href }) => (
      <li key={label} className="nav-li">
        <a
          className="nav-link js-nav-item"
          href={routeUrl(href)}
          onClick={onNavigate}
        >
          {label}
        </a>
      </li>
    ))}
  </ul>
);

/**
 * Navigation bar component with mobile menu toggle.
 * Uses CSS-driven animations for smooth interactions.
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="fixed inset-x-0 top-0 z-30 w-full py-3 nav-shell js-navbar px-32 lg:px-48">
      <div className="mx-auto c-space nav-inner">
        <div className="flex items-center justify-between py-2">
          {/* Logo */}
          <a
            href={routeUrl("#home")}
            className="nav-brand"
            aria-label="Essabir home"
          >
            <img
              src={assetUrl("logos/EssabirLogo.svg")}
              alt="Essabir logo"
              className="nav-brand__logo"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex">
            <Navigation onNavigate={closeMenu} />
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="navbar-panel"
            onClick={toggleMenu}
            className="flex cursor-pointer text-neutral-300 hover:text-white focus:outline-none sm:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <img
              src={assetUrl(isOpen ? "close.svg" : "menu.svg")}
              className="w-6 h-6"
              alt=""
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <div
        id="navbar-panel"
        role="menu"
        className={`block overflow-hidden text-center sm:hidden nav-panel${
          isOpen ? " nav-panel--open" : ""
        }`}
        aria-hidden={!isOpen}
      >
        <nav className="pb-5">
          <Navigation onNavigate={closeMenu} />
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
