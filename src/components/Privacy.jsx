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
      <FadeUp
        className="mx-auto grid max-w-[1000px] items-center gap-6 rounded-[22px] p-7 sm:gap-12 sm:p-12 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]"
        style={{
          border: "1px solid rgba(253,176,34,.22)",
          background:
            "radial-gradient(ellipse 80% 100% at 20% 0%,rgba(253,176,34,.1),rgba(255,255,255,.015) 60%)",
        }}
      >
        <div className="flex flex-col gap-4">
          <span
            className="grid h-[46px] w-[46px] place-items-center rounded-xl text-amber-light"
            style={{
              background: "rgba(253,176,34,.14)",
              border: "1px solid rgba(253,176,34,.32)",
            }}
          >
            <Lock className="h-[23px] w-[23px]" />
          </span>
          <h2 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.035em] sm:text-[40px]">
            Your photos never touch a server.
          </h2>
          <p className="text-[15px] leading-relaxed text-muted sm:text-[17px]">
            Picsly is a page, not a service. Every file you drop is decoded and
            re-encoded by your own browser, and the result is written to a
            temporary object in memory that disappears when you close the tab.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {CLAIMS.map((c) => (
            <div
              key={c.title}
              className="flex items-start gap-3 rounded-xl border border-line px-4 py-3.5"
              style={{ background: "rgba(10,10,9,.5)" }}
            >
              <Check className="mt-[3px] h-[17px] w-[17px] flex-none text-ok" />
              <div>
                <div className="text-[14.5px] font-semibold text-ink">{c.title}</div>
                <div className="text-[13px] leading-snug text-subtle">{c.body}</div>
              </div>
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  );
}
