import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          dark: "#111827",
          purple: "#8B5CF6",
          lightPurple: "#EDE4FB",
          accentPurple: "#C4B5FD",
          bgLight: "#F9FAFB",
        },
      },
      keyframes: {
        slideup: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        slideup: "slideup 0.28s ease-out",
        fadeIn: "fadeIn 0.2s ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
