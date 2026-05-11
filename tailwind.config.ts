import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tryka: {
          green: "#06e38b",
          "green-dark": "#00502a",
          navy: "#171F38",
          "navy-light": "#1e2a4a",
          blue: "#2F60FF",
        },
      },
    },
  },
  plugins: [],
};

export default config;
