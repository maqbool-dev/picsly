import { useCallback, useRef, useState } from "react";
import { Compare } from "./icons.jsx";
import { fmtBytes } from "../utils/imageEngine.js";

// Full-resolution split view. Drag (or arrow-key) the divider to judge the
// result against the original before keeping it.
export default function CompareView({ file }) {
  const wrapRef = useRef(null);
  const [pos, setPos] = useState(50);

  const setFromClientX = useCallback((clientX) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onPointerDown = (e) => {
    setFromClientX(e.clientX);
    const move = (ev) => setFromClientX(ev.clientX);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 3;
    let next = null;
    if (e.key === "ArrowLeft") next = Math.max(0, pos - step);
    else if (e.key === "ArrowRight") next = Math.min(100, pos + step);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;
    if (next !== null) {
      e.preventDefault();
      setPos(next);
    }
  };

  return (
    <section
      className="border-t border-line px-5 py-8 sm:py-16"
      style={{ background: "linear-gradient(180deg,#0C0C0B,var(--pl-bg))" }}
    >
      <div className="mx-auto flex max-w-[1000px] flex-col gap-[18px]">
        <div className="mb-2 flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="eyebrow">Check before you commit</span>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-[34px]">
              Drag to compare
            </h2>
          </div>
          <p className="max-w-[38ch] text-sm text-muted sm:ml-auto">
            Original on the left, Picsly&apos;s result on the right, both at full
            resolution.
          </p>
        </div>

        <div
          ref={wrapRef}
          onPointerDown={onPointerDown}
          className="relative select-none overflow-hidden rounded-[18px] border border-line shadow-panel"
          style={{
            aspectRatio: "16 / 9",
            maxHeight: 560,
            background: "#0C0C0B",
            cursor: "ew-resize",
            touchAction: "none",
          }}
        >
          <div
            role="img"
            aria-label="Original"
            className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${file.origUrl})` }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          >
            <div
              role="img"
              aria-label="Compressed by Picsly"
              className="h-full w-full bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${file.outUrl})` }}
            />
          </div>

          <div
            className="absolute bottom-0 top-0 w-0.5"
            style={{
              left: `${pos}%`,
              background:
                "linear-gradient(180deg,transparent,var(--pl-acc3) 12%,var(--pl-acc3) 88%,transparent)",
              boxShadow: "0 0 20px rgba(253,176,34,.7)",
            }}
          >
            <button
              type="button"
              role="slider"
              aria-label="Compare original and compressed"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              aria-orientation="horizontal"
              onKeyDown={onKeyDown}
              className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-amber-light backdrop-blur"
              style={{
                background: "rgba(10,10,9,.82)",
                border: "1.5px solid var(--pl-acc3)",
                cursor: "ew-resize",
              }}
            >
              <Compare className="h-5 w-5" />
            </button>
          </div>

          <div
            className="pointer-events-none absolute left-3.5 top-3 rounded-full border border-line2 px-2.5 py-1 text-xs font-semibold text-muted backdrop-blur"
            style={{ background: "rgba(10,10,9,.7)" }}
          >
            Original · {fmtBytes(file.orig)}
          </div>
          <div
            className="pointer-events-none absolute right-3.5 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-amber-light backdrop-blur"
            style={{
              background: "rgba(253,176,34,.16)",
              border: "1px solid rgba(253,176,34,.4)",
            }}
          >
            Picsly · {fmtBytes(file.out)}
          </div>
        </div>
      </div>
    </section>
  );
}
