/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Untitled UI dark surfaces (warm near-black)
        paper: "#0A0A09",
        surface: "#121211",
        surface2: "#1A1917",
        surface3: "#211F1A",
        line: "#26251F",
        line2: "#37342B",
        // Text
        ink: "#FAFAF9",
        muted: "#A3A3A3",
        subtle: "#737373",
        // Accent — Untitled UI "warning" scale
        amber: {
          DEFAULT: "#FDB022",
          deep: "#F79009",
          light: "#FEC84B",
          dark: "#DC6803",
        },
        ok: "#47CD89",
        err: "#F97066",
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "Menlo", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,.4)",
        lift: "0 18px 30px -18px rgba(0,0,0,.9)",
        panel: "0 48px 90px -40px rgba(0,0,0,.95)",
      },
    },
  },
  plugins: [],
};
