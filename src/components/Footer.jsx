import logo from "../assets/logo.png";
import { goTo } from "./nav.js";

const NAV = [
  ["home", "Compress"],
  ["faq", "FAQ"],
  ["privacy", "Privacy"],
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper2 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-page flex-wrap items-center gap-x-4 gap-y-3">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="" width="22" height="22" className="h-[22px] w-[22px] object-contain" />
          <span className="text-sm font-semibold text-ink">Picsly</span>
          <span className="text-[13px] text-subtle">— compress images to an exact size</span>
        </div>
        <div className="flex gap-1 sm:ml-auto">
          {NAV.map(([key, label]) => (
            <button key={key} type="button" onClick={() => goTo(key)} className="nav-btn !text-[13px]">
              {label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
