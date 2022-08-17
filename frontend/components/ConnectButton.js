import { ConnectButton } from "@rainbow-me/rainbowkit"
import DropdownMenu from "./DropdownMenu"

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
                                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:text-[#202428] text-white px-4 py-[10px] text-[15px] font-medium rounded-md mx-6 drop-shadow-lg hover:scale-105"
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
                                <div style={{ display: "flex", gap: 20 }}>
                                    <button
                                        onClick={openChainModal}
                                        style={{ display: "flex", alignItems: "center" }}
                                        type="button"
                                        className=" bg-gray-50 dark:bg-[#1A1B1F] text-black dark:text-white px-4 py-[9px] text-sm font-medium rounded-md drop-shadow-lg hover:scale-105"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                style={{
                                                    background: chain.iconBackground,
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: 999,
                                                    overflow: "hidden",
                                                    marginRight: 10,
                                                }}
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={chain.name ?? "Chain icon"}
                                                        src={chain.iconUrl}
                                                        style={{ width: 24, height: 24 }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {chain.name}
                                    </button>
                                    <button className="bg-gray-50 dark:bg-[#1A1B1F] text-black dark:text-white text-sm font-medium rounded-md drop-shadow-lg hover:scale-105">
                                        <a onClick={openAccountModal} className="px-4">
                                            {account.displayName}
                                        </a>
                                        {/* <a className="dark:text-[#202428] text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-[12px] rounded-md">
                                            <DropdownMenu menuButtonName={account.displayBalance} />
                                        </a> */}
                                        <DropdownMenu menuButtonName={account.displayBalance} />
                                    </button>
                                </div>
                            )
                        })()}
                    </div>
                )
            }}
        </ConnectButton.Custom>
    )
}
