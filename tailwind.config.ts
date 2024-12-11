import type { Config } from "tailwindcss";

const primary = {
  200: "#2b4b73",
  400: "#1c2b3d",
  500: "#0a1420",
  600: "#07101a",
  700: "#050b11",
  800: "#030609",
}

const gold = {
  100: '#FFEA00',
  200: '#FFDB00',
  300: '#FFCC00',
  400: '#FFBF00',
  500: '#FFB300',
  600: '#FFA600',
  700: '#FF9900',
  800: '#FF8C00',
  900: '#FF7F00',
  DEFAULT: '#FFD700',
}
const config: Config = {

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary, gold
      },
      fontFamily: {
        nunito: ['var(--font-nunito)']
      }
    },
  },
  plugins: [],
};
export default config;
