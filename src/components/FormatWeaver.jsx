import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { UploadCloud, Download, Lock, X, Warning, Spinner, Convert } from "./icons.jsx";
import { FadeUp } from "./FadeUp.jsx";
import FormatPill from "./FormatPill.jsx";
import { EMBER_COLORS } from "./EmberField.jsx";
import {
  detectFormat,
  convertImage,
  validateInput,
  HeicDecodeError,
  ACCEPTED_INPUT_LABEL,
  ACCEPTED_INPUT_ATTR,
} from "../utils/convert.js";
import { formatBytes } from "../utils/format.js";

// Destination formats (HEIC intentionally absent — see convert.js).
const FORMATS = [
  { id: "jpeg", label: "JPEG" },
  { id: "png", label: "PNG" },
  { id: "webp", label: "WebP" },
];
const SOURCE_LABEL = { jpeg: "JPEG", png: "PNG", webp: "WebP", heic: "HEIC" };
// Particle palette shared with EmberField (mirrors amber/ember/spark tokens).
const [AMBER, EMBER] = EMBER_COLORS;

// ── Ambient visual ─────────────────────────────────────────────────────────
// A radial amber/ember glow that pulses behind a slowly rotating starburst,
// with a few drifting ember particles. The continuous animation itself lives
// in plain CSS keyframes (index.css, gated behind prefers-reduced-motion:
// no-preference); particles aren't rendered at all when motion is reduced.
function EmberMotes({ active }) {
  const motes = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        left: Math.round(Math.random() * 100),
        delay: +(Math.random() * 6).toFixed(2),
        dur: +(5 + Math.random() * 5).toFixed(2),
        size: 2 + Math.round(Math.random() * 3),
        color: EMBER_COLORS[i % EMBER_COLORS.length],
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((m, i) => (
        <span
          key={i}
          className="weaver-ember"
          style={{
            position: "absolute",
            left: `${m.left}%`,
            bottom: "-8%",
            width: m.size,
            height: m.size,
            borderRadius: "9999px",
            background: m.color,
            boxShadow: `0 0 6px ${m.color}`,
            "--wv-dur": `${(m.dur * (active ? 0.6 : 1)).toFixed(2)}s`,
            "--wv-delay": `${m.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function WeaverBurst({ active, reduce }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Breathing glow — an inset-0 layer with a `closest-side` radial, so
          the gradient reaches full transparency before the nearest panel edge
          at ANY panel size (h-44 on mobile, taller on desktop). The card's
          overflow-hidden stays intact for its rounded corners. Pulses via
          opacity ONLY — a scale pulse would push the fade past the edge and
          bring back the hard clip this replaces. */}
      <div
        className="weaver-breathe absolute inset-0"
        style={{
          "--wv-pulse": active ? "1.5s" : "3.6s",
          background:
            "radial-gradient(circle closest-side at 50% 50%, rgba(245,165,36,0.14) 0%, rgba(242,104,44,0.07) 50%, transparent 92%)",
        }}
      />

      {!reduce && <EmberMotes active={active} />}

      {/* Starburst */}
      <svg
        viewBox="0 0 200 200"
        className="relative"
        width="60%"
        style={{ maxWidth: 200 }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="wvBurst" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.9" />
            <stop offset="55%" stopColor={EMBER} stopOpacity="0.32" />
            <stop offset="100%" stopColor={EMBER_COLORS[2]} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#wvBurst)" />
        <g
          className="weaver-spin"
          style={{ "--wv-spin": active ? "12s" : "48s", transformOrigin: "100px 100px" }}
        >
          <circle cx="100" cy="100" r="72" fill="none" stroke={AMBER} strokeOpacity="0.28" strokeWidth="1" strokeDasharray="3 7" />
          <circle cx="100" cy="100" r="54" fill="none" stroke={EMBER} strokeOpacity="0.3" strokeWidth="1" strokeDasharray="1.5 6" />
        </g>
        <path
          d="M100 54 L110 90 L146 100 L110 110 L100 146 L90 110 L54 100 L90 90 Z"
          fill={AMBER}
          opacity="0.92"
          className="weaver-pulse"
          style={{
            "--wv-pulse": active ? "1.2s" : "3.6s",
            transformOrigin: "100px 100px",
            filter: `drop-shadow(0 0 16px ${EMBER})`,
          }}
        />
      </svg>
    </div>
  );
}

// ── Format Weaver ───────────────────────────────────────────────────────────
export default function FormatWeaver() {
  const [file, setFile] = useState(null); // { file, url }
  const [sourceId, setSourceId] = useState(null);
  const [destId, setDestId] = useState("webp");
  const [status, setStatus] = useState("idle"); // idle | ready | working | done | error
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { file }
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);
  const reduce = useReducedMotion();

  // Revoke the previous source object URL whenever it changes / unmounts.
  useEffect(() => {
    return () => {
      if (file?.url) URL.revokeObjectURL(file.url);
    };
  }, [file]);

  const handleFile = useCallback((f) => {
    setError("");
    setResult(null);
    if (!f) return;
    const problem = validateInput(f);
    if (problem) {
      setError(problem);
      setStatus("error");
      setFile(null);
      setSourceId(null);
      return;
    }
    const src = detectFormat(f);
    setFile({ file: f, url: URL.createObjectURL(f) });
    setSourceId(src);
    // Default: webp, unless the source is already webp (then jpeg).
    setDestId(src === "webp" ? "jpeg" : "webp");
    setStatus("ready");
  }, []);

  async function convert() {
    if (!file) return;
    setStatus("working");
    setError("");
    try {
      const out = await convertImage(file.file, destId);
      setResult({ file: out });
      setStatus("done");
    } catch (err) {
      console.error(err);
      if (err instanceof HeicDecodeError) {
        setError(
          "We couldn't read that HEIC file. Try re-exporting it as JPEG from Photos (Share → Options → Most Compatible), then convert that."
        );
      } else {
        setError(
          "Something went wrong converting that image. Try a smaller file, or convert to JPEG first — it's the most forgiving format."
        );
      }
      setStatus("error");
    }
  }

  function download() {
    const url = URL.createObjectURL(result.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setFile(null);
    setSourceId(null);
    setDestId("webp");
    setStatus("idle");
    setError("");
    setResult(null);
  }

  const working = status === "working";
  const sourceLabel = sourceId ? SOURCE_LABEL[sourceId] : null;
  const destLabel = FORMATS.find((f) => f.id === destId)?.label;

  return (
    <section id="convert" className="relative scroll-mt-24 border-t border-line bg-paper py-16 sm:py-20">
      <div className="container-page">
        <FadeUp className="max-w-xl">
          <p className="eyebrow">New · Format conversion</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            The Format Weaver
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Turn any image into the format you actually need — JPEG, PNG, or WebP
            — right in your browser. iPhone HEIC photos welcome; they come out as
            standard, shareable files.
          </p>
        </FadeUp>

        <FadeUp delay={0.1} className="mt-8">
          <div className="grid overflow-hidden rounded-xl2 border border-line bg-surface shadow-card md:grid-cols-2">
            {/* Visual panel — first on mobile, second on desktop */}
            <div
              className="relative order-first h-44 md:order-last md:h-auto md:min-h-[22rem] md:border-l md:border-line"
              style={{
                // Faint corner wash; fades early enough that it carries no
                // visible value where it meets the card border.
                background:
                  "radial-gradient(90% 90% at 70% 25%, rgba(245,165,36,0.07), transparent 50%)",
              }}
            >
              <WeaverBurst active={working} reduce={reduce} />
            </div>

            {/* Controls panel */}
            <div className="p-6 sm:p-8">
              {!file && (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDrag(true);
                  }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDrag(false);
                    handleFile(e.dataTransfer.files?.[0]);
                  }}
                  className={`group flex w-full flex-col items-center justify-center gap-3 rounded-xl2 border-2 border-dashed px-6 py-10 text-center transition-all ${
                    drag ? "drag-active border-amber bg-amber-soft" : "border-line bg-paper/60 hover:border-ink/25 hover:bg-paper"
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                      drag ? "bg-amber text-paper" : "bg-surface text-ink shadow-sm group-hover:text-amber"
                    }`}
                  >
                    <UploadCloud className="h-6 w-6" />
                  </span>
                  <span className="space-y-1">
                    <span className="block font-medium text-ink">
                      {drag ? "Drop to convert" : "Drop an image to convert"}
                    </span>
                    <span className="block text-sm text-muted">
                      or <span className="font-medium text-amber underline-offset-2 group-hover:underline">browse your files</span>
                    </span>
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    {ACCEPTED_INPUT_LABEL} · up to 50 MB
                  </span>
                  <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED_INPUT_ATTR}
                    onChange={(e) => {
                      handleFile(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                    className="sr-only"
                    tabIndex={-1}
                  />
                </button>
              )}

              {file && (
                <div className="space-y-5">
                  {/* File chip */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {sourceId === "heic" ? (
                        <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-paper/60 font-mono text-[10px] font-semibold text-muted">
                          HEIC
                        </span>
                      ) : (
                        <img
                          src={file.url}
                          alt=""
                          className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{file.file.name}</p>
                        <p className="font-mono text-[11px] text-muted">{formatBytes(file.file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={reset}
                      aria-label="Start over"
                      className="flex flex-shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-paper hover:text-ink"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Source (display-only) */}
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted">From</span>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      <FormatPill label={sourceLabel} active />
                    </div>
                  </div>

                  {/* Divider with swap glyph */}
                  <div className="flex items-center gap-3 text-muted">
                    <div className="h-px flex-1 bg-line" />
                    <Convert className="h-4 w-4" />
                    <div className="h-px flex-1 bg-line" />
                  </div>

                  {/* Destination (single-select) */}
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted">To</span>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {FORMATS.map((f) => (
                        <FormatPill
                          key={f.id}
                          label={f.label}
                          active={destId === f.id}
                          dim={f.id === sourceId || working}
                          onClick={() => {
                            if (!working) setDestId(f.id);
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {status !== "done" && (
                    <button
                      type="button"
                      onClick={convert}
                      disabled={working}
                      className="btn-primary btn-glow w-full"
                    >
                      {working ? (
                        <>
                          <Spinner className="h-5 w-5" /> Converting…
                        </>
                      ) : (
                        <>Convert to {destLabel}</>
                      )}
                    </button>
                  )}

                  {error && (
                    <div className="flex items-start gap-2 rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember">
                      <Warning className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {status === "done" && result && (
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-line bg-paper/60 px-4 py-3">
                          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Before</p>
                          <p className="mt-0.5 font-mono text-sm font-semibold text-ink">
                            {sourceLabel} · {formatBytes(file.file.size)}
                          </p>
                        </div>
                        <div className="rounded-xl border border-amber/30 bg-amber-soft px-4 py-3">
                          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">After</p>
                          <p className="mt-0.5 font-mono text-sm font-semibold text-amber">
                            {destLabel} · {formatBytes(result.file.size)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <button type="button" onClick={download} className="btn-primary btn-glow w-full">
                          <Download className="h-5 w-5" /> Download {destLabel}
                        </button>
                        <p className="mt-2 truncate text-center font-mono text-[11px] text-muted">
                          {result.file.name} · {formatBytes(result.file.size)}
                        </p>
                      </div>
                      <button type="button" onClick={reset} className="btn-ghost w-full">
                        Convert another image
                      </button>
                    </motion.div>
                  )}

                  <p className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-muted">
                    <Lock className="h-3.5 w-3.5" /> Runs in your browser — never uploaded
                  </p>
                </div>
              )}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
