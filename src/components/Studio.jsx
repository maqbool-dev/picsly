import { useCallback, useEffect, useRef, useState } from "react";
import HeroGlow from "./HeroGlow.jsx";
import Dropzone from "./Dropzone.jsx";
import ToolControls from "./ToolControls.jsx";
import FileCard from "./FileCard.jsx";
import SummaryBar from "./SummaryBar.jsx";
import CompareView from "./CompareView.jsx";
import {
  ACCEPT_ATTR,
  MAX_FILES,
  MAX_INPUT_BYTES,
  MIME,
  decodeImage,
  detectAvifSupport,
  encodeCanvas,
  fmtBytes,
  isAcceptedFile,
  outName,
  searchTarget,
} from "../utils/imageEngine.js";

const TRUST = ["No uploads", "No account", "No watermark", "Free"];

const DEFAULTS = {
  mode: "target",
  targetVal: 200,
  targetUnit: "KB",
  format: "auto",
  quality: 0.75,
  maxDim: 0,
};

let seq = 0;

// The whole tool: hero, drop target, settings, batch queue and results.
// Everything runs locally — see utils/imageEngine.js.
export default function Studio() {
  const [files, setFiles] = useState([]);
  const [settings, setSettings] = useState(DEFAULTS);
  const [running, setRunning] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [dragOn, setDragOn] = useState(false);
  const [avifOk, setAvifOk] = useState(false);
  const [compareId, setCompareId] = useState(null);
  const [disp, setDisp] = useState({ orig: 0, out: 0 });

  const inputRef = useRef(null);
  // filesRef/settingsRef mirror state synchronously so the async queue always
  // sees current values instead of a stale render closure.
  const filesRef = useRef(files);
  const settingsRef = useRef(settings);
  const busyRef = useRef(false);
  const tweenRaf = useRef(0);
  const reduced = useRef(false);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    detectAvifSupport().then(setAvifOk);
  }, []);

  const commit = useCallback((next) => {
    filesRef.current = next;
    setFiles(next);
  }, []);

  const patch = useCallback(
    (id, upd) => {
      commit(filesRef.current.map((f) => (f.id === id ? { ...f, ...upd } : f)));
    },
    [commit]
  );

  /* ── totals, with a short roll-up animation ── */
  const tween = useCallback(() => {
    const done = filesRef.current.filter((f) => f.status === "done");
    const target = {
      orig: done.reduce((a, f) => a + f.orig, 0),
      out: done.reduce((a, f) => a + (f.out || 0), 0),
    };
    cancelAnimationFrame(tweenRaf.current);

    if (reduced.current) {
      setDisp(target);
      return;
    }
    setDisp((from) => {
      const t0 = performance.now();
      const go = () => {
        const k = Math.min(1, (performance.now() - t0) / 700);
        const e = 1 - Math.pow(1 - k, 3);
        setDisp({
          orig: from.orig + (target.orig - from.orig) * e,
          out: from.out + (target.out - from.out) * e,
        });
        if (k < 1) tweenRaf.current = requestAnimationFrame(go);
      };
      tweenRaf.current = requestAnimationFrame(go);
      return from;
    });
  }, []);

  const targetBytes = useCallback(() => {
    const s = settingsRef.current;
    const v = Math.max(1, Number(s.targetVal) || 1);
    return Math.round(v * (s.targetUnit === "MB" ? 1048576 : 1024));
  }, []);

  const outMime = useCallback(() => {
    const s = settingsRef.current;
    return s.format === "auto" ? "image/webp" : MIME[s.format];
  }, []);

  /* ── one file ── */
  const processOne = useCallback(
    async (id) => {
      const item = filesRef.current.find((f) => f.id === id);
      if (!item) return;
      patch(id, { status: "working", pct: 0.05 });

      try {
        const s = settingsRef.current;
        const src = await decodeImage(item.file);
        const iw = src.naturalWidth || src.width;
        const ih = src.naturalHeight || src.height;
        const mime = outMime();

        let base = 1;
        const cap = Number(s.maxDim) || 0;
        if (cap) {
          const mx = Math.max(iw, ih);
          if (mx > cap) base = cap / mx;
        }

        let res;
        if (s.mode === "target") {
          res = await searchTarget(src, mime, targetBytes(), base, (p) =>
            patch(id, { pct: p })
          );
        } else {
          const blob = await encodeCanvas(src, mime, s.quality, base);
          res = { blob, q: s.quality, scale: base };
        }
        src.close?.();
        if (!res?.blob) throw new Error("Could not encode this image.");

        // If we made it bigger for no reason, keep the user's original.
        let blob = res.blob;
        let q = res.q;
        const scale = res.scale;
        let kept = false;
        const sameType = s.format === "auto" || item.file.type === mime;
        const alreadyFits = s.mode !== "target" || item.orig <= targetBytes();
        if (blob.size >= item.orig && sameType && alreadyFits && scale >= 0.999) {
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
    [outMime, patch, targetBytes, tween]
  );

  /* ── queue ── */
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
          // Oversize files are surfaced as a per-file error rather than
          // silently dropped, and never reach canvas decode.
          status: tooBig ? "error" : "queued",
          err: tooBig
            ? `That file is ${fmtBytes(file.size)} — over the 50 MB limit. Try a smaller image.`
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

      // Probe natural dimensions for the card labels.
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

  /* ── input / paste / drag ── */
  const openPicker = () => inputRef.current?.click();

  useEffect(() => {
    const onPaste = (e) => {
      const fs = e.clipboardData?.files;
      if (fs?.length) {
        e.preventDefault();
        addFiles(fs);
      }
    };
    const swallow = (e) => e.preventDefault();
    // Header / closing CTA ask for the picker without prop drilling.
    const onBrowse = () => inputRef.current?.click();
    window.addEventListener("paste", onPaste);
    window.addEventListener("dragover", swallow);
    window.addEventListener("drop", swallow);
    window.addEventListener("picsly:browse", onBrowse);
    return () => {
      window.removeEventListener("paste", onPaste);
      window.removeEventListener("dragover", swallow);
      window.removeEventListener("drop", swallow);
      window.removeEventListener("picsly:browse", onBrowse);
    };
  }, [addFiles]);

  // Revoke every object URL when the component goes away.
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

  const dragProps = {
    onDragEnter: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOn(true);
    },
    onDragOver: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOn(true);
    },
    onDragLeave: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOn(false);
    },
    onDrop: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOn(false);
      const fs = e.dataTransfer?.files;
      if (fs?.length) addFiles(fs);
    },
  };

  /* ── actions ── */
  const mark = (upd) => {
    setSettings((s) => ({ ...s, ...upd }));
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
        f.status === "error" && f.orig > MAX_INPUT_BYTES
          ? f // leave oversize rejects alone
          : { ...f, status: "queued", pct: 0, err: null }
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

  /* ── derived ── */
  const doneFiles = files.filter((f) => f.status === "done");
  const totalOrig = doneFiles.reduce((a, f) => a + f.orig, 0);
  const totalOut = doneFiles.reduce((a, f) => a + (f.out || 0), 0);
  const savedPct = totalOrig
    ? Math.max(0, Math.round((1 - totalOut / totalOrig) * 100))
    : 0;
  const compareFile = files.find((f) => f.id === compareId && f.status === "done");
  const tBytes = targetBytes();

  return (
    <>
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

      <section id="tool" className="relative overflow-hidden px-5 pb-12 pt-16 sm:pb-20 sm:pt-28">
        <HeroGlow />

        {/* Hero copy */}
        <div className="relative mx-auto flex max-w-[640px] flex-col items-center gap-4 text-center">
          <h1 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[46px]">
            Compress images to an exact size.
          </h1>

          <p className="max-w-[48ch] text-[15px] leading-relaxed text-muted sm:text-base">
            Set your limit — 200&nbsp;KB, 2&nbsp;MB, anything. Picsly finds the
            best quality that fits, entirely in your browser.
          </p>
        </div>

        {/* Tool card */}
        <div className="relative mx-auto mt-10 max-w-[720px]">
          <div className="flex flex-col gap-4">
            <Dropzone
              slim={files.length > 0}
              dragOn={dragOn}
              onOpen={openPicker}
              dragProps={dragProps}
            />

            <ToolControls
              mode={settings.mode}
              setMode={(v) => mark({ mode: v })}
              targetVal={settings.targetVal}
              setTargetVal={(v) => mark({ targetVal: v })}
              targetUnit={settings.targetUnit}
              setTargetUnit={(v) => mark({ targetUnit: v })}
              quality={settings.quality}
              setQuality={(v) => mark({ quality: v })}
              format={settings.format}
              setFormat={(v) => mark({ format: v })}
              maxDim={settings.maxDim}
              setMaxDim={(v) => mark({ maxDim: v })}
              avifOk={avifOk}
            />

            {files.length > 0 && (
              <div className="flex flex-col gap-3.5">
                <SummaryBar
                  dispOrig={disp.orig}
                  dispOut={disp.out}
                  savedPct={savedPct}
                  doneLabel={
                    running
                      ? "Working…"
                      : doneFiles.length === 1
                        ? "1 image ready"
                        : `${doneFiles.length} images ready`
                  }
                  dirty={dirty}
                  onRequeue={requeue}
                  onDownloadAll={downloadAll}
                  onClear={clearAll}
                  downloadDisabled={doneFiles.length === 0}
                />

                <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
                  {files.map((f) => (
                    <FileCard
                      key={f.id}
                      f={f}
                      compareOn={compareId === f.id}
                      overTarget={
                        f.status === "done" &&
                        settings.mode === "target" &&
                        f.out > tBytes
                      }
                      onRemove={() => removeFile(f.id)}
                      onCompare={() => setCompareId(f.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Trust line — one quiet sentence, no icons */}
          <p className="mt-5 text-center text-[13px] text-subtle">
            {TRUST.join(" · ")}
          </p>
        </div>
      </section>

      {compareFile && <CompareView file={compareFile} />}
    </>
  );
}
