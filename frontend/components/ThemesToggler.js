import { useTheme } from "next-themes"

export default function ThemesToggler() {
    const { theme, setTheme } = useTheme()

    function toggleTheme() {
        if (theme == "light") {
            setTheme("dark")
        } else if (theme == "dark") {
            setTheme("light")
        } else {
            console.log("ERROR: theme value unmatching: " + theme)
        }
        console.log(document.documentElement.classList.contains("dark"))
    }

    return (
        <div className="w-16 h-[28px]">
            <a
                className="w-full h-full bg-gray-200 dark:bg-[#111111] rounded-full flex justify-between cursor-pointer"
                onClick={toggleTheme}
            >
                {/* Sun */}
                <span className="m-[2px] hidden dark:inline">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-[24px] w-[24px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                </span>
                {/* Sun */}
                {/* Circle */}
                <span className="m-[2px] w-[24px] h-[24px] rounded-full bg-white dark:bg-[#202428] block float-left dark:float-right transition duration-400 ease-in-out"></span>
                {/* Circle */}
                {/* Moon */}
                <span className="m-[2px] inline dark:hidden">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-[24px] w-[24px]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                    </svg>
                </span>
                {/* Moon */}
                {/* Circle */}
            </a>
        </div>
    )
}
