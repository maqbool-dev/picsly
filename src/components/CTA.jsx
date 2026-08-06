import logo from "../assets/logo.png";
import { FadeUp } from "./FadeUp.jsx";
import { openPicker } from "./Header.jsx";
import { ArrowRight } from "./icons.jsx";

export default function CTA() {
  return (
    <section
      className="border-t border-line px-5 py-12 sm:py-20"
      style={{
        background:
          "radial-gradient(ellipse 70% 100% at 50% 100%,rgba(253,176,34,.12),transparent 70%)",
      }}
    >
      <FadeUp className="mx-auto flex max-w-[640px] flex-col items-center gap-5 text-center">
        <img
          src={logo}
          alt=""
          className="h-14 w-14"
          style={{ filter: "drop-shadow(0 6px 24px rgba(253,176,34,.45))" }}
        />
        <h2 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.035em] sm:text-[42px]">
          Got an upload limit to beat?
        </h2>
        <p className="text-[15px] text-muted sm:text-lg">
          Drop the file in and pick a number. It takes a couple of seconds.
        </p>
        <button
          type="button"
          onClick={openPicker}
          className="btn-primary !px-5 !py-3 !text-[15px]"
          style={{
            boxShadow:
              "0 8px 24px -10px rgba(253,176,34,.7),inset 0 0 0 1px rgba(255,255,255,.2)",
          }}
        >
          Choose an image
          <ArrowRight className="h-[17px] w-[17px]" />
        </button>
      </FadeUp>
    </section>
  );
}
