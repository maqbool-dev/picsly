import { openPicker } from "./nav.js";

const FORMATS = [
  {
    name: "WebP",
    tag: "DEFAULT",
    body: "Smaller than JPEG at the same quality, keeps transparency, works everywhere that matters. Use it unless something forbids it.",
  },
  {
    name: "JPEG",
    body: "The format every upload form on earth accepts. No transparency — Picsly mattes it white rather than black.",
  },
  {
    name: "AVIF",
    body: "The smallest files here, by a wide margin. Slower to encode, and Safari can't write it — Picsly checks before offering it.",
  },
  {
    name: "PNG",
    body: "Lossless, so quality is not a dial you can turn. To hit a ceiling, Picsly can only reduce dimensions.",
  },
  {
    name: "HEIC",
    tag: "IN ONLY",
    body: "What your iPhone actually shoots. Drop it in and get something the web can read back out.",
  },
];

export default function Formats() {
  return (
    <section id="formats" className="border-t border-line bg-paper2 px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto flex max-w-page flex-col gap-7 sm:gap-12">
        <div data-reveal className="flex max-w-[620px] flex-col gap-3.5">
          <span className="eyebrow">Formats</span>
          <h2 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[38px]">
            Pick the right one, or let Picsly.
          </h2>
        </div>

        <div
          data-reveal
          className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))]"
        >
          {FORMATS.map((f) => (
            <div
              key={f.name}
              className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-ink">{f.name}</span>
                {f.tag && (
                  <span className="rounded-full border border-line2 px-2 py-px text-[10px] font-semibold tracking-[0.06em] text-subtle">
                    {f.tag}
                  </span>
                )}
              </div>
              <p className="text-[13px] leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}

          <div className="flex items-center justify-center rounded-xl border border-dashed border-line2 p-4">
            <button type="button" onClick={openPicker} className="btn-primary">
              Try it with one file
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
