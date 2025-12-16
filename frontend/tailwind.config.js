/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './forms/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'], // optional: make it your default
      },
      colors: {
        primary: {
          DEFAULT: '#2EEC84',  // bright green
        },
        error: {
          DEFAULT: '#F25C5C',  // red
        },
        background: {
          DEFAULT: '#093545',  // deep navy teal
        },
        input: {
          DEFAULT: '#184A5A',  // muted teal
        },
        card: {
          DEFAULT: '#092C39',  // dark card color
        },
        screen: {
          DEFAULT: '#060E23',  // full app background
        },
        text: {
          DEFAULT: '#FFFFFF',
          secondary: '#C4C4C4',
        },
      },

      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
