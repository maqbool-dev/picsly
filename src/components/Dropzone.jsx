import { Plus, UploadCloud } from "./icons.jsx";

// Drop / click / paste target. Full-size when the queue is empty, a slim strip
// once files are loaded. It's a real <button>, so Enter and Space open the
// picker without extra keyboard handling.
export default function Dropzone({ slim, dragOn, onOpen, dragProps }) {
  if (slim) {
    return (
      <button
        type="button"
        onClick={onOpen}
        {...dragProps}
        className="flex items-center gap-3 rounded-xl border border-dashed px-4 py-3 text-left transition-colors"
        style={{
          borderColor: dragOn ? "rgba(253,176,34,.6)" : "var(--pl-bd2)",
          background: dragOn ? "rgba(253,176,34,.06)" : "transparent",
        }}
      >
        <span className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-line text-muted">
          <Plus className="h-4 w-4" />
        </span>
        <span className="text-sm font-medium text-ink">Add more images</span>
        <span className="text-[13px] text-subtle">drop, click or paste</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      {...dragProps}
      className="flex min-h-[168px] flex-col items-center justify-center gap-3 rounded-xl px-5 py-10 text-center transition-colors"
      style={{
        border: "1px dashed",
        borderColor: dragOn ? "rgba(253,176,34,.6)" : "var(--pl-bd2)",
        background: dragOn ? "rgba(253,176,34,.05)" : "transparent",
      }}
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-line text-muted">
        <UploadCloud className="h-5 w-5" />
      </span>

      <span className="text-base font-medium text-ink">
        {dragOn ? "Release to add" : "Drop images here"}
      </span>

      <span className="text-[13px] text-subtle">
        or click to browse · paste with{" "}
        <kbd className="font-mono text-xs text-muted">⌘V</kbd>
      </span>

      <span className="text-xs text-subtle/70">
        JPEG, PNG, WebP, AVIF, HEIC · up to 50 files
      </span>
    </button>
  );
}
