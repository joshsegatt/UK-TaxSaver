import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                mono: ['var(--font-jetbrains-mono)', 'monospace'],
            },
            colors: {
                apple: {
                    grey: '#F5F5F7',
                    dark: '#1D1D1F',
                },
                carbon: {
                    black: '#0A0A0A',
                    dark: '#121212',
                },
                luxury: {
                    gold: '#FFD700',
                }
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out 3s infinite',
                'bar-grow': 'barGrow 3s ease-in-out infinite',
                'bar-grow-delayed': 'barGrow 3s ease-in-out 1.5s infinite',
                'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                barGrow: {
                    '0%': { height: '10%' },
                    '50%': { height: '100%' },
                    '100%': { height: '10%' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
                    '50%': { opacity: '1', transform: 'scale(1.05)' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
