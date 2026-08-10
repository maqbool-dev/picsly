// A single, static warmth behind the hero — no canvas, no particles, no grid,
// no pointer tracking. Just enough glow to keep the page from reading flat.
export default function HeroGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2"
      style={{
        background:
          "radial-gradient(closest-side,rgba(253,176,34,.07),transparent 70%)",
      }}
    />
  );
}
