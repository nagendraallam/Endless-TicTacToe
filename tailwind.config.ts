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
        primary: "#1E3A8A", // Example color: dark blue
        secondary: "#D97706", // Example color: orange
        background: "#071A1D",
        accent: "#16A34A", // Example color: green
        neutral: "#3D4451", // Example color: dark gray
      },
    },
  },
  plugins: [require("daisyui")],
};
export default config;
