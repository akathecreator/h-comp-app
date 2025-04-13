/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"], // Ensure paths to all components
  presets: [require("nativewind/preset")], // Use NativeWind preset
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik-Regular", "sans-serif"],
        "rubik-bold": ["Rubik-Bold", "sans-serif"],
        "rubik-extrabold": ["Rubik-ExtraBold", "sans-serif"],
        "rubik-medium": ["Rubik-Medium", "sans-serif"],
        "rubik-semibold": ["Rubik-SemiBold", "sans-serif"],
        "rubik-light": ["Rubik-Light", "sans-serif"],
        sans: ["NotoSansThai-Regular", "sans-serif"],
        bold: ["NotoSansThai-Bold", "sans-serif"],
        medium: ["NotoSansThai-Medium", "sans-serif"],
        semibold: ["NotoSansThai-SemiBold", "sans-serif"],
        light: ["NotoSansThai-Light", "sans-serif"],
        extrabold: ["NotoSansThai-ExtraBold", "sans-serif"],
        black: ["NotoSansThai-Black", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#594715",
        },
        bone: {
          DEFAULT: "#594715", // Main bone color
          light: "#F4F2ED", // Lighter shade
          dark: "#D6D1C4", // Darker shade
        },
        black: {
          DEFAULT: "#1A1A1A", // Main black
          muted: "#666876", // Muted black for secondary text
          light: "#8C8E98", // Light gray-black
        },
        gray: {
          DEFAULT: "#B2B1A8", // Neutral accent
          light: "#D6D5CF", // Lighter gray
          dark: "#9A9992", // Darker gray
        },
        accent: {
          dustyBlue: "#6C757D", // For buttons/highlights
          taupe: "#D6CFC4", // Warm taupe for soft accents
          gold: "#C4A484", // Premium gold accent
        },
        blue: "#378ac4", // Neon Dark Blue
        danger: "#F75555", // Danger or error color
        success: "#4CAF50", // Optional success color
        neonBlue: "#0033FF", // Neon Dark Blue
        // newblue: "#4F46E5",
        newblue: "#594715",
        royalblue: "#261FB3",

        earthseaweed: "#594715",
        earthbrown: "#c2a968",

        earthspinach: "#847d3b",
      },
    },
  },
  plugins: [],
};
