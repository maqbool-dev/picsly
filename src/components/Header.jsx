import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <img src={logo} alt="Picsly" className="logo-glow h-8 w-auto" />
          <span className="font-display text-lg font-bold tracking-tight">Picsly</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          <a href="#features" className="transition-colors hover:text-ink">Features</a>
          <a href="#how" className="transition-colors hover:text-ink">How it works</a>
          <a href="#faq" className="transition-colors hover:text-ink">FAQ</a>
        </nav>

        <a href="#tool" className="btn-primary px-5 py-2 text-sm">Compress an image</a>
      </div>
    </header>
  );
}
