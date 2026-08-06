import logo from "../assets/logo.png";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#privacy", label: "Privacy" },
  { href: "#faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 py-9" style={{ background: "#0C0C0B" }}>
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-5">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="" className="h-6 w-6" />
          <span className="text-[15px] font-semibold tracking-[-0.02em]">Picsly</span>
          <span className="text-[13px] text-subtle">
            — compress and convert, privately.
          </span>
        </div>
        <div className="flex flex-wrap gap-[18px] sm:ml-auto">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-[13px] text-subtle transition-colors hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
