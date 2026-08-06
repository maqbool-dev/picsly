import { ArrowRight, ArrowDown, Download, Refresh, Trash } from "./icons.jsx";
import { fmtBytes } from "../utils/imageEngine.js";

// Batch totals + bulk actions. `dispOrig`/`dispOut` are the tweened values so
// the numbers roll rather than snap (static under reduced motion).
export default function SummaryBar({
  dispOrig,
  dispOut,
  savedPct,
  doneLabel,
  dirty,
  onRequeue,
  onDownloadAll,
  onClear,
  downloadDisabled,
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-4 rounded-[14px] border border-line px-4 py-3.5"
      style={{
        background:
          "linear-gradient(100deg,rgba(253,176,34,.07),rgba(255,255,255,.02) 60%)",
      }}
    >
      <div className="flex items-baseline gap-2.5" style={{ fontVariantNumeric: "tabular-nums" }}>
        <span className="text-xl font-semibold tracking-[-0.02em] text-muted sm:text-[26px]">
          {fmtBytes(dispOrig)}
        </span>
        <ArrowRight className="h-[18px] w-[18px] text-subtle" />
        <span className="text-2xl font-semibold tracking-[-0.03em] text-amber-light sm:text-[32px]">
          {fmtBytes(dispOut)}
        </span>
      </div>

      <div
        className="inline-flex items-center gap-[7px] rounded-full px-2.5 py-1 text-[13px] font-semibold text-ok"
        style={{
          background: "rgba(71,205,137,.12)",
          border: "1px solid rgba(71,205,137,.3)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <ArrowDown className="h-3.5 w-3.5" />
        {savedPct}% smaller
      </div>

      <div className="text-[13px] text-subtle">{doneLabel}</div>

      <div className="flex flex-wrap gap-2 sm:ml-auto">
        {dirty && (
          <button type="button" onClick={onRequeue} className="btn-primary !py-2 !text-[13px]">
            <Refresh className="h-[15px] w-[15px]" />
            Re-run
          </button>
        )}
        <button
          type="button"
          onClick={onDownloadAll}
          disabled={downloadDisabled}
          className="btn-ghost !py-2 !text-[13px]"
        >
          <Download className="h-[15px] w-[15px]" />
          Download all
        </button>
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear all images"
          title="Clear all"
          className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-transparent text-subtle transition-colors hover:border-err/50 hover:text-err"
        >
          <Trash className="h-[15px] w-[15px]" />
        </button>
      </div>
    </div>
  );
}
