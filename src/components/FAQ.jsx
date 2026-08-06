import { Chevron } from "./icons.jsx";
import { FadeUp } from "./FadeUp.jsx";

// Native <details> — keyboard-operable and open-by-default-less without JS.
// Keep these in sync with the FAQPage JSON-LD in index.html.
export const FAQS = [
  {
    q: "How can it compress without uploading anything?",
    a: "Your browser already knows how to decode and encode images — it does it every time you view a web page. Picsly draws your file onto an off-screen canvas and asks the browser to re-encode it at a chosen quality. The whole loop happens in the tab.",
  },
  {
    q: "Will it land exactly on 200 KB?",
    a: "It lands as close to your number as it can while staying under it, which is what upload forms actually check. If quality alone cannot get there, Picsly scales the image down in steps until it fits.",
  },
  {
    q: "Which output format should I choose?",
    a: "WebP is the default because it is small and supported everywhere. Choose JPEG if a form is fussy about file types, PNG when you need lossless or transparency, and AVIF when you want the smallest possible file and control where it will be viewed.",
  },
  {
    q: "Does it remove metadata?",
    a: "Yes. Because the file is re-encoded from raw pixels, EXIF data — including camera model and GPS coordinates — does not survive the trip.",
  },
  {
    q: "Is there a file size or count limit?",
    a: "There is no server limit, because there is no server. Picsly takes up to 50 images at a time and up to 50 MB per file, which keeps even a big batch comfortable in your device's memory.",
  },
  {
    q: "Is Picsly free?",
    a: "Free, with no account and no watermark. Since the work runs on your device, it costs nothing to run.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="border-t border-line px-5 py-14 sm:py-24">
      <div className="mx-auto max-w-[820px]">
        <FadeUp className="mb-6 flex flex-col gap-3 sm:mb-10">
          <span className="eyebrow">FAQ</span>
          <h2 className="text-[28px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[44px]">
            Questions people ask
          </h2>
        </FadeUp>

        <div className="flex flex-col gap-2.5">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group overflow-hidden rounded-[14px] border border-line bg-surface open:border-amber/35"
            >
              <summary className="flex w-full items-center gap-3.5 px-5 py-[18px] text-left text-base font-semibold tracking-[-0.01em] text-ink">
                <span className="flex-1">{item.q}</span>
                <span
                  data-chev
                  className="grid h-6 w-6 flex-none place-items-center rounded-[7px] text-amber transition-transform duration-200"
                  style={{ background: "rgba(255,255,255,.05)" }}
                >
                  <Chevron className="h-[15px] w-[15px]" />
                </span>
              </summary>
              <div data-faq-body>
                <p className="px-5 pb-[18px] text-[14.5px] leading-relaxed text-muted">
                  {item.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
