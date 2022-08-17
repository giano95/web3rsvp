const defaultTheme = require("tailwindcss/defaultTheme")
module.exports = {
    darkMode: "class",
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                serif: ["Space Grotesk", ...defaultTheme.fontFamily.serif],
            },
            boxShadow: {
                "3xl": "0 2px 18px -5px rgba(0, 0, 0, 0.3)",
            },
        },
    },
    variants: {},
    plugins: [require("@tailwindcss/aspect-ratio"), require("@tailwindcss/forms")],
}
