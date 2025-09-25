import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "neon-cyan": "#00d4ff",
        "neon-pink": "#ff006e",
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0, 212, 255, 0.5)",
        "neon-pink": "0 0 20px rgba(255, 0, 110, 0.5)",
        'glass': '0 8px 40px rgba(0, 0, 0, 0.35)',
        'neon-border': '0 0 0 1px rgba(0,245,255,0.35) inset, 0 0 12px rgba(0,245,255,0.35), 0 0 28px rgba(255,0,230,0.25)',
        'neon-glow': '0 0 12px rgba(0,245,255,0.35)',
        'neon-hover': '0 0 24px 6px rgba(0,245,255,0.25)',
        'cyan-500/20': '0 0 20px rgb(6 182 212 / 0.2)',
        'cyan-400/30': '0 0 30px rgb(34 211 238 / 0.3)',
      },
      backdropBlur: {
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      backgroundColor: {
        'slate-800/10': 'rgb(30 41 59 / 0.1)',
        'slate-800/50': 'rgb(30 41 59 / 0.5)',
        'slate-900/50': 'rgb(15 23 42 / 0.5)',
        'cyan-900/30': 'rgb(22 78 99 / 0.3)',
        'cyan-800/40': 'rgb(21 94 117 / 0.4)',
        'slate-700/50': 'rgb(51 65 85 / 0.5)',
        'white/5': 'rgba(255, 255, 255, 0.05)',
        'white/10': 'rgba(255, 255, 255, 0.1)',
        'white/20': 'rgba(255, 255, 255, 0.2)',
        'cyan-500/20': 'rgba(6, 182, 212, 0.2)',
        'cyan-500/30': 'rgba(6, 182, 212, 0.3)',
      },
      borderColor: {
        'white/20': 'rgba(255, 255, 255, 0.2)',
        'white/30': 'rgba(255, 255, 255, 0.3)',
        'cyan-400/30': 'rgba(34, 211, 238, 0.3)',
        'cyan-400/50': 'rgba(34, 211, 238, 0.5)',
        'slate-700': 'rgb(51, 65, 85)',
        'slate-600': 'rgb(71, 85, 105)',
      },
      borderOpacity: {
        '50': '0.5',
        '30': '0.3',
      }
    },
  },
  plugins: [],
};

export default config;
