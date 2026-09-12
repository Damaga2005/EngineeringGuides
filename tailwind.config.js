/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Apple system-gray dark palette (true neutrals, no blue tint) in
        // place of Tailwind's default blue-tinted `slate` scale. Every
        // existing bg-slate-*/text-slate-*/border-slate-* class in the app
        // repaints through this single mapping.
        slate: {
          50: '#FAFAFA',
          100: '#F5F5F7',
          200: '#E5E5EA',
          300: '#C7C7CC',
          400: '#8E8E93',
          500: '#636366',
          600: '#48484A',
          700: '#3A3A3C',
          800: '#2C2C2E',
          900: '#1C1C1E',
          950: '#0A0A0A',
        },
        // Apple System Blue (dark-mode value #0A84FF) in place of Tailwind's
        // default `cyan`, so every accent already written as cyan-* repaints
        // to a single restrained system-blue scale instead of a neon teal.
        cyan: {
          50: '#EAF3FF',
          100: '#D6E8FF',
          200: '#ADD1FF',
          300: '#7BB4FF',
          400: '#409CFF',
          500: '#0A84FF',
          600: '#086CD9',
          700: '#0A5BB0',
          800: '#0D4A8A',
          900: '#0F3A6B',
          950: '#0A2544',
        },
        engineering: {
          dark: '#000000',
          card: '#1C1C1E',
          border: '#2C2C2E',
          accent: '#0A84FF',
          subtle: '#8E8E93'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
