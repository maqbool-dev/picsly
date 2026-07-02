import { motion } from "motion/react";

// Small pill for a format. Display-only when no `onClick` is given (used for
// the auto-detected source format); a clickable single-select control
// otherwise (used for the destination row). `dim` softens a clickable pill
// without disabling it (e.g. converting to the same format — harmless but
// pointless). Hover/press micro-interactions respect reduced motion via the
// app-level <MotionConfig reducedMotion="user">.
export default function FormatPill({ label, active = false, dim = false, onClick }) {
  const base = `inline-flex items-center rounded-full px-3.5 py-1.5 font-mono text-xs font-medium tracking-wide transition-colors ${
    active
      ? "border border-amber bg-amber-soft text-amber"
      : "border border-line text-ink"
  } ${dim && !active ? "opacity-60" : ""}`;

  if (!onClick) {
    return (
      <span className={base} aria-label={`Source format ${label}`}>
        {label}
      </span>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`${base} cursor-pointer hover:border-amber/50`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
    >
      {label}
    </motion.button>
  );
}
