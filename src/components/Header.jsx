import logo from "../assets/logo.png";
import { Upload } from "./icons.jsx";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#privacy", label: "Privacy" },
  { href: "#faq", label: "FAQ" },
];

// Studio listens for this so the header / closing CTA can open the file picker
// without prop drilling through the page.
export const openPicker = () => window.dispatchEvent(new Event("picsly:browse"));

export default function Header() {
  return (
    <header
      className="sticky top-0 z-[60] border-b border-line backdrop-blur-2xl"
      style={{ background: "rgba(10,10,9,.78)" }}
    >
      <div className="container-page flex flex-wrap items-center gap-4 py-3">
        <a href="#top" className="mr-auto flex items-center gap-2.5">
          <img src={logo} alt="Picsly" className="block h-7 w-7" />
          <span className="text-[17px] font-semibold tracking-[-0.02em] text-ink">
            Picsly
          </span>
        </a>

        <nav className="hidden flex-wrap items-center gap-0.5 sm:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <button type="button" onClick={openPicker} className="btn-primary">
          <Upload className="h-4 w-4" />
          Compress an image
        </button>
      </div>
    </header>
  );
}
