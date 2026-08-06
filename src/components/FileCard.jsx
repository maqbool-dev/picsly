import { Check, Download, X, Alert } from "./icons.jsx";
import { fmtBytes, EXT, outName } from "../utils/imageEngine.js";

// One image in the queue: preview, before → after sizes, progress, and the
// per-file download / compare actions once it lands.
export default function FileCard({ f, compareOn, overTarget, onRemove, onCompare }) {
  const done = f.status === "done";
  const failed = f.status === "error";
  const working = f.status === "queued" || f.status === "working";

  const saved = f.out ? Math.round((1 - f.out / f.orig) * 100) : 0;
  const grew = saved < 0;

  const savedText = f.kept
    ? "original kept"
    : grew
      ? `${Math.abs(saved)}% larger`
      : saved > 0
        ? `${saved}% smaller`
        : "same size";

  const meta = [];
  if (f.q != null) meta.push(`q${Math.round(f.q * 100)}`);
  if (f.scale && f.scale < 0.999) meta.push(`${Math.round(f.scale * 100)}%`);
  if (f.w2) meta.push(`${f.w2}×${f.h2}`);

  const kind = (EXT[f.outType] || "").toUpperCase();

  return (
    <div
      className="flex flex-col overflow-hidden rounded-[14px] bg-surface transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:shadow-lift"
      style={{
        border: `1px solid ${compareOn ? "rgba(253,176,34,.45)" : "var(--pl-bd)"}`,
      }}
    >
      {/* Preview */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16 / 10", background: "#0C0C0B" }}>
        <div
          role="img"
          aria-label={f.name}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
          style={{ backgroundImage: `url(${f.origUrl})`, opacity: done ? 1 : 0.55 }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top,rgba(0,0,0,.75),transparent 55%)" }}
        />

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${f.name}`}
          title="Remove"
          className="absolute right-2 top-2 grid h-[26px] w-[26px] place-items-center rounded-[7px] text-neutral-200 backdrop-blur transition-colors hover:!bg-err hover:text-white"
          style={{
            border: "1px solid rgba(255,255,255,.14)",
            background: "rgba(0,0,0,.55)",
          }}
        >
          <X className="h-[13px] w-[13px]" />
        </button>

        {done && (
          <div
            className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[0.03em] backdrop-blur"
            style={{
              background: "rgba(10,10,9,.72)",
              border: `1px solid ${grew ? "rgba(220,104,3,.45)" : saved > 0 ? "rgba(71,205,137,.4)" : "var(--pl-bd2)"}`,
              color: grew ? "#FDB022" : saved > 0 ? "var(--pl-ok)" : "var(--pl-t2)",
            }}
          >
            {savedText}
          </div>
        )}

        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div
              className="truncate text-[13px] font-semibold text-white"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,.8)" }}
            >
              {f.name}
            </div>
            {f.w ? (
              <div className="text-[11px] text-white/60" style={{ fontVariantNumeric: "tabular-nums" }}>
                {f.w} × {f.h} px
              </div>
            ) : null}
          </div>
          {kind && (
            <span
              className="flex-none rounded-[5px] px-1.5 py-0.5 text-[10px] font-bold tracking-[0.08em] text-amber-light"
              style={{
                background: "rgba(253,176,34,.16)",
                border: "1px solid rgba(253,176,34,.32)",
              }}
            >
              {kind}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2.5 px-3.5 py-3">
        <div className="flex items-baseline gap-2" style={{ fontVariantNumeric: "tabular-nums" }}>
          <span className={`text-[13px] text-subtle ${done ? "line-through" : ""}`}>
            {fmtBytes(f.orig)}
          </span>
          <span className="text-xs text-subtle">→</span>
          <span
            className="text-[17px] font-semibold tracking-[-0.02em]"
            style={{
              color: failed ? "var(--pl-err)" : done ? "var(--pl-acc3)" : "var(--pl-t3)",
            }}
          >
            {done ? fmtBytes(f.out) : failed ? "failed" : "working…"}
          </span>
        </div>

        <div className="h-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,.06)" }}>
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{
              width: `${Math.round((f.pct || 0) * 100)}%`,
              background: "linear-gradient(90deg,#F79009,#FEC84B)",
            }}
          />
        </div>

        <div className="flex min-h-[32px] items-center gap-2">
          {working && (
            <div className="flex items-center gap-2 text-xs text-subtle">
              <span
                className="pl-spin h-[13px] w-[13px] rounded-full"
                style={{
                  border: "2px solid rgba(253,176,34,.25)",
                  borderTopColor: "var(--pl-acc)",
                }}
              />
              {f.status === "queued" ? "Queued" : "Searching for the best fit…"}
            </div>
          )}

          {failed && (
            <div className="text-xs leading-snug text-err">{f.err}</div>
          )}

          {done && (
            <div className="flex w-full min-w-0 flex-wrap items-center gap-[7px]">
              <a
                href={f.outUrl}
                download={outName(f.name, f.outType)}
                className="inline-flex items-center gap-[7px] rounded-lg px-3 py-[7px] text-[13px] font-semibold text-amber-light transition-colors"
                style={{
                  border: "1px solid rgba(253,176,34,.45)",
                  background: "rgba(253,176,34,.1)",
                }}
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </a>
              <button
                type="button"
                onClick={onCompare}
                aria-pressed={compareOn}
                className={`chip ${compareOn ? "chip-on" : "chip-off"}`}
              >
                Compare
              </button>
              {meta.length > 0 && (
                <span
                  className="ml-auto min-w-0 flex-[0_1_auto] truncate text-[11px] text-subtle"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {meta.join(" · ")}
                </span>
              )}
            </div>
          )}
        </div>

        {f.kept && (
          <div
            className="flex gap-[7px] rounded-lg border border-line2 px-2.5 py-2 text-[11.5px] leading-snug text-muted"
            style={{ background: "rgba(255,255,255,.04)" }}
          >
            <Check className="mt-0.5 h-3.5 w-3.5 flex-none" />
            Already under your limit and can&apos;t be made smaller without losing
            quality — your original file is kept.
          </div>
        )}

        {overTarget && (
          <div
            className="flex gap-[7px] rounded-lg px-2.5 py-2 text-[11.5px] leading-snug"
            style={{
              background: "rgba(220,104,3,.1)",
              border: "1px solid rgba(220,104,3,.3)",
              color: "#FDB022",
            }}
          >
            <Alert className="mt-0.5 h-3.5 w-3.5 flex-none" />
            Smallest possible at this size — try a lower max width.
          </div>
        )}
      </div>
    </div>
  );
}
