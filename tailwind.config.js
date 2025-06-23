/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}", // add if you have an `app/` dir outside src
  "./components/**/*.{js,ts,jsx,tsx,mdx}", // add if you have a `components/` dir outside src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
