import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      scale: {
        99: "0.99",
        98: "0.98",
        97: "0.97",
        96: "0.96",
        95: "0.95",
        94: "0.94",
        93: "0.93",
        92: "0.92",
        91: "0.91",
      },
      boxShadow: {
        "inner-2xl": "inset 0 0 20px 0 rgba(0, 0, 0, 0.1)",
        "inner-xl": "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
        "inner-lg": "inset 0 0 5px 0 rgba(0, 0, 0, 0.1)",
        "inner-md": "inset 0 0 2px 0 rgba(0, 0, 0, 0.1)",
        "inner-sm": "inset 0 0 2px 0 rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
