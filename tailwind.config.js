/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B132B',
          dark: '#060A1A',
        },
        secondary: {
          DEFAULT: '#1C2541',
          light: '#2A3555',
        },
        accent: {
          DEFAULT: '#5BC0BE',
          light: '#7ED4D2',
          dark: '#3FA09E',
        },
        background: {
          light: '#F5F6FA',
          dark: '#222831',
          card: '#FFFFFF',
          'card-dark': '#2D3748',
        },
        text: {
          light: '#F5F5F5',
          dark: '#1A202C',
          muted: '#9CA3AF',
        },
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(91, 192, 190, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
