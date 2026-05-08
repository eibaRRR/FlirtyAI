import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--c-bg) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        surface2: "rgb(var(--c-surface-2) / <alpha-value>)",
        surface3: "rgb(var(--c-surface-3) / <alpha-value>)",
        // Backwards-compat aliases used across legacy components
        panel: "rgb(var(--c-surface) / <alpha-value>)",
        panel2: "rgb(var(--c-surface-2) / <alpha-value>)",
        border: "rgb(var(--c-border) / <alpha-value>)",
        borderStrong: "rgb(var(--c-border-strong) / <alpha-value>)",
        text: "rgb(var(--c-text) / <alpha-value>)",
        text2: "rgb(var(--c-text-2) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        pink: "rgb(var(--c-pink) / <alpha-value>)",
        purple: "rgb(var(--c-purple) / <alpha-value>)",
        warm: "rgb(var(--c-warm) / <alpha-value>)",
        safe: "rgb(var(--c-safe) / <alpha-value>)",
        med: "rgb(var(--c-med) / <alpha-value>)",
        bold: "rgb(var(--c-bold) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      fontSize: {
        "2xs": ["11px", { lineHeight: "1.4", letterSpacing: "0.04em" }],
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "10px",
        md: "12px",
        lg: "14px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "28px",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, rgb(var(--c-pink)) 0%, rgb(var(--c-purple)) 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgb(var(--c-pink) / 0.12) 0%, rgb(var(--c-purple) / 0.12) 100%)",
        "brand-radial":
          "radial-gradient(circle at 30% 20%, rgb(var(--c-pink) / 0.25), transparent 55%), radial-gradient(circle at 80% 70%, rgb(var(--c-purple) / 0.25), transparent 60%)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        pop: "var(--shadow-pop)",
        cta: "var(--shadow-cta)",
        glow: "0 0 0 4px rgb(var(--c-pink) / 0.15)",
      },
      animation: {
        "pulse-slow": "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "toast-in": "toast-in 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
        "toast-out": "toast-out 0.2s ease-in forwards",
        "slide-up": "slide-up 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "slide-down": "slide-down 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "fade-in": "fade-in 0.25s ease-out both",
        "scale-in": "scale-in 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "pop-in": "pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "drawer-right-in": "drawer-right-in 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "drawer-left-in": "drawer-left-in 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "sheet-up-in": "sheet-up-in 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "backdrop-in": "backdrop-in 0.2s ease-out both",
        "dot-wave": "dot-wave 1.2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        "ping-once": "ping-once 0.6s ease-out forwards",
      },
      keyframes: {
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "toast-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(8px)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.7)" },
          "60%": { transform: "scale(1.08)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "drawer-right-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "drawer-left-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "sheet-up-in": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "backdrop-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "dot-wave": {
          "0%, 80%, 100%": { transform: "translateY(0)", opacity: "0.5" },
          "40%": { transform: "translateY(-4px)", opacity: "1" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "ping-once": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
