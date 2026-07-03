import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Compressor from "./Compressor.jsx";
import EmberField from "./EmberField.jsx";
import { FadeUp } from "./FadeUp.jsx";

// Wraps the compressor in ambient "life" that echoes the hero video: a softly
// breathing amber glow centered behind the card, plus a low ember field
// drifting across the section. Dragging a file over the area intensifies the
// glow and quickens the embers. Reduced-motion safe — no particles and a
// static glow when the user prefers reduced motion.
//
// NOTE: no cursor-tracking glow in here. The page-wide spotlight (body::before,
// driven by App.jsx) covers that; a section-scoped one gets clipped into a
// hard-edged box by this section's overflow-hidden. Every light source below
// is sized so its blurred extent fades out INSIDE the section at pulse peak.
function AmbientGlow({ active, reduce }) {
  // inset-0 + `closest-side` radial: the gradient reaches full transparency
  // before the section's nearest edge at ANY section height, so the section's
  // overflow-hidden can never slice it into a hard-edged box. Breathes via
  // opacity ONLY — blur or a scale pulse would push light past the edge again.
  const base = {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(circle closest-side at 50% 50%, rgba(245,165,36,0.32), rgba(242,104,44,0.13) 45%, transparent 95%)",
  };

  if (reduce) {
    return <div aria-hidden="true" style={{ ...base, opacity: active ? 0.55 : 0.35 }} />;
  }

  return (
    <motion.div
      aria-hidden="true"
      style={base}
      initial={{ opacity: 0.28 }}
      animate={{ opacity: active ? [0.5, 0.75, 0.5] : [0.3, 0.5, 0.3] }}
      transition={{
        duration: active ? 2.4 : 4,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    />
  );
}

export default function UploadSection() {
  const [dragActive, setDragActive] = useState(false);
  const reduce = useReducedMotion();

  return (
    <section
      id="tool"
      className="relative scroll-mt-24 overflow-hidden bg-paper py-16 sm:py-20"
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        // Only clear when the cursor truly leaves the section, not when it
        // crosses between child elements.
        if (!e.currentTarget.contains(e.relatedTarget)) setDragActive(false);
      }}
      onDrop={() => setDragActive(false)}
    >
      {/* Ambient layers sit behind the card (which is opaque) and bleed around
          its edges + into the section's vertical padding. */}
      <AmbientGlow active={dragActive} reduce={reduce} />
      {!reduce && <EmberField active={dragActive} />}

      <div className="container-page relative z-10">
        <FadeUp className="mx-auto max-w-xl">
          <Compressor />
        </FadeUp>
      </div>
    </section>
  );
}
