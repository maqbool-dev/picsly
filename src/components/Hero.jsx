import Studio from "./Studio.jsx";
import { Check } from "./icons.jsx";

const CLAIMS = ["No uploads", "No account", "No watermark", "Free, no catch"];

export default function Hero() {
  return (
    <section className="relative px-4 pb-9 pt-7 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
      {/* single soft bloom behind the fold */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 h-[460px] w-[min(1000px,120vw)] -translate-x-1/2"
        style={{
          top: -120,
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(253,176,34,0.10), transparent 72%)",
        }}
      />

      <div className="relative mx-auto grid max-w-page items-start gap-8 sm:gap-13 lg:grid-cols-2 lg:gap-[52px]">
        {/* Left: the pitch */}
        <div className="flex flex-col gap-[22px] lg:pt-5">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-line2 bg-surface2 py-[5px] pl-2 pr-[11px] text-xs font-medium leading-[18px] text-amber-light">
            <span className="pl-breathe h-1.5 w-1.5 rounded-full bg-amber" />
            Nothing is uploaded. Ever.
          </span>

          <h1 className="m-0 text-[36px] font-semibold leading-[1.04] tracking-[-0.032em] text-ink sm:text-5xl lg:text-[58px]">
            Name your file size.
            <br />
            <span className="text-amber">Picsly hits it.</span>
          </h1>

          <p className="m-0 max-w-[46ch] text-base leading-[1.62] text-muted sm:text-[17px] lg:text-lg">
            Every other compressor gives you a quality slider and wishes you luck.
            Picsly works the other way round: type the ceiling the form demands,
            and it searches for the best-looking image that fits underneath.
          </p>

          <div className="grid max-w-[400px] gap-x-[18px] gap-y-2.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,148px),1fr))]">
            {CLAIMS.map((c) => (
              <span key={c} className="flex items-center gap-2 text-sm text-ink2">
                <Check className="h-[15px] w-[15px] flex-none text-ok" />
                {c}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[13px] text-subtle">
            <span className="font-mono text-xs text-muted">
              JPEG · PNG · WebP · AVIF · HEIC
            </span>
            <span className="h-[13px] w-px bg-line2" />
            <span>50 files at a time</span>
          </div>
        </div>

        {/* Right: the tool */}
        <div className="relative">
          <Studio />
        </div>
      </div>
    </section>
  );
}
