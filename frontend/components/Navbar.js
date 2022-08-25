import { useState, useEffect } from "react"
import Link from "next/link"
import Navmenu from "./Navmenu"
import { useAccount, useDisconnect } from "wagmi"
import Connectbutton from "./ConnectButton"
import DarkmodeToggle from "./DarkModeToggle"
import connectContract from "../utils/connectContract"

export default function Navbar() {
    const { isConnected, address: accountAddress } = useAccount()
    const { disconnect } = useDisconnect()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        mounted && (
            <header className="border-b-[1px] border-gray-200 dark:border-gray-700">
                <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
                    <div className="w-full py-6 flex flex-wrap items-center justify-between border-b border-indigo-500 lg:border-none">
                        <div className="flex items-center">
                            <DarkmodeToggle />
                            <Link href="/">
                                <a
                                    onClick={connectContract()}
                                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 pl-6 text-2xl align-middle tracking-tight font-extrabold text-transparent bg-clip-text"
                                >
                                    web3rsvp
                                </a>
                            </Link>
                        </div>
                        <div className="ml-10 space-x-4 flex items-center">
                            <Connectbutton />
                        </div>
                    </div>
                </nav>
            </header>
        )
    )
}
