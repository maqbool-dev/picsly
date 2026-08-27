import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Features from "./components/Features.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Formats from "./components/Formats.jsx";
import FaqPage from "./components/FaqPage.jsx";
import PrivacyPage from "./components/PrivacyPage.jsx";
import Footer from "./components/Footer.jsx";
import { PAGES } from "./components/nav.js";

const fromHash = () => {
  const h = (window.location.hash || "").replace("#", "");
  return PAGES.includes(h) ? h : "home";
};

export default function App() {
  // Three views behind the hash, so /#faq and /#privacy stay linkable and the
  // back button works. Studio only mounts on home.
  const [page, setPage] = useState(fromHash);

  useEffect(() => {
    const onHash = () => setPage(fromHash());
    const onNav = (e) => {
      const next = PAGES.includes(e.detail) ? e.detail : "home";
      window.location.hash = next === "home" ? "" : next;
      setPage(next);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("picsly:nav", onNav);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("picsly:nav", onNav);
    };
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Header page={page} />

      {/* Home stays mounted and is hidden rather than unmounted, so a queue of
          compressed files survives a trip to FAQ or Privacy and back. */}
      <main className={page === "home" ? undefined : "hidden"}>
        <Hero />
        <Features />
        <HowItWorks />
        <Formats />
      </main>
      {page === "faq" && <FaqPage />}
      {page === "privacy" && <PrivacyPage />}

      <Footer />
    </div>
  );
}
