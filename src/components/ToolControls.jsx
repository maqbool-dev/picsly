const MODES = [
  { key: "target", label: "Target size" },
  { key: "quality", label: "Quality" },
];

const PRESETS = [
  { label: "100 KB", val: 100, unit: "KB" },
  { label: "500 KB", val: 500, unit: "KB" },
  { label: "1 MB", val: 1, unit: "MB" },
];

const FORMATS = [
  { key: "auto", label: "Auto (WebP)" },
  { key: "jpeg", label: "JPEG" },
  { key: "png", label: "PNG" },
  { key: "webp", label: "WebP" },
  { key: "avif", label: "AVIF" },
];

const MAX_DIMS = [
  { v: "0", label: "Original" },
  { v: "3840", label: "3840 px" },
  { v: "2048", label: "2048 px" },
  { v: "1600", label: "1600 px" },
  { v: "1080", label: "1080 px" },
  { v: "800", label: "800 px" },
];

const selectCls =
  "cursor-pointer rounded-lg border border-line bg-transparent px-2.5 py-1.5 text-[13px] text-muted transition-colors hover:border-line2";

// Two calm rows: what to aim for, then what to write out.
export default function ToolControls({
  mode,
  setMode,
  targetVal,
  setTargetVal,
  targetUnit,
  setTargetUnit,
  quality,
  setQuality,
  format,
  setFormat,
  maxDim,
  setMaxDim,
  avifOk,
}) {
  const isTarget = mode === "target";
  const qualityPct = Math.round(quality * 100);

  return (
    <div className="flex flex-col gap-3 border-t border-line pt-4">
      {/* Mode + the control it belongs to */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="flex gap-0.5 rounded-lg border border-line p-0.5" role="group" aria-label="Compression mode">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              aria-pressed={mode === m.key}
              className={`rounded-[6px] px-3 py-1.5 text-[13px] font-medium transition-colors ${
                mode === m.key
                  ? "bg-white/[0.06] text-ink"
                  : "text-subtle hover:text-muted"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {isTarget ? (
          <>
            <div className="flex items-center overflow-hidden rounded-lg border border-line">
              <input
                type="number"
                min="1"
                step="1"
                value={targetVal}
                onChange={(e) => setTargetVal(e.target.value)}
                aria-label="Target file size"
                className="w-[68px] border-0 bg-transparent px-2.5 py-1.5 font-mono text-sm text-ink outline-none"
                style={{ fontVariantNumeric: "tabular-nums" }}
              />
              {["KB", "MB"].map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setTargetUnit(u)}
                  aria-pressed={targetUnit === u}
                  className={`border-l border-line px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
                    targetUnit === u
                      ? "bg-white/[0.06] text-ink"
                      : "text-subtle hover:text-muted"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            {/* Presets as quiet text, not chips */}
            <div className="flex items-center gap-3">
              {PRESETS.map((p) => {
                const on =
                  String(targetVal) === String(p.val) && targetUnit === p.unit;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setTargetVal(p.val);
                      setTargetUnit(p.unit);
                    }}
                    aria-pressed={on}
                    className={`text-[13px] transition-colors ${
                      on ? "text-amber" : "text-subtle hover:text-muted"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex min-w-[200px] flex-1 items-center gap-3">
            <input
              type="range"
              min="5"
              max="98"
              step="1"
              value={qualityPct}
              onChange={(e) => setQuality(Number(e.target.value) / 100)}
              aria-label="Quality"
            />
            <span
              className="w-9 text-right font-mono text-[13px] text-muted"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {qualityPct}%
            </span>
          </div>
        )}
      </div>

      {/* Output */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <label className="flex items-center gap-2 text-[13px] text-subtle">
          Format
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className={selectCls}
          >
            {FORMATS.map((f) => (
              <option
                key={f.key}
                value={f.key}
                disabled={f.key === "avif" && !avifOk}
              >
                {f.label}
                {f.key === "avif" && !avifOk ? " — unsupported here" : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-[13px] text-subtle">
          Max width
          <select
            value={String(maxDim)}
            onChange={(e) => setMaxDim(Number(e.target.value))}
            className={selectCls}
          >
            {MAX_DIMS.map((d) => (
              <option key={d.v} value={d.v}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
