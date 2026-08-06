// Hand-written inline SVG icons — no icon library.
// Lucide-style geometry, 24×24 viewBox, stroke follows currentColor.
// Every icon takes a className for sizing, e.g. <Check className="h-4 w-4" />.

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
  <svg {...S} {...p}>
    <path d="M12 3v12" />
    <path d="m7 8 5-5 5 5" />
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
  </svg>
);

export const UploadCloud = (p) => (
  <svg {...thin} {...p} strokeWidth="1.7">
    <path d="M12 13v8" />
    <path d="m8 17 4-4 4 4" />
    <path d="M20.4 14.9A5 5 0 0 0 18 5.5h-1.3A7 7 0 1 0 4 12.3" />
  </svg>
);

export const Plus = (p) => (
  <svg {...thin} {...p} strokeWidth="1.9">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export const Download = (p) => (
  <svg {...S} {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m7 10 5 5 5-5" />
    <path d="M12 15V3" />
  </svg>
);

export const ArrowRight = (p) => (
  <svg {...S} {...p}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const ArrowDown = (p) => (
  <svg {...S} {...p} strokeWidth="2.2">
    <path d="M12 19V5" />
    <path d="m5 12 7 7 7-7" />
  </svg>
);

export const Refresh = (p) => (
  <svg {...S} {...p}>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

export const Trash = (p) => (
  <svg {...S} {...p}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const X = (p) => (
  <svg {...S} {...p} strokeWidth="2.4">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const Check = (p) => (
  <svg {...S} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const Chevron = (p) => (
  <svg {...S} {...p} strokeWidth="2.2">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const Alert = (p) => (
  <svg {...S} {...p}>
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

export const Compare = (p) => (
  <svg {...S} {...p}>
    <path d="m9 7-5 5 5 5" />
    <path d="m15 7 5 5-5 5" />
  </svg>
);

/* ── Feature / section icons ── */

export const Target = (p) => (
  <svg {...thin} {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v3" />
    <path d="M12 18v3" />
    <path d="M3 12h3" />
    <path d="M18 12h3" />
  </svg>
);

export const Shield = (p) => (
  <svg {...thin} {...p}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const Layers = (p) => (
  <svg {...thin} {...p}>
    <path d="M12 3 3 7.5 12 12l9-4.5z" />
    <path d="m3 12 9 4.5 9-4.5" />
    <path d="m3 16.5 9 4.5 9-4.5" />
  </svg>
);

export const Grid = (p) => (
  <svg {...thin} {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const SplitView = (p) => (
  <svg {...thin} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    <path d="M12 3v18" />
    <circle cx="7.5" cy="8" r="1.2" />
  </svg>
);

export const Bolt = (p) => (
  <svg {...thin} {...p}>
    <path d="M13 2 3 14h8l-1 8 10-12h-8z" />
  </svg>
);

export const Lock = (p) => (
  <svg {...thin} {...p}>
    <rect x="4" y="10" width="16" height="11" rx="2.5" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);
