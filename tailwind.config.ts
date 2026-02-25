import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary-color)",
          hover: "var(--primary-hover)",
        },
        secondary: "var(--secondary-color)",
        "bg-page": "var(--bg-color)",
        "text-body": "var(--text-color)",
        "text-muted": "var(--text-muted)",
        border: {
          DEFAULT: "var(--border-color)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
