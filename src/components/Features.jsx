import { FadeUp } from "./FadeUp.jsx";
import { Target, Shield, Layers, Grid, SplitView, Bolt } from "./icons.jsx";

const FEATURES = [
  {
    Icon: Target,
    title: "Hit an exact ceiling",
    body: "Type 200 KB. Picsly binary-searches quality and scale until it finds the best-looking file that still fits underneath.",
    accent: true,
  },
  {
    Icon: Shield,
    title: "Nothing leaves the tab",
    body: "Decoding and encoding happen on your own device. There is no upload, no queue and no server log to worry about.",
    tint: "ok",
  },
  {
    Icon: Layers,
    title: "Five formats",
    body: "JPEG, PNG, WebP and AVIF on the way out. Phone HEIC on the way in, converted to something the rest of the web can read.",
  },
  {
    Icon: Grid,
    title: "Batch, not one-by-one",
    body: "Drop fifty files and one target applies to all of them. Download them individually or in one go.",
  },
  {
    Icon: SplitView,
    title: "See the damage first",
    body: "A full-resolution split view lets you drag between original and result before you keep it.",
  },
  {
    Icon: Bolt,
    title: "Instant, even offline",
    body: "No round trip means no waiting on someone else's bandwidth. Once the page is loaded, it keeps working on a plane.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-line px-5 py-14 sm:py-24">
      <div className="mx-auto max-w-[1200px]">
        <FadeUp className="mb-8 flex max-w-[60ch] flex-col gap-3 sm:mb-12">
          <span className="eyebrow">What you get</span>
          <h2 className="text-[28px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[46px]">
            Built for one job, done properly.
          </h2>
          <p className="text-[15px] text-muted sm:text-lg">
            Most compressors give you a slider and a shrug. Picsly works
            backwards from the number you actually need.
          </p>
        </FadeUp>

        <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {FEATURES.map(({ Icon, title, body, accent, tint }, i) => (
            <FadeUp key={title} delay={(i % 3) * 0.06}>
              <div
                className="flex h-full flex-col gap-3.5 rounded-2xl border border-line p-6 transition-[border-color,transform] hover:-translate-y-[3px] hover:border-line2"
                style={{
                  background: accent
                    ? "linear-gradient(180deg,rgba(253,176,34,.06),rgba(255,255,255,.015))"
                    : "rgba(255,255,255,.015)",
                }}
              >
                <span
                  className="grid h-[42px] w-[42px] place-items-center rounded-[11px]"
                  style={
                    tint === "ok"
                      ? {
                          background: "rgba(71,205,137,.1)",
                          border: "1px solid rgba(71,205,137,.25)",
                          color: "var(--pl-ok)",
                        }
                      : accent
                        ? {
                            background: "rgba(253,176,34,.12)",
                            border: "1px solid rgba(253,176,34,.28)",
                            color: "var(--pl-acc3)",
                          }
                        : {
                            background: "rgba(255,255,255,.05)",
                            border: "1px solid var(--pl-bd2)",
                            color: "var(--pl-tx)",
                          }
                  }
                >
                  <Icon className="h-[21px] w-[21px]" />
                </span>
                <h3 className="text-lg font-semibold tracking-[-0.02em]">{title}</h3>
                <p className="text-[14.5px] leading-relaxed text-muted">{body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
