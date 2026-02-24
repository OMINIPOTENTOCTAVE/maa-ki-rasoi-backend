/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                brand: {
                    saffron: '#C8550A',
                    'saffron-dark': '#A03F05',
                    'saffron-light': '#E8712A',
                    cream: '#F9F4EE',
                    'warm-white': '#FDF9F5',
                    dark: '#1A1008',
                    green: '#2E7D4F',
                    'green-bg': '#EBF5EE',
                    error: '#C0392B',
                    warning: '#E67E22',
                },
            },
            fontFamily: {
                "heading": ["'Fraunces'", "Georgia", "serif"],
                "body": ["'DM Sans'", "system-ui", "sans-serif"],
            },
            borderRadius: {
                'tiffin': '2rem',
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "2xl": "2rem",
                "full": "9999px"
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries')
    ],
}
