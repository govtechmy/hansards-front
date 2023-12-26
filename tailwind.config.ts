import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: "class",
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './charts/**/*.{js,ts,jsx,tsx,mdx}',
    './data-catalogue/**/*.{js,ts,jsx,tsx}',
    './dashboards/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(59.1% 166.02% at 50% -66.02%, var(--tw-gradient-stops))'
      },
      spacing: {
        4.5: "18px",
      },
      fontFamily: {
        sans: ["var(--font-body)", ...fontFamily.sans],
        body: ["var(--font-body)", ...fontFamily.sans],
        header: ["var(--font-header)"],
      },
      colors: {
        "primary": "#2563EB", // Blue 600
        "primary-dark": "#3E7AFF",
        "secondary": "#B49B1A",
        "black": "#18181B", // Zinc 900
        "success": "#10B981", // Emerald 500
        "danger": "#DC2626", // Red 600
        "warning": "#FBBF24", // Amber 400
        "dim": "#71717A", // Zinc 500
        "washed": "#F1F5F9", // Slate 100
        "washed-dark": "#27272A", // Zinc 800
        "outline": "#E2E8F0", // Slate 200
        "outlineHover": "#94A3B8", // Slate 400
        "outlineHover-dark": "#3F3F46", // Zinc 700
        "background": "#F8FAFC", // Slate 50
        "background-dark": "#121212",
        "purple": "#7C3AED", // Violet 600
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        // background: "hsl(var(--background))",
        // primary: {
        //   DEFAULT: "hsl(var(--primary))",
        //   foreground: "hsl(var(--primary-foreground))",
        // },
        // secondary: {
        //   DEFAULT: "hsl(var(--secondary))",
        //   foreground: "hsl(var(--secondary-foreground))",
        // },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      boxShadow: {
        button: "0 1px 2px rgba(0, 0, 0, 0.1)",
        floating: "0 6px 24px rgba(0, 0, 0, 0.1)",
      },
      keyframes: {
        slide: {
          from: { width: "var(--from-width)" },
          to: { width: "var(--to-width)" },
        },
        grow: {
          from: { height: "var(--from-height)" },
          to: { height: "var(--to-height)" },
        },
        appear: {
          "0%": {
            visibility: "hidden",
          },
          "100%": {
            visibility: "visible",
          },
        },
      },
      animation: {
        appear: "appear 200ms ease-out",
        slide: "slide 1.5s ease-out",
      },
    },
  },
  plugins: [],
}
export default config
