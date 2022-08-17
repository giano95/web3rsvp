import { useTheme } from "next-themes"

export default function DarkmodeToggle() {
    const { theme, setTheme } = useTheme()

    function toggleTheme() {
        if (theme == "light") {
            setTheme("dark")
        } else if (theme == "dark") {
            setTheme("light")
        } else {
            console.log("ERROR: theme value unmatching: " + theme)
        }
    }

    return (
        <button
            onClick={toggleTheme}
            className={`${theme == "dark" ? "bg-[#111111]" : "bg-gray-200"}
          relative inline-flex h-[28px] w-[58px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
            <span
                aria-hidden="true"
                className={`${theme == "dark" ? "translate-x-[30px]" : "translate-x-0"}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white dark:bg-[#202428] shadow-lg ring-0 transition duration-200 ease-in-out`}
            >
                {/* Moon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-[24px] w-[24px] px-[3px] pb-[2px] ${theme == "dark" ? "hidden" : "inline-block"}`}
                    fill="#e5e7eb"
                    viewBox="0 0 24 24"
                    stroke="#e5e7eb"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                </svg>
                {/* Sun */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-[24px] w-[24px] px-[2px] pb-[2px] ${theme == "light" ? "hidden" : "inline-block"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#000000"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                </svg>
            </span>
        </button>
    )
}
