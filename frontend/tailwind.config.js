/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui theme configuration bindings
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        
        // Modern Indian Educational & Healthcare Branding Palette
        brand: {
          red: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fca5a5',
            300: '#f87171',
            400: '#ef4444',
            500: '#C91D1D', // Primary Deep Red
            600: '#b91c1c',
            700: '#991b1b',
            800: '#7f1d1d',
            900: '#450a0a',
          },
          gold: {
            50: '#fefdf0',
            100: '#fdfbe1',
            200: '#faf4b5',
            300: '#f6eb85',
            400: '#f1dd4d',
            500: '#D4A017', // Primary Golden Yellow
            600: '#ca8a04',
            700: '#a16207',
            800: '#854d0e',
            900: '#713f12',
          },
          cream: {
            50: '#FFF8E7',  // Soft Cream #FFF8E7
            100: '#FFF8E7', // Standard Cream #FFF8E7
            200: '#F2ECE0', // Darker Cream/Muted
            350: '#E8E2D5',
          },
          dark: '#0F172A',  // Slate-900 for modern dark text
          light: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)',
        'gold-glow': '0 8px 24px -6px rgba(212, 160, 23, 0.15)',
        'red-glow': '0 8px 24px -6px rgba(201, 29, 29, 0.15)',
      },
      borderRadius: {
        'large': '1.5rem', // 24px
        'medium': '1rem', // 16px
        'small': '0.5rem', // 8px
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.border-gradient': {
          borderWidth: '2px',
          borderImageSlice: 1,
          borderImageSource: 'linear-gradient(135deg, var(--tw-gradient-stops))',
        },
      });
    },
  ],
};
