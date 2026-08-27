import { useState } from "react";
import { Chevron } from "./icons.jsx";
import { openPicker } from "./nav.js";

export const FAQS = [
  {
    q: "Does my image get uploaded anywhere?",
    a: "No. The compression runs in this browser tab using your own CPU. Turn your connection off after the page loads and it still works — that is the easiest way to prove it.",
  },
  {
    q: "How does it hit an exact size?",
    a: "It encodes the image, measures the result, and narrows in: a binary search across quality, up to nine attempts per file. If the ceiling is too tight for quality alone, it reduces the dimensions by 22% and searches again.",
  },
  {
    q: "Why is my result under the limit rather than exactly on it?",
    a: "Encoders are not perfectly predictable, so Picsly always lands just below your number rather than risking a file that is one byte over and gets rejected.",
  },
  {
    q: "What about PNG?",
    a: "PNG is lossless, so there is no quality dial to turn. Picsly can only reduce dimensions to reach a ceiling. If the size matters more than the format, switch the output to WebP or JPEG.",
  },
  {
    q: "Can I convert HEIC from my iPhone?",
    a: "Yes. Safari decodes HEIC natively, and on Chrome and Firefox Picsly loads a decoder on demand, so iPhone photos convert on every major browser.",
  },
  {
    q: "Is there a limit?",
    a: "Fifty files per batch and 50 MB per file. That cap exists to protect your tab, not to sell you an upgrade.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. There is no account, no watermark and no paid tier holding back the good settings.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState(0);

  return (
    <main className="px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto flex max-w-[760px] flex-col gap-8 sm:gap-10">
        <div className="flex flex-col gap-3">
          <span className="eyebrow">FAQ</span>
          <h1 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[42px]">
            Questions people actually ask.
          </h1>
        </div>

        <div className="flex flex-col divide-y divide-line border-y border-line">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 py-4 text-left"
                >
                  <span className="flex-1 text-[15px] font-medium text-ink">{item.q}</span>
                  <Chevron
                    className={`h-4 w-4 flex-none transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-amber" : "text-subtle"
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="pb-4 pr-8 text-sm leading-relaxed text-muted">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-5">
          <div>
            <div className="text-[15px] font-semibold text-ink">Still curious?</div>
            <div className="text-sm text-muted">
              The fastest answer is one file and four seconds.
            </div>
          </div>
          <button type="button" onClick={openPicker} className="btn-primary sm:ml-auto">
            Compress an image
          </button>
        </div>
      </div>
    </main>
  );
}
