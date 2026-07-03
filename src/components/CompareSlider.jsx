import { useRef, useState, useCallback, useEffect } from "react";
import { animate, useReducedMotion } from "motion/react";

// Draggable "before / after" comparison. The compressed image sits on top,
// clipped to the slider position; dragging reveals more or less of it so you
// can judge quality loss against the original underneath.
export default function CompareSlider({ originalUrl, compressedUrl, dimensions }) {
  const wrapRef = useRef(null);
  const [pos, setPos] = useState(55); // percent revealed of the compressed side
  const [active, setActive] = useState(false);
  const reduce = useReducedMotion();
  const hintRef = useRef(null); // running hint animation, cancelled on interaction

  const move = useCallback((clientX) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, x)));
  }, []);

  // One-shot discovery hint: shortly after the result appears, the handle
  // nudges left and settles back so users notice it can be dragged. Skipped
  // under reduced motion; cancelled immediately if the user grabs the handle.
  useEffect(() => {
    if (reduce) return;
    const timer = setTimeout(() => {
      hintRef.current = animate(55, 46, {
        duration: 0.45,
        ease: "easeInOut",
        onUpdate: setPos,
        onComplete: () => {
          hintRef.current = animate(46, 55, {
            duration: 0.5,
            ease: "easeInOut",
            onUpdate: setPos,
          });
        },
      });
    }, 700);
    return () => {
      clearTimeout(timer);
      hintRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const grab = () => {
    hintRef.current?.stop();
    setActive(true);
  };

  // Keyboard operation: arrows move the divider, Shift for bigger steps.
  const onKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 3;
    let next = null;
    if (e.key === "ArrowLeft") next = Math.max(0, pos - step);
    else if (e.key === "ArrowRight") next = Math.min(100, pos + step);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;
    if (next !== null) {
      e.preventDefault();
      hintRef.current?.stop();
      setPos(next);
    }
  };

  useEffect(() => {
    if (!active) return;
    const onMove = (e) => move(e.touches ? e.touches[0].clientX : e.clientX);
    const stop = () => setActive(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchend", stop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchend", stop);
    };
  }, [active, move]);

  return (
    <div className="space-y-2">
      <div
        ref={wrapRef}
        className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-xl bg-ink/5"
      >
        {/* Original (underneath) */}
        <img
          src={originalUrl}
          alt="Original image, before compression"
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />
        {/* Compressed (on top, clipped to slider position) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <img
            src={compressedUrl}
            alt="Compressed image, after compression"
            className="absolute inset-0 h-full w-full object-contain"
            draggable={false}
          />
        </div>

        {/* Labels */}
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
          Original
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-amber px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-paper">
          Compressed
        </span>

        {/* Handle */}
        <div
          className="absolute inset-y-0 z-10 flex w-0.5 items-center justify-center bg-white shadow-[0_0_0_1px_rgba(21,22,15,0.15)]"
          style={{ left: `${pos}%` }}
        >
          <button
            type="button"
            role="slider"
            aria-label="Compare original and compressed image"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            aria-orientation="horizontal"
            onMouseDown={grab}
            onTouchStart={grab}
            onKeyDown={onKeyDown}
            className="grid h-11 w-11 -translate-x-1/2 cursor-ew-resize place-items-center rounded-full border border-line bg-surface text-ink shadow-lift"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 7-4 5 4 5M15 7l4 5-4 5" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-center font-mono text-[11px] text-muted">
        Drag the handle to compare · {dimensions}
      </p>
    </div>
  );
}
