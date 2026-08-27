import { Grid, Shield, Target } from "./icons.jsx";

const ITEMS = [
  {
    Icon: Target,
    tone: "text-amber",
    title: "A real ceiling, not a guess",
    body: "Type 200 KB. Picsly binary-searches quality, then resolution, until it finds the largest file that still fits underneath. You get the number you were asked for.",
  },
  {
    Icon: Shield,
    tone: "text-ok",
    title: "Your photos stay yours",
    body: "Encoding happens in this tab, using your own browser and CPU. There is no upload step to trust, no server log to wonder about, and nothing to delete afterwards.",
  },
  {
    Icon: Grid,
    tone: "text-amber-light",
    title: "Fifty files, one pass",
    body: "Drop a folder of iPhone HEICs and get web-ready WebP back. Change the ceiling afterwards and re-run the whole batch without re-adding a thing.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-line bg-paper2 px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto flex max-w-page flex-col gap-7 sm:gap-12">
        <div data-reveal className="flex max-w-[620px] flex-col gap-3.5">
          <span className="eyebrow">One job</span>
          <h2 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[38px]">
            Done properly, on your machine.
          </h2>
          <p className="text-[15px] leading-relaxed text-muted sm:text-base">
            No queue, no server, no account wall between you and a smaller file.
            Three things make that possible.
          </p>
        </div>

        <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
          {ITEMS.map(({ Icon, tone, title, body }) => (
            <div
              key={title}
              data-reveal
              className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-line2 sm:p-6"
            >
              <span className={`grid h-10 w-10 place-items-center rounded-[11px] border border-line bg-surface2 ${tone}`}>
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <h3 className="text-base font-semibold tracking-[-0.01em]">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
