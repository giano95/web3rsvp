import { useState, useEffect } from "react"
import Head from "next/head"
import Image from "next/image"
import { gql } from "@apollo/client"
import client from "../../../apollo-client"
import { ethers } from "ethers"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useSwitchNetwork, useNetwork } from "wagmi"
import connectContract from "../../../utils/connectContract"
import formatTimestamp from "../../../utils/formatTimestamp"
import Alert from "../../../components/Alert"
import { EmojiHappyIcon, TicketIcon, UsersIcon, LinkIcon } from "@heroicons/react/outline"
import { useConnectModal } from "@rainbow-me/rainbowkit"

function Event({ event }) {
    const { isConnected, address: accountAddress } = useAccount()
    const { openConnectModal } = useConnectModal()
    const { chains, switchNetworkAsync } = useSwitchNetwork()
    const { chain } = useNetwork()
    const [success, setSuccess] = useState(null)
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(null)
    const [currentTimestamp, setEventTimestamp] = useState(new Date().getTime())
    const [mounted, setMounted] = useState(false)

    // Check whether the user has already RSVP’d or not
    function checkIfAlreadyRSVPed() {
        if (isConnected) {
            for (let i = 0; i < event.rsvps.length; i++) {
                const thisAccount = accountAddress.toLowerCase()
                if (event.rsvps[i].attendee.id.toLowerCase() == thisAccount) {
                    return true
                }
            }
        }
        return false
    }

    // Call the createNewRSVP method from our contract, pass in the event id and the deposit amount (as the transaction value)
    const newRSVP = async () => {
        console.log("newRSVP...")

        if (chain) {
            const targetChain = chains.filter((x) => x.id == event.chainId)[0]

            // Switch network if the chain of the event is different from the current chain
            if (event.chainId != chain.id && targetChain) {
                await switchNetworkAsync(targetChain.id)
                console.log("network switched")
            }

            try {
                const rsvpContract = await connectContract()

                if (rsvpContract) {
                    const txn = await rsvpContract.createNewRSVP(event.id, {
                        value: event.deposit,
                        gasLimit: 300000,
                    })
                    setLoading(true)
                    console.log("Minting...", txn.hash)

                    await txn.wait()
                    console.log("Minted -- ", txn.hash)
                    setSuccess(true)
                    setLoading(false)
                    setMessage("Your RSVP has been created successfully.")
                } else {
                    console.log("Error getting contract.")
                }
            } catch (error) {
                setSuccess(false)
                setMessage("Error!")
                setLoading(false)
                console.log(error)
            }
        }
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        mounted && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Head>
                    <title> {event.name} | web3rsvp</title>
                    <meta name="description" content={event.name} />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <section className="relative py-12">
                    {/* Alerts */}
                    {loading && (
                        <Alert alertType={"loading"} alertBody={"Please wait"} triggerAlert={true} color={"white"} />
                    )}
                    {success && (
                        <Alert alertType={"success"} alertBody={message} triggerAlert={true} color={"palegreen"} />
                    )}
                    {success === false && (
                        <Alert alertType={"failed"} alertBody={message} triggerAlert={true} color={"palevioletred"} />
                    )}
                    {/* Alerts */}

                    <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl mb-1">
                        {event.name}
                    </h1>
                    <h6 className="mb-6 lg:mb-12 text-gray-700 dark:text-gray-300">
                        {formatTimestamp(event.eventTimestamp)}
                    </h6>
                    <div className="flex flex-wrap-reverse lg:flex-nowrap">
                        {/* Event Image */}
                        <div className="w-full pr-0 lg:pr-24 xl:pr-32">
                            <div className="mb-8 w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
                                {event.imageURL && (
                                    <Image src={event.imageURL} alt="event image" layout="fill" priority={true} />
                                )}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{event.description}</p>
                        </div>
                        {/* Event Image */}

                        <div className="max-w-xs w-full flex flex-col gap-4 mb-6 lg:mb-0">
                            {/* Show the link to the event / Button to RSVP / Event ended */}
                            {event.eventTimestamp > currentTimestamp ? (
                                isConnected ? (
                                    checkIfAlreadyRSVPed() ? (
                                        <a
                                            className="w-full bg-gray-50 dark:bg-[#1A1B1F] text-black dark:text-white text-center py-3 rounded-md drop-shadow-lg hover:scale-105 mb-3 mt-2"
                                            href={event.link}
                                        >
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 truncate hover:underline">
                                                Attend the Event
                                            </span>
                                        </a>
                                    ) : (
                                        <button
                                            onClick={newRSVP}
                                            className="w-full bg-gray-50 dark:bg-[#1A1B1F] text-black dark:text-white text-center py-3 rounded-md drop-shadow-lg hover:scale-105 mb-3 mt-2 focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                                                RSVP for {ethers.utils.formatEther(event.deposit)}{" "}
                                                {event.chainId == 4 ? "ETH" : "MATIC"}
                                            </span>
                                        </button>
                                    )
                                ) : (
                                    <button
                                        onClick={openConnectModal}
                                        className="w-full bg-gray-50 dark:bg-[#1A1B1F] text-black dark:text-white text-center py-3 rounded-md drop-shadow-lg hover:scale-105 mb-3 mt-2 focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                                            Connect your wallet for RSVP
                                        </span>
                                    </button>
                                )
                            ) : (
                                <span className="w-full text-center px-6 py-3 text-base font-medium rounded-full border-2 border-gray-200">
                                    Event has ended
                                </span>
                            )}
                            {/* Show the link to the event / Button to RSVP / Event ended */}

                            {/* Event Info */}
                            <div className="flex item-center">
                                <UsersIcon className="w-6 mr-2" />
                                <span className="truncate">
                                    {event.totalRSVPs}/{event.maxCapacity} attending
                                </span>
                            </div>
                            <div className="flex item-center">
                                <TicketIcon className="w-6 mr-2" />
                                <span className="truncate">1 RSVP per wallet</span>
                            </div>
                            <div className="flex item-center">
                                <LinkIcon className="w-6 mr-2" />
                                <span className="truncate">
                                    Deployed on {event.chainId == 4 ? "Rinkeby" : "Mumbai"} chain
                                </span>
                            </div>
                            <div className="flex items-center">
                                <EmojiHappyIcon className="w-10 mr-2" />

                                <span className="truncate text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                                    <span className="text-black dark:text-white">Hosted by </span>

                                    <a
                                        className="truncate hover:underline"
                                        href={
                                            (event.chainId == 4
                                                ? process.env.NEXT_PUBLIC_RINKEBY_ETHERSCAN_URL
                                                : process.env.NEXT_PUBLIC_MUMBAI_POLYGONSCAN_URL) +
                                            "address/" +
                                            event.eventOwner
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {event.eventOwner}
                                    </a>
                                </span>
                            </div>
                            {/* Event Info */}
                        </div>
                    </div>
                </section>
            </div>
        )
    )
}

export default Event

export async function getServerSideProps(context) {
    const { id, chainId } = context.params

    const { data } = await client.query({
        query: gql`
            query Event($id: String!) {
                event(id: $id) {
                    id
                    eventID
                    name
                    description
                    link
                    chainId
                    eventOwner
                    eventTimestamp
                    maxCapacity
                    deposit
                    totalRSVPs
                    totalConfirmedAttendees
                    imageURL
                    rsvps {
                        id
                        attendee {
                            id
                        }
                    }
                }
            }
        `,
        variables: {
            id: id,
        },
        context: { isRinkeby: chainId == 4 },
        fetchPolicy: "no-cache",
    })

    return {
        props: {
            event: data.event,
        },
    }
}
