module.exports = {
  mode: "jit",
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html", 
    "./src/**/*.{js,jsx,ts,tsx,vue}"
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        amazon_blue: {
          light: "#232F3E",
          DEFAULT: "#131921",
        },
        wendge: {
          DEFAULT: "#5d3c4af9"
        }
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [    
    require("@tailwindcss/line-clamp")],
};
