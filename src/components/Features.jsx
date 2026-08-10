import { FadeUp } from "./FadeUp.jsx";
import { Target, Shield, Layers, Grid, SplitView, Bolt } from "./icons.jsx";

const FEATURES = [
  {
    Icon: Target,
    title: "An exact ceiling",
    body: "Type 200 KB. Picsly searches quality and scale until it finds the best file that fits underneath.",
  },
  {
    Icon: Shield,
    title: "Nothing leaves the tab",
    body: "Encoding happens on your device. No upload, no queue, no server logs.",
  },
  {
    Icon: Layers,
    title: "Five formats",
    body: "JPEG, PNG, WebP and AVIF out. Phone HEIC in, converted to something the web can read.",
  },
  {
    Icon: Grid,
    title: "Fifty at a time",
    body: "One target applies to the whole batch. Download them one by one or all at once.",
  },
  {
    Icon: SplitView,
    title: "Check before you keep",
    body: "A full-resolution split view to weigh the result against the original.",
  },
  {
    Icon: Bolt,
    title: "Works offline",
    body: "No round trip. Once the page has loaded, it keeps working on a plane.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-line px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-[900px]">
        <FadeUp className="mb-8 flex max-w-[52ch] flex-col gap-3 sm:mb-10">
          <h2 className="text-2xl font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[34px]">
            One job, done properly.
          </h2>
          <p className="text-[15px] text-muted">
            Most compressors give you a slider and a shrug. Picsly works
            backwards from the number you actually need.
          </p>
        </FadeUp>

        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
          {FEATURES.map(({ Icon, title, body }, i) => (
            <FadeUp key={title} delay={(i % 3) * 0.06}>
              <div className="flex h-full flex-col gap-3 rounded-xl border border-line p-5 transition-colors hover:border-line2">
                <span className="text-subtle">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-[15px] font-semibold tracking-[-0.01em]">{title}</h3>
                <p className="text-sm leading-relaxed text-muted">{body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
