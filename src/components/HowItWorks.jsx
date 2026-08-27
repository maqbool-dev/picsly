const STEPS = [
  {
    n: "01",
    title: "Drop, paste or browse",
    body: "JPEG, PNG, WebP, AVIF and iPhone HEIC, up to 50 files and 50 MB each.",
  },
  {
    n: "02",
    title: "Picsly searches for the fit",
    body: "Up to nine encodes per file, halving in on the highest quality that lands under your ceiling. If quality alone can't get there, it steps the dimensions down and tries again.",
  },
  {
    n: "03",
    title: "Check it, then take it",
    body: "Drag the comparison slider to see exactly what you gave up. Download one file, or all of them.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="border-t border-line px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto flex max-w-page flex-col gap-7 sm:gap-12">
        <div data-reveal className="flex max-w-[620px] flex-col gap-3.5">
          <span className="eyebrow">How it works</span>
          <h2 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[38px]">
            Three steps, about four seconds.
          </h2>
          <p className="text-[15px] leading-relaxed text-muted sm:text-base">
            The interesting part is step two, and you never have to think about it.
          </p>
        </div>

        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))] sm:gap-8">
          {STEPS.map((s) => (
            <div key={s.n} data-reveal className="flex gap-4">
              <span className="font-mono text-[13px] font-semibold text-amber">{s.n}</span>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-semibold tracking-[-0.01em]">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
