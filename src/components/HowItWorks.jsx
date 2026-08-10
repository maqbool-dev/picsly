import { FadeUp } from "./FadeUp.jsx";

const STEPS = [
  {
    n: "01",
    title: "Drop your files",
    body: "Drag them in, click to browse, or paste from the clipboard.",
  },
  {
    n: "02",
    title: "Set the ceiling",
    body: "Pick a size limit and a format. Picsly re-encodes until the result fits.",
  },
  {
    n: "03",
    title: "Compare, then download",
    body: "Check it side by side. If it looks right, take it.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="border-t border-line px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-[900px]">
        <FadeUp className="mb-8 sm:mb-10">
          <h2 className="text-2xl font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[34px]">
            Three steps, no sign-up.
          </h2>
        </FadeUp>

        <ol className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
          {STEPS.map((s, i) => (
            <FadeUp as="li" key={s.n} delay={i * 0.08}>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[13px] text-amber">{s.n}</span>
                <h3 className="text-base font-semibold tracking-[-0.01em]">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </FadeUp>
          ))}
        </ol>
      </div>
    </section>
  );
}
