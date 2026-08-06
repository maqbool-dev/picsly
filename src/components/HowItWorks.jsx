import { FadeUp } from "./FadeUp.jsx";

const STEPS = [
  {
    n: "01",
    title: "Drop your files",
    body: "Drag them in, click to browse, or paste straight from the clipboard. They stay on your machine.",
  },
  {
    n: "02",
    title: "Set the ceiling",
    body: "Pick a size limit and an output format. Picsly re-encodes repeatedly until the result fits.",
  },
  {
    n: "03",
    title: "Compare, then download",
    body: "Inspect it side by side. If it looks right, take it. If not, change the number and run again.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="border-t border-line px-5 py-14 sm:py-24"
      style={{ background: "linear-gradient(180deg,#0C0C0B,var(--pl-bg) 60%)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <FadeUp className="mb-8 flex max-w-[56ch] flex-col gap-3 sm:mb-12">
          <span className="eyebrow">How it works</span>
          <h2 className="text-[28px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[46px]">
            Three steps, no sign-up.
          </h2>
        </FadeUp>

        <ol className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {STEPS.map((s, i) => (
            <FadeUp as="li" key={s.n} delay={i * 0.08}>
              <div
                className="flex h-full flex-col gap-3 rounded-2xl border border-line px-6 py-6"
                style={{ background: "rgba(255,255,255,.015)" }}
              >
                <span className="font-mono text-[13px] font-bold text-amber">{s.n}</span>
                <h3 className="text-xl font-semibold tracking-[-0.02em]">{s.title}</h3>
                <p className="text-[14.5px] leading-relaxed text-muted">{s.body}</p>
              </div>
            </FadeUp>
          ))}
        </ol>
      </div>
    </section>
  );
}
