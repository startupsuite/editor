import type { Config } from "tailwindcss"
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Material 3 Expression color tokens
        "md-primary": "#000000", // Changed to black for neutral theme
        "md-on-primary": "#FFFFFF",
        "md-primary-container": "#f5f5f5", // Changed to light gray for neutral theme
        "md-on-primary-container": "#000000", // Changed to black for neutral theme
        "md-secondary": "#333333", // Changed to dark gray for neutral theme
        "md-on-secondary": "#FFFFFF",
        "md-secondary-container": "#e0e0e0", // Changed to medium gray for neutral theme
        "md-on-secondary-container": "#000000", // Changed to black for neutral theme
        "md-tertiary": "#666666", // Changed to medium gray for neutral theme
        "md-on-tertiary": "#FFFFFF",
        "md-tertiary-container": "#e8e8e8", // Changed to light gray for neutral theme
        "md-on-tertiary-container": "#000000", // Changed to black for neutral theme
        "md-error": "#B3261E",
        "md-on-error": "#FFFFFF",
        "md-error-container": "#F9DEDC",
        "md-on-error-container": "#410E0B",
        "md-surface": "#FFFFFF", // Changed to white for neutral theme
        "md-on-surface": "#000000", // Changed to black for neutral theme
        "md-surface-variant": "#f5f5f5", // Changed to light gray for neutral theme
        "md-on-surface-variant": "#333333", // Changed to dark gray for neutral theme
        "md-outline": "#e0e0e0", // Changed to medium gray for neutral theme
        "md-outline-variant": "#f0f0f0", // Changed to light gray for neutral theme
        "md-shadow": "#000000",
        "md-surface-tint": "#000000", // Changed to black for neutral theme
        "md-inverse-surface": "#333333", // Changed to dark gray for neutral theme
        "md-inverse-on-surface": "#FFFFFF",
        // Surface container colors
        "md-surface-container-lowest": "#FFFFFF", // Changed to white for neutral theme
        "md-surface-container-low": "#f9f9f9", // Changed to very light gray for neutral theme
        "md-surface-container": "#f5f5f5", // Changed to light gray for neutral theme
        "md-surface-container-high": "#e8e8e8", // Changed to light gray for neutral theme
        "md-surface-container-highest": "#e0e0e0", // Changed to medium gray for neutral theme
        // Neutral color scheme
        "neutral-background": "#FFFFFF",
        "neutral-card": "#F5F5F5",
        "neutral-card-hover": "#E8E8E8",
        "neutral-text": "#333333",
        "neutral-text-light": "#666666",
        "neutral-text-dark": "#000000",
        "neutral-border": "#E0E0E0",
        "neutral-active": "#E0E0E0",
      },
      boxShadow: {
        // Material 3 Expression elevation tokens
        "md-elevation-1": "0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)",
        "md-elevation-2": "0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)",
        "md-elevation-3": "0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)",
        "md-elevation-4": "0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3)",
        "md-elevation-5": "0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "md-xs": "4px",
        "md-sm": "8px",
        "md-md": "12px",
        "md-lg": "16px",
        "md-xl": "28px",
      },
    },
  },
  // Add safelist for our neutral theme classes to ensure they're included in the build
  safelist: [
    "elements-modal-neutral",
    "elements-modal-reset",
    "neutral-background",
    "neutral-card",
    "neutral-card-hover",
    "neutral-text",
    "neutral-text-light",
    "neutral-text-dark",
    "neutral-border",
    "neutral-active",
  ],
  plugins: [require("tailwindcss-animate")],
}

export default config
