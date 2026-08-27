/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#0A0A09",      // page
        paper2: "#0C0C0B",     // alternating section band
        inset: "#0F0F0E",      // inputs / dropzone well
        surface: "#121211",    // card
        surface2: "#1A1917",   // card header, hover
        surface3: "#211F1A",   // pressed / badge
        warm: "#16150F",       // file row
        line: "#26251F",
        line2: "#37342B",
        line3: "#525252",
        ink: "#FAFAF9",
        ink2: "#D4D4D4",
        muted: "#A3A3A3",
        subtle: "#737373",
        amber: {
          DEFAULT: "#FDB022",
          light: "#FEC84B",
          deep: "#F79009",
          ink: "#26180A",      // text on amber
        },
        ok: "#47CD89",
        err: "#F97066",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "Menlo", "monospace"],
      },
      maxWidth: { page: "1180px" },
      boxShadow: {
        card: "0 48px 90px -40px rgba(0,0,0,0.95)",
        btn: "0 1px 2px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(0,0,0,0.2)",
      },
    },
  },
  plugins: [],
};
