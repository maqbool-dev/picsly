const MODES = [
  { key: "target", label: "Target file size" },
  { key: "quality", label: "Manual quality" },
];

const UNITS = ["KB", "MB"];

const PRESETS = [
  { label: "100 KB", val: 100, unit: "KB" },
  { label: "200 KB", val: 200, unit: "KB" },
  { label: "500 KB", val: 500, unit: "KB" },
  { label: "1 MB", val: 1, unit: "MB" },
  { label: "2 MB", val: 2, unit: "MB" },
];

const FORMATS = [
  { key: "auto", label: "Auto · WebP", title: "Smallest safe default" },
  { key: "jpeg", label: "JPEG", title: "Most compatible" },
  { key: "png", label: "PNG", title: "Lossless, keeps transparency" },
  { key: "webp", label: "WebP", title: "Small, widely supported" },
  { key: "avif", label: "AVIF", title: "Smallest files" },
];

const MAX_DIMS = [
  { v: "0", label: "Original" },
  { v: "3840", label: "3840 px" },
  { v: "2048", label: "2048 px" },
  { v: "1600", label: "1600 px" },
  { v: "1080", label: "1080 px" },
  { v: "800", label: "800 px" },
];

// The settings panel: what size to aim for, and what to write out.
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
    <div className="flex flex-col gap-3 rounded-[14px] border border-line p-3.5" style={{ background: "rgba(255,255,255,.018)" }}>
      {/* Mode */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex gap-[3px] rounded-[10px] border border-line bg-surface p-[3px]" role="group" aria-label="Compression mode">
          {MODES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              aria-pressed={mode === m.key}
              className={`rounded-lg px-3.5 py-[7px] text-[13px] font-semibold transition-colors ${
                mode === m.key ? "text-amber-light" : "text-muted hover:text-ink"
              }`}
              style={mode === m.key ? { background: "rgba(253,176,34,.14)" } : undefined}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="min-w-[180px] flex-1 text-[13px] text-subtle">
          {isTarget
            ? "Picsly re-encodes until the file fits under your limit."
            : "Set the quality yourself and take whatever size comes out."}
        </div>
      </div>

      {/* Target size */}
      {isTarget && (
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center overflow-hidden rounded-[10px] border border-line2 bg-surface shadow-card">
            <input
              type="number"
              min="1"
              step="1"
              value={targetVal}
              onChange={(e) => setTargetVal(e.target.value)}
              aria-label="Target file size"
              className="w-[92px] border-0 bg-transparent px-3 py-2.5 font-mono text-base font-semibold text-ink outline-none"
              style={{ fontVariantNumeric: "tabular-nums" }}
            />
            {UNITS.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setTargetUnit(u)}
                aria-pressed={targetUnit === u}
                className={`border-0 border-l border-line px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                  targetUnit === u ? "text-amber-light" : "text-muted hover:text-ink"
                }`}
                style={targetUnit === u ? { background: "rgba(253,176,34,.14)" } : undefined}
              >
                {u}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => {
              const on = String(targetVal) === String(p.val) && targetUnit === p.unit;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setTargetVal(p.val);
                    setTargetUnit(p.unit);
                  }}
                  aria-pressed={on}
                  className={`chip rounded-full ${on ? "chip-on" : "chip-off"}`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual quality */}
      {!isTarget && (
        <div className="flex min-w-[220px] flex-col gap-2">
          <div className="flex justify-between text-[13px] font-medium text-muted">
            <span>Quality</span>
            <span className="font-semibold text-amber-light" style={{ fontVariantNumeric: "tabular-nums" }}>
              {qualityPct}%
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="98"
            step="1"
            value={qualityPct}
            onChange={(e) => setQuality(Number(e.target.value) / 100)}
            aria-label="Quality"
          />
        </div>
      )}

      <div className="h-px bg-line" />

      {/* Output format + max width */}
      <div className="flex flex-wrap items-center gap-3.5">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-subtle">Output</span>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Output format">
          {FORMATS.map((f) => {
            const disabled = f.key === "avif" && !avifOk;
            const on = format === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => !disabled && setFormat(f.key)}
                disabled={disabled}
                aria-pressed={on}
                title={disabled ? "Your browser cannot encode AVIF" : f.title}
                className={`chip ${on ? "chip-on" : "chip-off"} ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <label
            htmlFor="pl-maxdim"
            className="text-xs font-semibold uppercase tracking-[0.08em] text-subtle"
          >
            Max width
          </label>
          <select
            id="pl-maxdim"
            value={String(maxDim)}
            onChange={(e) => setMaxDim(Number(e.target.value))}
            className="cursor-pointer rounded-lg border border-line2 bg-surface px-2.5 py-2 text-[13px] font-medium text-muted"
          >
            {MAX_DIMS.map((d) => (
              <option key={d.v} value={d.v}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
