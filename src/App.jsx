import { MotionConfig } from "motion/react";
import Header from "./components/Header.jsx";
import HeroBackground from "./components/HeroBackground.jsx";
import Hero from "./components/Hero.jsx";
import UploadSection from "./components/UploadSection.jsx";
import FormatWeaver from "./components/FormatWeaver.jsx";
import Features from "./components/Features.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import FAQ from "./components/FAQ.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  // NOTE: the cursor-following spotlight (rAF loop writing --glow-x/--glow-y,
  // rendered by a body::before layer) was removed before launch — it didn't
  // land visually. Card borders now warm on plain CSS :hover instead of
  // pointer proximity (see .card in index.css). Don't reintroduce a
  // mouse-tracked glow without a strong reason.
  return (
    // reducedMotion="user" makes every Motion animation (FadeUp, ambient glow)
    // automatically drop transforms and keep only opacity when the user asks.
    <MotionConfig reducedMotion="user">
      <div className="relative z-10 min-h-screen">
        {/* Fixed video/scrim behind everything; hero is transparent over it. */}
        <HeroBackground />
        <Header />
        {/* main sits above the fixed z-0 background so opaque sections cover it. */}
        <main className="relative z-[1]">
          <Hero />
          <UploadSection />
          <FormatWeaver />
          <Features />
          <HowItWorks />
          <FAQ />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
