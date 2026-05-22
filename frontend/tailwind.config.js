export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        primaryHover: "#4338CA",

        beige: "#F8FAFC",
        dark: "#0F172A",

        surface: {
          light: "#FFFFFF",
          dark: "#1E293B",
        },
      },

      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};