import { FadeUp } from "./FadeUp.jsx";
import { openPicker } from "./Header.jsx";

export default function CTA() {
  return (
    <section className="border-t border-line px-5 py-16 sm:py-24">
      <FadeUp className="mx-auto flex max-w-[520px] flex-col items-center gap-5 text-center">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-[32px]">
          Got a size limit to hit?
        </h2>
        <p className="text-[15px] text-muted">
          Drop a file in and pick a number. It takes a couple of seconds.
        </p>
        <button type="button" onClick={openPicker} className="btn-primary">
          Choose an image
        </button>
      </FadeUp>
    </section>
  );
}
