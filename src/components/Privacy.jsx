import { FadeUp } from "./FadeUp.jsx";
import { Check, Lock } from "./icons.jsx";

const CLAIMS = [
  {
    title: "No upload request is made",
    body: "Open your network tab and watch. Nothing goes out.",
  },
  {
    title: "EXIF and GPS are dropped",
    body: "Re-encoding strips camera and location metadata by default.",
  },
  {
    title: "Nothing is stored",
    body: "Close the tab and every trace of the file is gone.",
  },
];

export default function Privacy() {
  return (
    <section id="privacy" className="border-t border-line px-5 py-14 sm:py-24">
      <FadeUp className="mx-auto grid max-w-[900px] items-start gap-8 sm:gap-14 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
        <div className="flex flex-col gap-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-line text-amber">
            <Lock className="h-5 w-5" />
          </span>
          <h2 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[34px]">
            Your photos never touch a server.
          </h2>
          <p className="text-[15px] leading-relaxed text-muted">
            Picsly is a page, not a service. Every file you drop is decoded and
            re-encoded by your own browser, then held in memory until you close
            the tab.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {CLAIMS.map((c) => (
            <div key={c.title} className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 flex-none text-ok" />
              <div>
                <div className="text-sm font-medium text-ink">{c.title}</div>
                <div className="text-[13px] leading-snug text-subtle">{c.body}</div>
              </div>
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  );
}
