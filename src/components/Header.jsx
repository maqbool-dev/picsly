import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

export default function Header() {
  // Past the top of the page the bar deepens (more opaque + stronger blur +
  // visible border) so the nav stays legible over scrolling content. The
  // change is transitioned, not snapped; under reduced motion the global CSS
  // collapses transition durations so it simply appears in its end state.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-line bg-paper/95 shadow-[0_10px_30px_-16px_rgba(0,0,0,0.7)]"
          : "border-line/50 bg-paper/70"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <img src={logo} alt="Picsly" className="logo-glow h-8 w-auto" />
          <span className="font-display text-lg font-bold tracking-tight">Picsly</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          <a href="#convert" className="transition-colors hover:text-ink">Convert</a>
          <a href="#features" className="transition-colors hover:text-ink">Features</a>
          <a href="#how" className="transition-colors hover:text-ink">How it works</a>
          <a href="#faq" className="transition-colors hover:text-ink">FAQ</a>
        </nav>

        <a href="#tool" className="btn-primary px-5 py-2 text-sm">Compress an image</a>
      </div>
    </header>
  );
}
