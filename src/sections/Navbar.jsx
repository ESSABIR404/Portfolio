import { useState } from "react";
import { motion } from "motion/react";
function Navigation() {
  return (
    <ul className="nav-ul">
      <li className="nav-li">
        <a className="nav-link js-nav-item" href="/#home">
          Home
        </a>
      </li>
      <li className="nav-li">
        <a className="nav-link js-nav-item" href="/#about">
          About
        </a>
      </li>
      <li className="nav-li">
        <a className="nav-link js-nav-item" href="/works">
          Work
        </a>
      </li>
      <li className="nav-li">
        <a className="nav-link js-nav-item" href="/#tidycall">
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
          <a href="/#home" className="nav-brand" aria-label="Essabir home">
            <img
              src="/assets/logos/EssabirLogo.svg"
              alt="Essabir logo"
              className="nav-brand__logo"
            />
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex cursor-pointer text-neutral-300 hover:text-white focus:outline-none sm:hidden"
          >
            <img
              src={isOpen ? "/assets/close.svg" : "/assets/menu.svg"}
              className="w-6 h-6"
              alt="toggle"
            />
          </button>
          <nav className="hidden sm:flex">
            <Navigation />
          </nav>
        </div>
      </div>
      {isOpen && (
        <motion.div
          className="block overflow-hidden text-center sm:hidden nav-panel"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ maxHeight: "100vh" }}
          transition={{ duration: 1 }}
        >
          <nav className="pb-5">
            <Navigation />
          </nav>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
