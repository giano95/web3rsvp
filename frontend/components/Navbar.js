import { useState, useEffect } from "react"
import Link from "next/link"
import { useAccount } from "wagmi"
import Connectbutton from "./ConnectButton"
import DarkmodeToggle from "./DarkmodeToggle"
import connectContract from "../utils/connectContract"

export default function Navbar() {
    const { isConnected } = useAccount()

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        mounted && (
            <header className="border-b-[1px] border-gray-200 dark:border-gray-700">
                <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
                    <div className="w-full py-6 flex flex-wrap items-center justify-between">
                        <div className="flex items-center justify-center">
                            {/* If small nothing when connected */}
                            {isConnected ? <></> : <DarkmodeToggle className="md:hidden" />}
                            {/* If big always */}
                            <DarkmodeToggle className="hidden md:block" />
                            <Link href="/">
                                <a
                                    onClick={connectContract()}
                                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 pl-4 md:pl-6 text-xl md:text-2xl align-middle tracking-tight font-extrabold text-transparent bg-clip-text"
                                >
                                    web3rsvp
                                </a>
                            </Link>
                        </div>
                        <div className="md:ml-10 flex items-center">
                            <Connectbutton />
                        </div>
                    </div>
                </nav>
            </header>
        )
    )
}
