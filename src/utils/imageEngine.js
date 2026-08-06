// Picsly image engine — 100% in-browser.
//
// Everything here runs on the user's device: decode with the browser's own
// image pipeline, re-encode onto a canvas, and binary-search quality (then
// scale) until the result fits under the requested ceiling. No uploads.
//
// Two deliberate additions over the reference design:
//   1. HEIC/HEIF is decoded via a lazily-imported `heic2any`. Browsers other
//      than Safari cannot decode HEIC natively, so `createImageBitmap` alone
//      would fail on Chrome/Firefox for iPhone photos.
//   2. A hard 50 MB per-file input cap, so a huge file can't take the tab
//      down on canvas decode.

export const MIME = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
};

export const EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export const MAX_INPUT_BYTES = 50 * 1024 * 1024; // 50 MB per file
export const MAX_FILES = 50;

const HEIC_RE = /\.(hei[cf])$/i;
const ACCEPT_RE = /\.(hei[cf]|jpe?g|png|webp|avif)$/i;

export const ACCEPT_ATTR = "image/*,.heic,.heif,.avif";

export function fmtBytes(b) {
  if (b == null || Number.isNaN(b)) return "—";
  if (b < 1024) return `${Math.round(b)} B`;
  if (b < 1048576) {
    const k = b / 1024;
    return `${k < 10 ? k.toFixed(1) : Math.round(k)} KB`;
  }
  const m = b / 1048576;
  return `${m < 10 ? m.toFixed(2) : m.toFixed(1)} MB`;
}

export function isAcceptedFile(f) {
  if (!f) return false;
  return (f.type && f.type.startsWith("image/")) || ACCEPT_RE.test(f.name || "");
}

export function isHeic(file) {
  const t = (file.type || "").toLowerCase();
  return t === "image/heic" || t === "image/heif" || HEIC_RE.test(file.name || "");
}

// Output filename: photo.heic → photo-picsly.webp
export function outName(name, outType) {
  const base = (name || "image").replace(/\.[^./\\]+$/, "") || "image";
  return `${base}-picsly.${EXT[outType] || "jpg"}`;
}

// Can this browser *encode* AVIF? Chrome/Firefox can, Safari currently can't.
export async function detectAvifSupport() {
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 4;
    const b = await new Promise((r) => c.toBlob(r, "image/avif", 0.5));
    return !!b && b.type === "image/avif";
  } catch {
    return false;
  }
}

export class DecodeError extends Error {
  constructor(message) {
    super(message);
    this.name = "DecodeError";
  }
}

// Decode a File into something drawable (ImageBitmap or HTMLImageElement).
export async function decodeImage(file) {
  let source = file;

  // HEIC/HEIF first — most browsers can't decode it, so convert to JPEG.
  // heic2any is a large libheif payload, so it's only pulled in on demand.
  if (isHeic(file)) {
    try {
      const { default: heic2any } = await import("heic2any");
      const decoded = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.92,
      });
      source = Array.isArray(decoded) ? decoded[0] : decoded;
    } catch {
      throw new DecodeError(
        "Couldn't read this HEIC photo. Re-export it as JPEG from Photos and try again."
      );
    }
  }

  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(source);
    } catch {
      /* fall through to <img> */
    }
  }

  const url = URL.createObjectURL(source);
  try {
    return await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () =>
        rej(new DecodeError("This browser can't decode that file. Try a JPEG or PNG."));
      i.src = url;
    });
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}

// Draw `src` at `scale` and encode to `mime`. JPEG has no alpha, so it gets a
// white matte first — otherwise transparent PNG/WebP goes out black.
export async function encodeCanvas(src, mime, q, scale) {
  const iw = src.naturalWidth || src.width;
  const ih = src.naturalHeight || src.height;
  const w = Math.max(1, Math.round(iw * scale));
  const h = Math.max(1, Math.round(ih * scale));

  let cv;
  if (typeof OffscreenCanvas !== "undefined") {
    cv = new OffscreenCanvas(w, h);
  } else {
    cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
  }

  const ctx = cv.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  if (mime === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(src, 0, 0, w, h);

  if (cv.convertToBlob) {
    return await cv.convertToBlob(
      mime === "image/png" ? { type: mime } : { type: mime, quality: q }
    );
  }
  return await new Promise((r) =>
    cv.toBlob(r, mime, mime === "image/png" ? undefined : q)
  );
}

// Find the highest-quality encode that still fits under `target` bytes.
// Per scale round: binary-search quality in [0.04, 0.96]. If nothing fits even
// at the quality floor, shrink dimensions (×0.78) and try again. PNG is
// lossless, so for it only the scale loop applies.
export async function searchTarget(src, mime, target, base, onProgress) {
  const lossless = mime === "image/png";
  let scale = base;
  let best = null;
  let tick = 0;
  const bump = () => {
    tick += lossless ? 2 : 1;
    onProgress?.(Math.min(0.94, tick / 14));
  };

  for (let round = 0; round < 8; round++) {
    if (lossless) {
      const b = await encodeCanvas(src, mime, undefined, scale);
      bump();
      if (!best || b.size < best.blob.size) best = { blob: b, q: null, scale };
      if (b.size <= target) return { blob: b, q: null, scale };
    } else {
      let lo = 0.04;
      let hi = 0.96;
      let local = null;
      for (let i = 0; i < 9; i++) {
        const q = (lo + hi) / 2;
        const b = await encodeCanvas(src, mime, q, scale);
        bump();
        if (b.size <= target) {
          local = { blob: b, q, scale };
          lo = q;
        } else {
          hi = q;
        }
        if (hi - lo < 0.012) break;
      }
      if (local) return local;
      const floor = await encodeCanvas(src, mime, 0.04, scale);
      if (!best || floor.size < best.blob.size) {
        best = { blob: floor, q: 0.04, scale };
      }
    }
    scale *= 0.78;
  }

  return best;
}
