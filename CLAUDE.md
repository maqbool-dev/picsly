# Picsly — Claude Code Context

> Rebranded from "Squish" to **Picsly**. The GitHub repo (`maqbool-dev/squish`),
> Docker Hub namespace (`maqbool404/squish`), and Netlify subdomain
> (`squishh.netlify.app`) are infrastructure identifiers and intentionally
> still carry the old name — do not treat those as stragglers to rename.

## What this project is
A 100% client-side image compressor built with React + Vite + Tailwind CSS.
Users set a target file size in MB; the app iteratively compresses the image
until it lands under that number. Nothing is ever uploaded to a server.

Live site: https://squishh.netlify.app
GitHub: maqbool-dev/squish
Docker Hub: maqbool404/squish

---

## Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Framework   | React 19                                |
| Build tool  | Vite 8                                  |
| Styling     | Tailwind CSS 3                          |
| Compression | browser-image-compression ^2.0.2        |
| Conversion  | Canvas API + heic2any (HEIC/HEIF decode, lazy-loaded) |
| Animation   | motion (`motion/react`) — Framer Motion's successor |
| Hosting     | Netlify (CI/CD via GitHub — auto-deploy on push) |
| Container   | Docker Hub maqbool404/squish (manual build + push) |
| Runtime     | Node.js via Homebrew, Mac Apple Silicon |

---

## Project structure

```
squish/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── icons.jsx          # All inline SVG icons — no icon library
│   │   ├── Header.jsx         # Sticky nav bar
│   │   ├── Hero.jsx           # Headline + embeds the Compressor tool
│   │   ├── Compressor.jsx     # Main stateful component (upload → compress → result)
│   │   ├── Dropzone.jsx       # Drag-and-drop + file picker UI
│   │   ├── ResultPreview.jsx  # Stats, savings meter, download button
│   │   ├── CompareSlider.jsx  # Draggable before/after comparison
│   │   ├── Features.jsx       # "Why Picsly" feature cards
│   │   ├── HowItWorks.jsx     # 3-step explainer section
│   │   ├── FAQ.jsx            # Accordion FAQ
│   │   ├── FormatWeaver.jsx   # Client-side JPEG/PNG/WebP conversion (+ HEIC input)
│   │   ├── FormatPill.jsx     # Reusable format pill (source display / dest select)
│   │   └── Footer.jsx
│   ├── utils/
│   │   ├── compress.js        # Validates file + wraps browser-image-compression
│   │   ├── convert.js         # Format conversion (canvas) + HEIC decode via heic2any
│   │   └── format.js          # formatBytes(), formatDims(), formatSavings()
│   ├── App.jsx                # Assembles all sections in order
│   ├── main.jsx               # React entry point
│   └── index.css              # Tailwind directives + Google Fonts import
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── netlify.toml               # build: npm run build, publish: dist
├── CLAUDE.md                  # You are here
└── package.json
```

---

## Design system — do not change these

### Colors
Dark, warm "ember" theme (a redesign replaced the original light/green look —
do NOT revert to green). Source of truth is `tailwind.config.js`.

| Token        | Value                    | Usage                              |
|--------------|--------------------------|------------------------------------|
| paper        | #0E0F0A                  | Page background (deep warm black)  |
| surface      | #16170F                  | Card / panel backgrounds           |
| ink          | #F0EFE8                  | Primary text (warm off-white)      |
| muted        | #9A9A8E                  | Secondary text, labels             |
| line         | rgba(240,239,232,0.08)   | Borders, dividers                  |
| amber        | #F5A524 (bright #FFB84D, soft rgba(245,165,36,0.12)) | **Primary accent** — buttons, active/done states, links, savings % |
| ember        | #F2682C                  | Secondary — gradients, particles, warning state |
| spark        | #D9342B                  | Deep accent dots                   |
| hot          | #FFE9C7                  | Hot highlight                      |

There is no green `leaf` token anymore. Errors/warnings use `ember`.

### Typography
| Role     | Font               | Usage                              |
|----------|--------------------|----------------------------------  |
| display  | Space Grotesk      | All headings (h1, h2, h3, feature titles) — `font-display` |
| body     | Inter              | Paragraphs, general UI text — `font-sans` |
| mono     | JetBrains Mono     | All numbers, file sizes, stats, labels, badges — `font-mono` |

**Rule:** any number, measurement, percentage, or filename shown to the user
must use JetBrains Mono. Never use Inter for numerical data.

### Border radius
Cards and panels use `borderRadius: 20` (inline) or `rounded-xl` (Tailwind).
Buttons use `rounded-full`. Do not introduce other radius values.

### Shadows
Two shadow levels defined in `tailwind.config.js`:
- `shadow-card` — default card elevation
- `shadow-lift` — hover / draggable elements (e.g. compare slider handle)

---

## Core rules — never break these

1. **No server calls.** Compression is entirely in the browser via
   `browser-image-compression`. Do not add fetch/axios/API calls for
   image processing under any circumstances.

2. **Accepted input types:** the **compressor** takes `image/jpeg`,
   `image/png`, `image/webp` only. The **Format Weaver** additionally accepts
   HEIC/HEIF *input* (decoded via `heic2any`) — see the Format Weaver note
   below for the HEIC-in / never-HEIC-out rule.

3. **Max upload size:** 50 MB hard limit enforced in `compress.js`.

4. **Default target size:** 2 MB.

5. **Error messages** must be user-friendly plain English — no stack traces,
   no technical jargon shown in the UI. Errors appear in the amber
   warning style (border `amber + 33` opacity, background `amberSoft`).

6. **No icon libraries.** All icons are hand-written inline SVGs in
   `icons.jsx`. Add new icons there in the same style.

7. **Do not change fonts or colors.** The dark, warm ember/amber visual
   identity (see Colors / Typography above) is intentional. Do not revert to
   the old light/green look or introduce new accent hues.

---

## Format Weaver (`FormatWeaver.jsx` + `utils/convert.js`)

Client-side image **format conversion**, a sibling section to the compressor
(rendered between the upload tool and Features). Converts between JPEG / PNG /
WebP via the Canvas API, entirely in the browser.

- **HEIC in, never HEIC out — this is intentional, not a bug.** HEIC/HEIF is
  accepted as *input* (common from iPhones) and decoded to JPEG via `heic2any`
  before the canvas step. It is deliberately NOT offered as a destination:
  there is no practical in-browser HEIC/HEVC encoder (H.265 is patent-
  encumbered). Do not add HEIC to the destination pills or try to "fix" this.
- `heic2any` is **lazy-loaded** via dynamic `import()` inside `convertImage()`
  so its ~1.3 MB libheif payload only downloads when a HEIC file is actually
  converted. Keep it that way.
- HEIC decode failure throws `HeicDecodeError`, which the UI turns into a
  plain-language message suggesting the user re-export as JPEG from Photos.
- **JPEG has no alpha** — `convert.js` paints a white background before
  `drawImage` so transparent PNG/WebP sources don't convert with a black
  background. Don't remove that `fillRect`.
- The ambient burst animation is plain CSS keyframes in `index.css` (inside
  the `prefers-reduced-motion: no-preference` block); ember particles are not
  rendered at all under reduced motion. Result reveal + pill/button micro-
  interactions use `motion/react` (respecting the app's `MotionConfig`).

---

## Known issues

### Mobile compression error (Android)
- Some Android users hit a compression failure, exact error unknown
- Hypothesis A: Vite JS chunk fails to load on weak networks, leaving
  the compression worker undefined when the user tries to compress
- Hypothesis B: Large images exceed Android Chrome's canvas memory limit
- Status: unconfirmed — need to capture the real error from console.error
- Do not assume HEIC is the cause; this user is on Android

---

## Planned features (not yet implemented)

- [ ] Capture and log the real mobile error to diagnose the Android bug
- [ ] Add a compression timeout (30s) with a user-friendly message
- [x] HEIC/HEIF input support using `heic2any` — shipped in the Format Weaver
- [x] Format conversion (JPEG / PNG / WebP) — shipped as the Format Weaver

---

## Deployment

### Netlify (primary — auto-deploys)
```bash
git add .
git commit -m "your message"
git push origin main
# Netlify picks it up automatically via the GitHub integration
```

### Docker Hub (manual)
```bash
docker build -t maqbool404/squish .
docker push maqbool404/squish
```

### Local dev
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs to /dist
npm run preview   # preview the production build locally
```

---

## What Claude Code should know about working in this repo

- Always run `npm run build` after making changes to verify no build errors
- If you edit `tailwind.config.js` color tokens, also update the `C` object
  in any component that uses inline color constants (Compressor.jsx, etc.)
- The compare slider (`CompareSlider.jsx`) uses pointer events — test on
  both mouse and touch when changing it
- `compress.js` is the most critical file — be conservative with changes
  and always preserve the client-side-only constraint
- Prefer editing existing components over creating new ones unless the
  feature clearly warrants a new file
