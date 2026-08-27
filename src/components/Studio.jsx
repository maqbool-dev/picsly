import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Refresh, UploadTray, X } from "./icons.jsx";
import {
  ACCEPT_ATTR,
  MAX_FILES,
  MAX_INPUT_BYTES,
  MIME,
  decodeImage,
  detectAvifSupport,
  fmtBytes,
  isAcceptedFile,
  outName,
  searchTarget,
} from "../utils/imageEngine.js";

const PRESETS = [
  { label: "200 KB", v: 200, u: "KB" },
  { label: "1 MB", v: 1, u: "MB" },
  { label: "X · 5 MB", v: 5, u: "MB" },
  { label: "Instagram · 8 MB", v: 8, u: "MB" },
  { label: "LinkedIn · 5 MB", v: 5, u: "MB" },
];

const MAX_DIMS = [
  ["0", "Original width"],
  ["3840", "Max 3840 px"],
  ["2048", "Max 2048 px"],
  ["1600", "Max 1600 px"],
  ["1080", "Max 1080 px"],
  ["800", "Max 800 px"],
];

const RING = 100.5;
let seq = 0;

// The compressor card: drop target, size ceiling, batch queue and results.
// All work is local — see utils/imageEngine.js.
export default function Studio() {
  const [files, setFiles] = useState([]);
  const [targetVal, setTargetVal] = useState(200);
  const [targetUnit, setTargetUnit] = useState("KB");
  const [format, setFormat] = useState("auto");
  const [maxDim, setMaxDim] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [running, setRunning] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [compareId, setCompareId] = useState(null);
  const [slider, setSlider] = useState(50);
  const [disp, setDisp] = useState({ orig: 0, out: 0 });
  const [avifOk, setAvifOk] = useState(false);

  const inputRef = useRef(null);
  // Refs mirror state synchronously so the async queue never reads a stale
  // render closure.
  const filesRef = useRef(files);
  const cfgRef = useRef({ targetVal, targetUnit, format, maxDim });
  const busyRef = useRef(false);
  const tweenRaf = useRef(0);
  const reduced = useRef(false);

  useEffect(() => {
    cfgRef.current = { targetVal, targetUnit, format, maxDim };
  }, [targetVal, targetUnit, format, maxDim]);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    detectAvifSupport().then(setAvifOk);
  }, []);

  const commit = useCallback((next) => {
    filesRef.current = next;
    setFiles(next);
  }, []);

  const patch = useCallback(
    (id, upd) => commit(filesRef.current.map((f) => (f.id === id ? { ...f, ...upd } : f))),
    [commit]
  );

  const targetBytes = useCallback(() => {
    const { targetVal: v, targetUnit: u } = cfgRef.current;
    return Math.round(Math.max(1, Number(v) || 1) * (u === "MB" ? 1048576 : 1024));
  }, []);

  const tween = useCallback(() => {
    const done = filesRef.current.filter((f) => f.status === "done");
    const to = {
      orig: done.reduce((a, f) => a + f.orig, 0),
      out: done.reduce((a, f) => a + (f.out || 0), 0),
    };
    cancelAnimationFrame(tweenRaf.current);
    if (reduced.current) return setDisp(to);
    setDisp((from) => {
      const t0 = performance.now();
      const go = () => {
        const k = Math.min(1, (performance.now() - t0) / 650);
        const e = 1 - Math.pow(1 - k, 3);
        setDisp({
          orig: from.orig + (to.orig - from.orig) * e,
          out: from.out + (to.out - from.out) * e,
        });
        if (k < 1) tweenRaf.current = requestAnimationFrame(go);
      };
      tweenRaf.current = requestAnimationFrame(go);
      return from;
    });
  }, []);

  const processOne = useCallback(
    async (id) => {
      const item = filesRef.current.find((f) => f.id === id);
      if (!item) return;
      patch(id, { status: "working", pct: 0.05 });
      try {
        const cfg = cfgRef.current;
        const src = await decodeImage(item.file);
        const iw = src.naturalWidth || src.width;
        const ih = src.naturalHeight || src.height;
        const mime = cfg.format === "auto" ? "image/webp" : MIME[cfg.format];

        let base = 1;
        const cap = Number(cfg.maxDim) || 0;
        if (cap && Math.max(iw, ih) > cap) base = cap / Math.max(iw, ih);

        const res = await searchTarget(src, mime, targetBytes(), base, (p) =>
          patch(id, { pct: p })
        );
        src.close?.();
        if (!res?.blob) throw new Error("Could not encode this image.");

        // Never hand back something larger than what came in.
        let blob = res.blob;
        let q = res.q;
        const scale = res.scale;
        let kept = false;
        const sameType = cfg.format === "auto" || item.file.type === mime;
        if (blob.size >= item.orig && sameType && item.orig <= targetBytes() && scale >= 0.999) {
          blob = item.file;
          q = null;
          kept = true;
        }

        const prev = filesRef.current.find((f) => f.id === id);
        if (prev?.outUrl) URL.revokeObjectURL(prev.outUrl);

        patch(id, {
          status: "done",
          pct: 1,
          out: blob.size,
          outUrl: URL.createObjectURL(blob),
          outType: blob.type || item.file.type,
          q,
          scale,
          kept,
          w: iw,
          h: ih,
          w2: Math.max(1, Math.round(iw * scale)),
          h2: Math.max(1, Math.round(ih * scale)),
        });
        tween();
        setCompareId((c) => c ?? id);
      } catch (err) {
        patch(id, {
          status: "error",
          pct: 0,
          err: err?.message || "Something went wrong with this file.",
        });
        tween();
      }
    },
    [patch, targetBytes, tween]
  );

  const runQueue = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setRunning(true);
    for (;;) {
      const next = filesRef.current.find((f) => f.status === "queued");
      if (!next) break;
      await processOne(next.id);
      await new Promise((r) => setTimeout(r, 16));
    }
    busyRef.current = false;
    setRunning(false);
    tween();
  }, [processOne, tween]);

  const addFiles = useCallback(
    (list) => {
      const room = MAX_FILES - filesRef.current.length;
      if (room <= 0) return;
      const accepted = Array.from(list).filter(isAcceptedFile).slice(0, room);
      if (!accepted.length) return;

      const items = accepted.map((file) => {
        const tooBig = file.size > MAX_INPUT_BYTES;
        return {
          id: `f${++seq}`,
          file,
          name: file.name,
          orig: file.size,
          origUrl: URL.createObjectURL(file),
          w: 0,
          h: 0,
          w2: 0,
          h2: 0,
          status: tooBig ? "error" : "queued",
          err: tooBig
            ? `That file is ${fmtBytes(file.size)} — over the 50 MB limit.`
            : null,
          pct: 0,
          out: null,
          outUrl: null,
          outType: null,
          q: null,
          scale: 1,
          kept: false,
        };
      });

      commit(filesRef.current.concat(items));
      items.forEach((it) => {
        if (it.status === "error") return;
        const img = new Image();
        img.onload = () => patch(it.id, { w: img.naturalWidth, h: img.naturalHeight });
        img.src = it.origUrl;
      });
      runQueue();
    },
    [commit, patch, runQueue]
  );

  const pickFiles = useCallback(() => inputRef.current?.click(), []);

  useEffect(() => {
    const onPaste = (e) => {
      const fs = e.clipboardData?.files;
      if (fs?.length) {
        e.preventDefault();
        addFiles(fs);
      }
    };
    const swallow = (e) => e.preventDefault();
    window.addEventListener("paste", onPaste);
    window.addEventListener("dragover", swallow);
    window.addEventListener("drop", swallow);
    window.addEventListener("picsly:browse", pickFiles);
    return () => {
      window.removeEventListener("paste", onPaste);
      window.removeEventListener("dragover", swallow);
      window.removeEventListener("drop", swallow);
      window.removeEventListener("picsly:browse", pickFiles);
    };
  }, [addFiles, pickFiles]);

  useEffect(
    () => () => {
      cancelAnimationFrame(tweenRaf.current);
      filesRef.current.forEach((f) => {
        if (f.origUrl) URL.revokeObjectURL(f.origUrl);
        if (f.outUrl) URL.revokeObjectURL(f.outUrl);
      });
    },
    []
  );

  const mark = (fn) => {
    fn();
    if (filesRef.current.length) setDirty(true);
  };

  const removeFile = (id) => {
    const it = filesRef.current.find((f) => f.id === id);
    if (it) {
      if (it.origUrl) URL.revokeObjectURL(it.origUrl);
      if (it.outUrl) URL.revokeObjectURL(it.outUrl);
    }
    commit(filesRef.current.filter((f) => f.id !== id));
    setCompareId((c) => (c === id ? null : c));
    tween();
  };

  const clearAll = () => {
    filesRef.current.forEach((f) => {
      if (f.origUrl) URL.revokeObjectURL(f.origUrl);
      if (f.outUrl) URL.revokeObjectURL(f.outUrl);
    });
    commit([]);
    setCompareId(null);
    setDirty(false);
    setDisp({ orig: 0, out: 0 });
  };

  const requeue = () => {
    setDirty(false);
    commit(
      filesRef.current.map((f) =>
        f.orig > MAX_INPUT_BYTES ? f : { ...f, status: "queued", pct: 0, err: null }
      )
    );
    runQueue();
  };

  const downloadAll = () => {
    filesRef.current
      .filter((f) => f.status === "done")
      .forEach((f, i) =>
        setTimeout(() => {
          const a = document.createElement("a");
          a.href = f.outUrl;
          a.download = outName(f.name, f.outType);
          document.body.appendChild(a);
          a.click();
          a.remove();
        }, i * 280)
      );
  };

  const dragProps = {
    onDragEnter: (e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); },
    onDragOver: (e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); },
    onDragLeave: (e) => { e.preventDefault(); e.stopPropagation(); setDragging(false); },
    onDrop: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
    },
  };

  const done = files.filter((f) => f.status === "done");
  const savedPct = disp.orig ? Math.max(0, Math.round((1 - disp.out / disp.orig) * 100)) : 0;
  const cmp = files.find((f) => f.id === compareId && f.status === "done");
  const tBytes = Math.round(
    Math.max(1, Number(targetVal) || 1) * (targetUnit === "MB" ? 1048576 : 1024)
  );

  return (
    <div className="overflow-hidden rounded-[18px] border border-line bg-surface shadow-card">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT_ATTR}
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
        className="sr-only"
        tabIndex={-1}
      />

      {/* Card header */}
      <div className="flex items-center gap-2.5 border-b border-line bg-surface2 px-4 py-3">
        <span className="text-[13px] font-semibold text-ink">Compressor</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-subtle">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#47cd89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Runs on your device
        </span>
      </div>

      <div className="flex flex-col gap-3.5 p-4">
        {/* Drop target */}
        <button
          type="button"
          onClick={pickFiles}
          {...dragProps}
          className={`w-full rounded-[14px] border-[1.5px] border-dashed px-4 text-center transition-colors ${
            files.length ? "py-5" : "py-6 sm:py-8"
          } ${dragging ? "border-amber bg-[#16140f]" : "border-line2 bg-inset hover:border-amber hover:bg-[#16140f]"}`}
        >
          <span className="mb-2.5 inline-grid h-[42px] w-[42px] place-items-center rounded-[11px] border border-line bg-surface2 text-amber">
            <UploadTray className="h-[19px] w-[19px]" />
          </span>
          <span className="block text-[15px] font-semibold text-ink">
            {dragging ? "Let go" : files.length ? "Add more images" : "Drop your images here"}
          </span>
          <span className="mt-1 block text-[13px] text-subtle">
            click to browse, or paste from your clipboard
          </span>
        </button>

        {/* Size ceiling */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.04em] text-subtle">
              Size ceiling
            </span>
            <span className="text-xs text-subtle">
              highest quality that fits under {fmtBytes(tBytes)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const on = Number(targetVal) === p.v && targetUnit === p.u;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => mark(() => { setTargetVal(p.v); setTargetUnit(p.u); })}
                  aria-pressed={on}
                  className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    on
                      ? "border-amber bg-amber/[0.14] text-amber-light"
                      : "border-line2 bg-inset text-muted hover:border-line3 hover:text-ink"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-[1_1_160px] items-center overflow-hidden rounded-[9px] border border-line2 bg-inset">
              <input
                type="number"
                min="1"
                value={targetVal}
                onChange={(e) => mark(() => setTargetVal(e.target.value))}
                aria-label="Target file size"
                className="min-w-0 flex-1 border-0 bg-transparent px-[11px] py-[9px] font-mono text-[15px] font-semibold text-ink outline-none"
              />
              <div className="flex gap-0.5 border-l border-line p-[3px]">
                {["KB", "MB"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => mark(() => setTargetUnit(u))}
                    aria-pressed={targetUnit === u}
                    className={`rounded-md px-2.5 py-[5px] text-xs font-semibold transition-colors ${
                      targetUnit === u ? "bg-amber text-amber-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex flex-[1_1_132px]">
              <select
                value={format}
                aria-label="Output format"
                onChange={(e) => mark(() => setFormat(e.target.value))}
                className="field-select"
              >
                <option value="auto">Auto (WebP)</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
                <option value="avif" disabled={!avifOk}>
                  {avifOk ? "AVIF" : "AVIF — not supported here"}
                </option>
              </select>
              <Caret />
            </div>

            <div className="relative flex flex-[1_1_132px]">
              <select
                value={String(maxDim)}
                aria-label="Max width"
                onChange={(e) => mark(() => setMaxDim(Number(e.target.value)))}
                className="field-select"
              >
                {MAX_DIMS.map(([v, label]) => (
                  <option key={v} value={v}>{label}</option>
                ))}
              </select>
              <Caret />
            </div>
          </div>
        </div>

        {/* Results */}
        {files.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-line pt-3.5">
            <div className="flex flex-wrap items-center gap-3.5 rounded-xl border border-line bg-surface2 px-3.5 py-3">
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-sm text-subtle line-through">{fmtBytes(disp.orig)}</span>
                <ArrowRight className="h-3.5 w-3.5 self-center text-subtle" />
                <span className="text-[19px] font-bold tracking-[-0.02em] text-ink">
                  {fmtBytes(disp.out)}
                </span>
              </div>
              <span className="inline-flex items-center rounded-full border border-ok/30 bg-ok/[0.12] px-2.5 py-[3px] text-xs font-semibold text-ok">
                {savedPct > 0 ? `${savedPct}% smaller` : "—"}
              </span>
              <span className="mr-auto text-[13px] text-subtle">
                {running ? "Working…" : done.length === 1 ? "1 image ready" : `${done.length} images ready`}
              </span>
              <div className="flex flex-wrap gap-[7px]">
                {dirty && (
                  <button
                    type="button"
                    onClick={requeue}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber px-[11px] py-[7px] text-[13px] font-semibold text-amber transition-colors hover:bg-amber/10"
                  >
                    <Refresh className="h-[13px] w-[13px]" />
                    Re-run
                  </button>
                )}
                <button
                  type="button"
                  onClick={downloadAll}
                  disabled={!done.length}
                  className="btn-primary !px-3 !py-[7px] !text-[13px]"
                >
                  Download all
                </button>
                <button type="button" onClick={clearAll} className="btn-outline">
                  Clear
                </button>
              </div>
            </div>

            {cmp && (
              <CompareStrip file={cmp} slider={slider} onSlider={setSlider} />
            )}

            <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr))]">
              {files.map((f) => (
                <FileRow
                  key={f.id}
                  f={f}
                  overTarget={f.status === "done" && f.out > tBytes}
                  active={compareId === f.id}
                  onCompare={() => { setCompareId(f.id); setSlider(50); }}
                  onRemove={() => removeFile(f.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Caret = () => (
  <svg
    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#737373"
    strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"
    className="pointer-events-none absolute right-[11px] top-1/2 -mt-1.5"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// Before/after wipe. The left pane is clipped to `slider`%, and the image
// inside is widened inversely so it stays aligned with the right pane.
function CompareStrip({ file, slider, onSlider }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-inset">
      <div className="relative overflow-hidden bg-paper" style={{ aspectRatio: "16 / 10" }}>
        <img src={file.outUrl} alt="Compressed result" className="absolute inset-0 h-full w-full object-contain" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${slider}%` }}>
          <img
            src={file.origUrl}
            alt="Original"
            className="absolute left-0 top-0 h-full max-w-none object-contain"
            style={{ width: `${10000 / Math.max(1, slider)}%` }}
          />
        </div>
        <div
          className="pointer-events-none absolute bottom-0 top-0 w-0.5 bg-amber"
          style={{ left: `${slider}%`, boxShadow: "0 0 12px rgba(253,176,34,0.6)" }}
        />
        <span className="absolute left-2.5 top-2.5 rounded-md bg-paper/80 px-2 py-[3px] text-[11px] font-semibold tracking-[0.04em] text-muted">
          BEFORE
        </span>
        <span className="absolute right-2.5 top-2.5 rounded-md bg-paper/80 px-2 py-[3px] text-[11px] font-semibold tracking-[0.04em] text-amber">
          AFTER
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={slider}
          onChange={(e) => onSlider(Number(e.target.value))}
          aria-label="Compare before and after"
          className="absolute bottom-2.5 left-3 right-3 !w-auto"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2.5 border-t border-line px-3 py-2.5 text-xs text-subtle">
        <span className="font-medium text-ink2">{file.name}</span>
        <span className="font-mono">
          {fmtBytes(file.orig)} → {fmtBytes(file.out)}
          {file.w2 ? `  ·  ${file.w2}×${file.h2}` : ""}
        </span>
      </div>
    </div>
  );
}

function FileRow({ f, overTarget, active, onCompare, onRemove }) {
  const isDone = f.status === "done";
  const isErr = f.status === "error";
  const pct = f.out ? Math.max(0, Math.round((1 - f.out / f.orig) * 100)) : 0;

  let badge = "Queued";
  let badgeCls = "bg-surface3 text-muted";
  if (f.status === "working") {
    badge = `${Math.round((f.pct || 0) * 100)}%`;
    badgeCls = "bg-amber/[0.14] text-amber";
  } else if (isErr) {
    badge = "Failed";
    badgeCls = "bg-err/[0.14] text-err";
  } else if (isDone) {
    badge = f.kept ? "Original kept" : `−${pct}%`;
    badgeCls = overTarget ? "bg-amber/[0.14] text-amber" : "bg-ok/[0.12] text-ok";
  }

  const meta = isDone
    ? `${fmtBytes(f.orig)} → ${fmtBytes(f.out)}${f.w2 ? `  ·  ${f.w2}×${f.h2}` : ""}`
    : `${fmtBytes(f.orig)}${f.w ? `  ·  ${f.w}×${f.h}` : ""}`;

  return (
    <div
      className={`relative flex gap-[11px] rounded-xl border bg-warm p-[11px] transition-colors ${
        active ? "border-amber/50" : "border-line"
      }`}
    >
      <div className="relative h-[54px] w-[54px] flex-none overflow-hidden rounded-lg border border-line bg-paper">
        <img src={f.origUrl} alt="" className="h-full w-full object-cover" />
        {(f.status === "working" || f.status === "queued") && (
          <span className="absolute inset-0 grid place-items-center bg-paper/70">
            <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
              <circle cx="20" cy="20" r="16" fill="none" stroke="#37342b" strokeWidth="3" />
              <circle
                cx="20" cy="20" r="16" fill="none" stroke="#fdb022" strokeWidth="3"
                strokeLinecap="round" strokeDasharray={RING}
                strokeDashoffset={RING * (1 - (f.pct || 0))}
                transform="rotate(-90 20 20)"
                style={{ transition: "stroke-dashoffset 200ms linear" }}
              />
            </svg>
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <div className="truncate text-[13px] font-semibold text-ink">{f.name}</div>
        <div className="font-mono text-xs text-subtle">{meta}</div>
        <div className="mt-[3px] flex flex-wrap items-center gap-[7px]">
          <span className={`rounded-full px-[7px] py-0.5 text-[11px] font-semibold ${badgeCls}`}>
            {badge}
          </span>
          {isDone && (
            <>
              <button
                type="button"
                onClick={onCompare}
                className="text-xs font-medium text-muted underline underline-offset-2 transition-colors hover:text-amber"
              >
                Compare
              </button>
              <a
                href={f.outUrl}
                download={outName(f.name, f.outType)}
                className="text-xs font-semibold text-amber"
              >
                Download
              </a>
            </>
          )}
        </div>
        {isErr && <div className="mt-0.5 text-xs leading-snug text-err">{f.err}</div>}
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${f.name}`}
        className="grid h-6 w-6 flex-none place-items-center self-start rounded-md text-subtle transition-colors hover:bg-surface3 hover:text-err"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
