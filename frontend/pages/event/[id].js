import { useState } from "react"
import Head from "next/head"
import Image from "next/image"
import { gql } from "@apollo/client"
import client from "../../apollo-client"
import { ethers } from "ethers"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import connectContract from "../../utils/connectContract"
import formatTimestamp from "../../utils/formatTimestamp"
import Alert from "../../components/Alert"
import { EmojiHappyIcon, TicketIcon, UsersIcon, LinkIcon } from "@heroicons/react/outline"

function Event({ event }) {
    const { isConnected, address: accountAddress } = useAccount()
    const [success, setSuccess] = useState(null)
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(null)
    const [currentTimestamp, setEventTimestamp] = useState(new Date().getTime())

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
        try {
            const rsvpContract = connectContract()
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

    return (
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
                {success && <Alert alertType={"success"} alertBody={message} triggerAlert={true} color={"palegreen"} />}
                {success === false && (
                    <Alert alertType={"failed"} alertBody={message} triggerAlert={true} color={"palevioletred"} />
                )}
                {/* Alerts */}

                <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl mb-1">
                    {event.name}
                </h1>
                <h6 className="mb-6 lg:mb-12">{formatTimestamp(event.eventTimestamp)}</h6>
                <div className="flex flex-wrap-reverse lg:flex-nowrap">
                    {/* Event Image */}
                    <div className="w-full pr-0 lg:pr-24 xl:pr-32">
                        <div className="mb-8 w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
                            {event.imageURL && <Image src={event.imageURL} alt="event image" layout="fill" />}
                        </div>
                        <p>{event.description}</p>
                    </div>
                    {/* Event Image */}

                    <div className="max-w-xs w-full flex flex-col gap-4 mb-6 lg:mb-0">
                        {/* Show the link to the event / Button to RSVP / Event ended */}
                        {event.eventTimestamp > currentTimestamp ? (
                            isConnected ? (
                                checkIfAlreadyRSVPed() ? (
                                    <>
                                        <span className="w-full text-center px-6 py-3 text-base font-medium rounded-full text-teal-800 bg-teal-100">
                                            You have RSVPed! 🙌
                                        </span>
                                        <div className="flex item-center">
                                            <LinkIcon className="w-6 mr-2 text-indigo-800" />
                                            <a className="text-indigo-800 truncate hover:underline" href={event.link}>
                                                {event.link}
                                            </a>
                                        </div>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        className="w-full items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={newRSVP}
                                    >
                                        RSVP for {ethers.utils.formatEther(event.deposit)} MATIC
                                    </button>
                                )
                            ) : (
                                <ConnectButton />
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
                        <div className="flex items-center">
                            <EmojiHappyIcon className="w-10 mr-2" />
                            <span className="truncate">
                                Hosted by{" "}
                                <a
                                    className="text-indigo-800 truncate hover:underline"
                                    href={`${process.env.NEXT_PUBLIC_TESTNET_EXPLORER_URL}address/${event.eventOwner}`}
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
}

export default Event

export async function getServerSideProps(context) {
    const { id } = context.params

    const { data } = await client.query({
        query: gql`
            query Event($id: String!) {
                event(id: $id) {
                    id
                    eventID
                    name
                    description
                    link
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
    })

    return {
        props: {
            event: data.event,
        },
    }
}