import { MotionConfig } from "motion/react";
import Header from "./components/Header.jsx";
import Studio from "./components/Studio.jsx";
import Features from "./components/Features.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Privacy from "./components/Privacy.jsx";
import FAQ from "./components/FAQ.jsx";
import CTA from "./components/CTA.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    // reducedMotion="user" makes every Motion animation drop its transform and
    // keep only opacity when the user asks for reduced motion. The canvas hero
    // and the CSS keyframes are gated separately.
    <MotionConfig reducedMotion="user">
      <div id="top" className="min-h-screen bg-paper">
        <Header />
        <main>
          <Studio />
          <Features />
          <HowItWorks />
          <Privacy />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
