/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#0a0a0f",
          800: "#12121a",
          700: "#1a1a24",
        },
        neon: {
          blue: "#00f7ff",
          purple: "#bd00ff",
          pink: "#ff00c8",
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'futuristic-bg': "radial-gradient(circle at 50% -20%, #1a1a24 0%, #0a0a0f 100%)",
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 247, 255, 0.5)',
      }
    },
  },
  plugins: [],
};