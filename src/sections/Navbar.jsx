import { useState } from "react";
import { assetUrl, routeUrl } from "../utils/paths";
function Navigation({ onNavigate }) {
  return (
    <ul className="nav-ul">
      <li className="nav-li">
        <a className="nav-link js-nav-item" href={routeUrl("#home")} onClick={onNavigate}>
          Home
        </a>
      </li>
      <li className="nav-li">
        <a className="nav-link js-nav-item" href={routeUrl("#about")} onClick={onNavigate}>
          About
        </a>
      </li>
      <li className="nav-li">
        <a className="nav-link js-nav-item" href={routeUrl("works")} onClick={onNavigate}>
          Work
        </a>
      </li>
      <li className="nav-li">
        <a className="nav-link js-nav-item" href={routeUrl("#tidycall")} onClick={onNavigate}>
          Contact
        </a>
      </li>
    </ul>
  );
}
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed inset-x-0 top-0 z-30 w-full py-3 nav-shell js-navbar px-32 lg:px-48">
      <div className="mx-auto c-space  nav-inner">
        <div className="flex items-center justify-between py-2">
          <a href={routeUrl("#home")} className="nav-brand" aria-label="Essabir home">
            <img
              src={assetUrl("logos/EssabirLogo.svg")}
              alt="Essabir logo"
              className="nav-brand__logo"
            />
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex cursor-pointer text-neutral-300 hover:text-white focus:outline-none sm:hidden"
          >
            <img
              src={
                isOpen
                  ? assetUrl("close.svg")
                  : assetUrl("menu.svg")
              }
              className="w-6 h-6"
              alt="toggle"
            />
          </button>
          <nav className="hidden sm:flex">
            <Navigation onNavigate={() => setIsOpen(false)} />
          </nav>
        </div>
      </div>
      <div
        className={`block overflow-hidden text-center sm:hidden nav-panel${
          isOpen ? " nav-panel--open" : ""
        }`}
        aria-hidden={!isOpen}
      >
        <nav className="pb-5">
          <Navigation onNavigate={() => setIsOpen(false)} />
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
