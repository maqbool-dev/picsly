// Hand-written inline SVG icons — no icon library.
// 24×24 viewBox, stroke follows currentColor unless a colour is passed.

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
  "aria-hidden": "true",
};

const thin = { ...S, strokeWidth: 1.8 };

export const Upload = (p) => (
  <svg {...S} {...p} strokeWidth="2.1">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8l-5-5-5 5" />
    <path d="M12 3v12" />
  </svg>
);

export const UploadTray = (p) => (
  <svg {...thin} {...p} strokeWidth="1.9">
    <path d="M12 16V4" />
    <path d="M8 8l4-4 4 4" />
    <path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" />
  </svg>
);

export const ArrowRight = (p) => (
  <svg {...S} {...p}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

export const Refresh = (p) => (
  <svg {...S} {...p} strokeWidth="2.2">
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <path d="M21 3v6h-6" />
  </svg>
);

export const X = (p) => (
  <svg {...S} {...p} strokeWidth="2.2">
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

export const Check = (p) => (
  <svg {...S} {...p} strokeWidth="2.6">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const Chevron = (p) => (
  <svg {...S} {...p} strokeWidth="2.4">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

/* ── Section icons ── */

export const Shield = (p) => (
  <svg {...thin} {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const Target = (p) => (
  <svg {...thin} {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" />
  </svg>
);

export const Grid = (p) => (
  <svg {...thin} {...p}>
    <rect x="3" y="3" width="8" height="8" rx="1.6" />
    <rect x="13" y="3" width="8" height="8" rx="1.6" />
    <rect x="3" y="13" width="8" height="8" rx="1.6" />
    <rect x="13" y="13" width="8" height="8" rx="1.6" />
  </svg>
);
