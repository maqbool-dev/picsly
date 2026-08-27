import logo from "../assets/logo.png";
import { Upload } from "./icons.jsx";
import { goTo, openPicker } from "./nav.js";

const NAV = [
  ["home", "Compress"],
  ["faq", "FAQ"],
  ["privacy", "Privacy"],
];

export default function Header({ page }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line backdrop-blur-xl" style={{ background: "rgba(10,10,9,0.78)" }}>
      <div className="mx-auto flex max-w-page items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => goTo("home")}
          className="mr-auto flex flex-none items-center gap-[9px] text-ink"
        >
          <img src={logo} alt="Picsly" width="27" height="27" className="block h-[27px] w-[27px] object-contain" />
          <span className="whitespace-nowrap text-base font-semibold tracking-[-0.01em]">Picsly</span>
        </button>

        <nav className="hidden items-center gap-0.5 sm:flex">
          {NAV.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => goTo(key)}
              aria-current={page === key ? "page" : undefined}
              className={`nav-btn ${page === key ? "bg-surface2 !text-ink" : ""}`}
            >
              {label}
            </button>
          ))}
        </nav>

        <button type="button" onClick={openPicker} className="btn-primary whitespace-nowrap !py-[9px]">
          <Upload className="h-[15px] w-[15px]" />
          <span className="hidden sm:inline">Choose images</span>
          <span className="sm:hidden">Choose</span>
        </button>
      </div>
    </header>
  );
}
