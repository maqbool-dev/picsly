// Client-side image format conversion — 100% in the browser, mirrors the
// structure of compress.js. Converts between JPEG / PNG / WebP via the Canvas
// API, and accepts HEIC/HEIF *input* (common from iPhones), decoding it with
// heic2any first.
//
// One-directional on HEIC by design: HEIC in, never HEIC out. There is no
// practical in-browser HEIC/HEVC encoder (H.265 is patent-encumbered), so
// HEIC is intentionally not offered as a destination. Do not "fix" this.

import { MAX_INPUT_BYTES } from "./compress.js";

// Destination formats we can actually *write* in the browser.
const MIME = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
const EXT = { jpeg: "jpg", png: "png", webp: "webp" };

// Accepted *inputs* (HEIC included). HEIC is not in the destination set above.
export const ACCEPTED_INPUT_LABEL = "JPG, PNG, WebP, or HEIC";
export const ACCEPTED_INPUT_ATTR =
  "image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif";

// Thrown when heic2any (or the subsequent decode) can't read a HEIC file, so
// the UI can show a tailored, plain-language message rather than a generic one.
export class HeicDecodeError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "HeicDecodeError";
    this.cause = cause;
  }
}

// Returns 'jpeg' | 'png' | 'webp' | 'heic' | 'unknown'. Falls back to the file
// extension because some browsers report an empty MIME type for HEIC/HEIF.
export function detectFormat(file) {
  if (!file) return "unknown";
  switch (file.type) {
    case "image/jpeg":
      return "jpeg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/heic":
    case "image/heif":
      return "heic";
    default:
      break;
  }
  const name = file.name || "";
  if (/\.(heic|heif)$/i.test(name)) return "heic";
  if (/\.jpe?g$/i.test(name)) return "jpeg";
  if (/\.png$/i.test(name)) return "png";
  if (/\.webp$/i.test(name)) return "webp";
  return "unknown";
}

// Returns a friendly error string if the file is no good, otherwise null.
export function validateInput(file) {
  if (!file) return "No file selected.";
  if (detectFormat(file) === "unknown") {
    return `That file type isn't supported. Please use ${ACCEPTED_INPUT_LABEL}.`;
  }
  if (file.size > MAX_INPUT_BYTES) {
    return "That image is over 50 MB. Please pick a smaller file.";
  }
  return null;
}

// Convert `file` to `destFormat` ('jpeg' | 'png' | 'webp'), returning a new
// File named `${originalName}-converted.${ext}`.
export async function convertImage(file, destFormat) {
  const destMime = MIME[destFormat];
  if (!destMime) throw new Error(`Unsupported destination format: ${destFormat}`);

  const isHeic = detectFormat(file) === "heic";

  // 1. Decode HEIC/HEIF to a workable JPEG blob first. heic2any is loaded
  //    lazily so its (large) libheif payload only downloads when actually
  //    needed — most conversions never touch it.
  let source = file;
  if (isHeic) {
    try {
      const { default: heic2any } = await import("heic2any");
      const decoded = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.92,
      });
      source = Array.isArray(decoded) ? decoded[0] : decoded;
    } catch (err) {
      throw new HeicDecodeError("Could not decode HEIC file.", err);
    }
  }

  // 2. Rasterize.
  let bitmap;
  try {
    bitmap = await createImageBitmap(source);
  } catch (err) {
    // A HEIC that slipped past heic2any (odd variant, corrupt) lands here too.
    if (isHeic) throw new HeicDecodeError("Could not decode HEIC file.", err);
    throw err;
  }

  // 3. Draw to an offscreen canvas at full natural resolution.
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");

  // 4. JPEG has no alpha channel — paint white first so transparent PNG/WebP
  //    sources don't come out with a black background.
  if (destMime === "image/jpeg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close?.();

  // 5. Encode. PNG ignores the quality arg (lossless); JPEG/WebP use 0.92.
  const quality = destMime === "image/png" ? undefined : 0.92;
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, destMime, quality)
  );
  if (!blob) throw new Error("Canvas produced an empty blob.");

  // 6. Name it.
  const baseName = (file.name || "image").replace(/\.[^./\\]+$/, "") || "image";
  return new File([blob], `${baseName}-converted.${EXT[destFormat]}`, {
    type: destMime,
  });
}
