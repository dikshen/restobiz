import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F4F0",
        "paper-raised": "#FFFFFF",
        ink: {
          DEFAULT: "#16140F",
          soft: "#4A463E",
          faint: "#8B8579",
        },
        line: "#E4E1D8",
        amber: {
          50: "#FDF3E2",
          100: "#FBE4BB",
          400: "#F0A93A",
          500: "#E08600",
          600: "#BD6E00",
          700: "#95560A",
        },
        veg: {
          DEFAULT: "#0F6B4C",
          bg: "#E5F2EB",
        },
        nonveg: {
          DEFAULT: "#A6193C",
          bg: "#F7E7EA",
        },
        spicy: {
          DEFAULT: "#C24914",
          bg: "#FCEBDF",
        },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.375rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,20,15,0.04), 0 8px 24px -12px rgba(22,20,15,0.12)",
        "card-hover": "0 2px 4px rgba(22,20,15,0.06), 0 16px 32px -12px rgba(22,20,15,0.18)",
        sheet: "0 -8px 40px -8px rgba(22,20,15,0.25)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16,1,0.3,1) both",
        "slide-in-right": "slide-in-right 0.35s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
