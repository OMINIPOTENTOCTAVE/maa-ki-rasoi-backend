/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            fontFamily: {
                heading: ['Fraunces', 'serif'],
                body: ['DM Sans', 'sans-serif'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            colors: {
                background: '#F8F7F5',
                foreground: '#2D2418',
                card: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#2D2418'
                },
                popover: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#2D2418'
                },
                primary: {
                    DEFAULT: '#C8550A',
                    foreground: '#FFFFFF'
                },
                secondary: {
                    DEFAULT: '#F4E4BC',
                    foreground: '#2D2418'
                },
                muted: {
                    DEFAULT: '#F4E4BC',
                    foreground: '#6B5D4D'
                },
                accent: {
                    DEFAULT: '#E8A87C',
                    foreground: '#2D2418'
                },
                destructive: {
                    DEFAULT: '#EF4444',
                    foreground: '#FFFFFF'
                },
                success: {
                    DEFAULT: '#4F772D',
                    foreground: '#FFFFFF'
                },
                border: '#E5E0D8',
                input: '#E5E0D8',
                ring: '#C8550A',
                chart: {
                    '1': '#C8550A',
                    '2': '#E8A87C',
                    '3': '#4F772D',
                    '4': '#F4E4BC',
                    '5': '#2D2418'
                }
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                'slide-up': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                'slide-up': 'slide-up 0.6s ease-out',
                'float': 'float 3s ease-in-out infinite'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
};
