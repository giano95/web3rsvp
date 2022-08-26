import { Menu, Transition } from "@headlessui/react"
import { forwardRef, Fragment, useEffect, useRef, useState } from "react"
import { ChevronDownIcon } from "@heroicons/react/solid"
import { useAccount } from "wagmi"
import { useTheme } from "next-themes"
import Link from "next/link"

export default function DropdownMenu({ menuButtonName }) {
    const { theme, setTheme, resolvedTheme } = useTheme()

    return (
        <Menu as="div" className="relative inline-block">
            <Menu.Button className="px-3 md:px-4 py-[12px] dark:text-[#202428] text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-md">
                {menuButtonName}
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 w-56 origin-top-right bg-gray-50 dark:bg-[#1A1B1F] divide-y divide-gray-100 dark:divide-gray-700 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <MyLink
                                    href="/my-rsvps/upcoming"
                                    className={`${
                                        active
                                            ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white dark:text-gray-900"
                                            : "text-[#1A1B1F] dark:text-white"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                    {active ? (
                                        <MyRSVPsActiveIcon
                                            className="mr-2 h-5 w-5"
                                            aria-hidden="true"
                                            stroke={`${resolvedTheme == "dark" ? "#1A1B1F" : "#ffffff"}`}
                                        />
                                    ) : (
                                        <MyRSVPsInactiveIcon
                                            className="mr-2 h-5 w-5"
                                            aria-hidden="true"
                                            stroke="#6366f1"
                                        />
                                    )}
                                    My RSVPs
                                </MyLink>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <MyLink
                                    href={`/my-events/upcoming`}
                                    className={`${
                                        active
                                            ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white dark:text-gray-900"
                                            : "text-[#1A1B1F] dark:text-white"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                    {active ? (
                                        <MyEventsActiveIcon
                                            className="mr-2 h-5 w-5"
                                            aria-hidden="true"
                                            stroke={`${resolvedTheme == "dark" ? "#1A1B1F" : "#ffffff"}`}
                                        />
                                    ) : (
                                        <MyEventsInactiveIcon
                                            className="mr-2 h-5 w-5"
                                            aria-hidden="true"
                                            stroke="#6366f1"
                                        />
                                    )}
                                    My Events
                                </MyLink>
                            )}
                        </Menu.Item>
                    </div>

                    <div className="px-1 py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <MyLink
                                    href="/create-event"
                                    className={`${
                                        active
                                            ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white dark:text-gray-900"
                                            : "text-[#1A1B1F] dark:text-white"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                    {active ? (
                                        <AddEventActiveIcon
                                            className="mr-2 h-5 w-5 text-violet-400"
                                            aria-hidden="true"
                                            stroke={`${resolvedTheme == "dark" ? "#1A1B1F" : "#ffffff"}`}
                                        />
                                    ) : (
                                        <AddEventInactiveIcon
                                            className="mr-2 h-5 w-5 text-violet-400"
                                            aria-hidden="true"
                                            stroke="#6366f1"
                                        />
                                    )}
                                    Create Event
                                </MyLink>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

const MyLink = forwardRef((props, ref) => {
    let { href, active, resolvedTheme, children, ...rest } = props
    return (
        <Link href={href}>
            <a ref={ref} {...rest}>
                {children}
            </a>
        </Link>
    )
})

function MyRSVPsInactiveIcon(props) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function MyRSVPsActiveIcon(props) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function MyEventsInactiveIcon(props) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                strokeWidth="2"
            />
        </svg>
    )
}

function MyEventsActiveIcon(props) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                strokeWidth="2"
            />
        </svg>
    )
}

function AddEventInactiveIcon(props) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" strokeWidth="2" />
        </svg>
    )
}

function AddEventActiveIcon(props) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" strokeWidth="2" />
        </svg>
    )
}
