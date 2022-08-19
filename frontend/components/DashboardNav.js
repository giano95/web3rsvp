import joinClassNames from "../utils/joinClassNames"

export default function DashboardNav({ page }) {
    let navigation = [
        {
            name: "My Events",
            href: `/my-events/upcoming`,
            current: page == "events",
        },
        {
            name: "My RSVPs",
            href: `/my-rsvps/upcoming`,
            current: page == "rsvps",
        },
    ]

    return (
        <nav className="space-y-1 w-60 mb-8 sm:w-2/12" aria-label="Sidebar">
            {navigation.map((item) => (
                <a
                    key={item.name}
                    href={item.href}
                    className={joinClassNames(
                        item.current
                            ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white dark:text-[#202428]"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-[#1a1d21] dark:hover:text-gray-300",
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md"
                    )}
                    aria-current={item.current ? "page" : undefined}
                >
                    <span className="truncate">{item.name}</span>
                </a>
            ))}
        </nav>
    )
}
