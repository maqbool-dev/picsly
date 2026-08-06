import { Plus, UploadCloud } from "./icons.jsx";

const INPUT_FORMATS = ["JPEG", "PNG", "WebP", "AVIF", "HEIC"];

// Drop / click / paste target. Renders full-size when the queue is empty and a
// slim "add more" strip once files are loaded. It's a real <button>, so Enter
// and Space open the picker without any extra keyboard handling.
export default function Dropzone({ slim, dragOn, onOpen, dragProps }) {
  if (slim) {
    return (
      <button
        type="button"
        onClick={onOpen}
        {...dragProps}
        className="flex items-center gap-3 rounded-[14px] border border-dashed px-4 py-3.5 text-left transition-colors"
        style={{
          borderColor: dragOn ? "rgba(253,176,34,.7)" : "rgba(253,176,34,.3)",
          background: dragOn ? "rgba(253,176,34,.1)" : "rgba(253,176,34,.03)",
        }}
      >
        <span
          className="grid h-[34px] w-[34px] flex-none place-items-center rounded-[9px] text-amber-light"
          style={{ background: "rgba(253,176,34,.12)" }}
        >
          <Plus className="h-[18px] w-[18px]" />
        </span>
        <span className="text-sm font-semibold text-ink">Add more images</span>
        <span className="text-[13px] text-subtle">drop, click or paste</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      {...dragProps}
      className="relative flex min-h-[190px] flex-col items-center justify-center gap-3.5 rounded-2xl px-5 py-7 text-center sm:min-h-[250px]"
      style={{
        border: "1.5px dashed",
        borderColor: dragOn ? "rgba(253,176,34,.85)" : "rgba(253,176,34,.3)",
        background: dragOn
          ? "rgba(253,176,34,.1)"
          : "radial-gradient(ellipse 70% 100% at 50% 0%,rgba(253,176,34,.07),transparent 70%)",
        boxShadow: dragOn
          ? "inset 0 0 80px -20px rgba(253,176,34,.5),0 0 0 4px rgba(253,176,34,.16)"
          : "none",
        transition: "border-color .18s, background .18s, box-shadow .18s",
      }}
    >
      <div
        className="grid h-[60px] w-[60px] place-items-center rounded-2xl text-amber-light"
        style={{
          background:
            "linear-gradient(180deg,rgba(253,176,34,.18),rgba(253,176,34,.06))",
          border: "1px solid rgba(253,176,34,.28)",
          boxShadow: "0 10px 30px -12px rgba(253,176,34,.5)",
        }}
      >
        <UploadCloud className="h-[26px] w-[26px]" />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="text-lg font-semibold tracking-[-0.02em] text-ink sm:text-[22px]">
          {dragOn ? "Release to add them" : "Drop your images here"}
        </div>
        <div className="text-sm text-subtle">
          or click to browse — you can also paste with{" "}
          <kbd className="rounded-md border border-line2 bg-surface2 px-1.5 py-0.5 font-mono text-xs text-muted">
            ⌘ V
          </kbd>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {INPUT_FORMATS.map((f) => (
          <span
            key={f}
            className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold tracking-[0.06em] text-subtle"
            style={{ background: "rgba(255,255,255,.04)" }}
          >
            {f}
          </span>
        ))}
      </div>
    </button>
  );
}
