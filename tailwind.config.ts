import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // fontFamily: {
      //   mono: ["var(--font-mono)"],
      //   mr: ["var(--font-mr)"],
      // },
      colors: {
        primary: "#b80000",
        // primary: {
        //   100: "#7a1d1d",
        //   500: "#741b1b",
        //   900: "#5a0e0e",
        // },
        // secondary: "#ffdb4d",
        // dark: "#1b1b1b",
        // light: "#fff",
        // accent: "#0070f0",
        // accentDark: "#ffdb4d",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui(),
    // require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};