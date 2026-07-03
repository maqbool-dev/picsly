import { useMemo } from "react";
import { motion } from "motion/react";

// A handful of warm embers drifting up behind the upload card — echoes the
// hero video. Kept deliberately low-count for performance. The parent only
// renders this when motion is allowed; on drag-over it passes active=true to
// speed AND densify the drift so dropping a file feels reactive.

// Single JS-side source for the ember particle palette (mirrors the amber /
// ember / spark Tailwind tokens). Imported by FormatWeaver too — keep in sync
// with tailwind.config.js.
export const EMBER_COLORS = ["#F5A524", "#F2682C", "#D9342B"];

const BASE_COUNT = 14;
const ACTIVE_EXTRA = 6; // extra sparks that only appear during drag-over

function makeDots(count, offset = 0) {
  return Array.from({ length: count }, (_, i) => ({
    id: offset + i,
    left: Math.random() * 100, // %
    size: 3 + Math.random() * 4, // px
    color: EMBER_COLORS[(offset + i) % EMBER_COLORS.length],
    duration: 6 + Math.random() * 6, // 6–12s
    delay: Math.random() * 6,
    drift: (Math.random() - 0.5) * 48, // horizontal sway, px
    peak: 0.2 + Math.random() * 0.4, // opacity flicker peak 0.2–0.6
    rise: 320 + Math.random() * 220, // vertical travel, px
  }));
}

function Dot({ d, active }) {
  return (
    <motion.span
      style={{
        position: "absolute",
        bottom: -12,
        left: `${d.left}%`,
        width: d.size,
        height: d.size,
        borderRadius: "9999px",
        background: d.color,
        filter: "blur(1px)",
      }}
      initial={{ y: 0, x: 0, opacity: 0 }}
      animate={{
        y: [0, -d.rise],
        x: [0, d.drift, 0],
        opacity: [0, d.peak, d.peak, 0],
      }}
      transition={{
        duration: active ? d.duration * 0.55 : d.duration,
        delay: active ? d.delay * 0.3 : d.delay,
        repeat: Infinity,
        ease: "easeOut",
        times: [0, 0.2, 0.8, 1],
      }}
    />
  );
}

export default function EmberField({ active = false }) {
  const dots = useMemo(() => makeDots(BASE_COUNT), []);
  // A second, small batch that only renders during drag-over — denser sparks
  // while the user is holding a file, settling back on drop. Total particle
  // count stays capped at BASE_COUNT + ACTIVE_EXTRA.
  const extras = useMemo(() => makeDots(ACTIVE_EXTRA, BASE_COUNT), []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {dots.map((d) => (
        <Dot key={d.id} d={d} active={active} />
      ))}
      {active && extras.map((d) => <Dot key={d.id} d={d} active />)}
    </div>
  );
}
