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
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4">
      <div className="flex items-baseline gap-2" style={{ fontVariantNumeric: "tabular-nums" }}>
        <span className="text-[15px] text-subtle">{fmtBytes(dispOrig)}</span>
        <ArrowRight className="h-3.5 w-3.5 text-subtle" />
        <span className="text-lg font-semibold tracking-[-0.02em] text-ink">
          {fmtBytes(dispOut)}
        </span>
      </div>

      <span
        className="inline-flex items-center gap-1 text-[13px] font-medium text-ok"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        <ArrowDown className="h-3 w-3" />
        {savedPct}%
      </span>

      <div className="text-[13px] text-subtle">{doneLabel}</div>

      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
        {dirty && (
          <button type="button" onClick={onRequeue} className="btn-primary !py-1.5 !text-[13px]">
            <Refresh className="h-3.5 w-3.5" />
            Re-run
          </button>
        )}
        <button
          type="button"
          onClick={onDownloadAll}
          disabled={downloadDisabled}
          className="btn-ghost !py-1.5 !text-[13px]"
        >
          <Download className="h-3.5 w-3.5" />
          Download all
        </button>
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear all images"
          title="Clear all"
          className="grid h-8 w-8 place-items-center rounded-lg border border-line text-subtle transition-colors hover:border-err/50 hover:text-err"
        >
          <Trash className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
