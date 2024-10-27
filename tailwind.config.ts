import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#458588", // Example color: dark blue
        secondary: "#ebdbb2", // Example color: orange
        background: "#79740e",
        accent: "#d79921", // Example color: green
        neutral: "#282828",
        danger: "#fb4934", // Example color: dark gray
      },
    },
  },
  plugins: [require("daisyui")],
};
export default config;
