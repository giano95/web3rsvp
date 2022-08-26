import { ConnectButton } from "@rainbow-me/rainbowkit"
import DropdownMenu from "./DropdownMenu"
import Image from "next/image"

export default function Connectbutton() {
    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                return (
                    <div
                        className="font-serif"
                        {...(!mounted && {
                            "aria-hidden": true,
                            style: {
                                opacity: 0,
                                pointerEvents: "none",
                                userSelect: "none",
                            },
                        })}
                    >
                        {(() => {
                            if (!mounted || !account || !chain) {
                                return (
                                    <button
                                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:text-[#202428] text-white px-4 py-[10px] text-sm lg:text-[15px] font-medium rounded-md drop-shadow-lg hover:scale-105"
                                        onClick={openConnectModal}
                                        type="button"
                                    >
                                        Connect Wallet
                                    </button>
                                )
                            }
                            if (chain.unsupported) {
                                return (
                                    <button onClick={openChainModal} type="button">
                                        Wrong network
                                    </button>
                                )
                            }
                            return (
                                <div className="flex gap-2 md:gap-5 h-[44px]">
                                    <button
                                        onClick={openChainModal}
                                        type="button"
                                        className="flex items-center bg-gray-50 dark:bg-[#1A1B1F] text-black dark:text-white px-3 md:px-4 py-[9px] text-xs md:text-sm font-normal md:font-medium rounded-md drop-shadow-lg hover:scale-105"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background: chain.iconBackground,
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: 999,
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <Image
                                                        src={chain.iconUrl}
                                                        alt={chain.name ?? "Chain icon"}
                                                        layout="fixed"
                                                        width={24}
                                                        height={24}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        <span className="hidden md:block md:ml-3">{chain.name}</span>
                                    </button>
                                    <div className="bg-gray-50 dark:bg-[#1A1B1F] text-black dark:text-white text-xs md:text-sm font-normal md:font-medium rounded-md drop-shadow-lg hover:scale-105">
                                        <button onClick={openAccountModal} className="md:px-3 px-4 py-[12px]">
                                            {account.displayName}
                                        </button>

                                        <DropdownMenu menuButtonName={account.displayBalance} />
                                    </div>
                                </div>
                            )
                        })()}
                    </div>
                )
            }}
        </ConnectButton.Custom>
    )
}
