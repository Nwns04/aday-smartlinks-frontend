/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Supreme"', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          '"Segoe UI"', 
          'Roboto', 
          'Oxygen',
          'Ubuntu', 
          'Cantarell', 
          '"Open Sans"', 
          '"Helvetica Neue"', 
          'sans-serif'
        ],
        display: ['"Supreme"', 'sans-serif'],
        mono: [
          '"Source Code Pro"', 
          'Menlo', 
          'Monaco', 
          'Consolas', 
          '"Courier New"', 
          'monospace'
        ]
      },
      colors: {
        primary: {
          light: '#3b82f6',
          dark: '#60a5fa'
        },
        secondary: {
          light: '#8b5cf6',
          dark: '#a78bfa'
        }
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color, fill, stroke',
        'spacing': 'margin, padding',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
      
    },
  },
  plugins: [], // Removed the plugins
};