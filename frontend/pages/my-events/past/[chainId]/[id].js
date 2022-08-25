import Head from "next/head"
import DashboardNav from "../../../../components/DashboardNav"
import { useState, useEffect } from "react"
import Link from "next/link"
import { gql } from "@apollo/client"
import client from "../../../../apollo-client"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi"
import connectContract from "../../../../utils/connectContract"
import formatTimestamp from "../../../../utils/formatTimestamp"
import Alert from "../../../../components/Alert"

function PastEvent({ event }) {
    const { isConnected, address: accountAddress } = useAccount()
    const { chain } = useNetwork()
    const { chains, switchNetworkAsync } = useSwitchNetwork()

    const [success, setSuccess] = useState(null)
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(null)
    const [mounted, setMounted] = useState(false)

    // Call the 'confirmAttendee' method of web3rsvp contract
    const confirmAttendee = async (attendee) => {
        console.log("confirmAttendee...")

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
                    const txn = await rsvpContract.confirmAttendee(event.id, attendee)
                    setLoading(true)
                    console.log("Minting...", txn.hash)

                    await txn.wait()
                    console.log("Minted -- ", txn.hash)
                    setSuccess(true)
                    setLoading(false)
                    setMessage("Attendance has been confirmed.")
                } else {
                    console.log("Ethereum object doesn't exist!")
                }
            } catch (error) {
                setSuccess(false)
                // setMessage(
                //   `Error: ${process.env.NEXT_PUBLIC_TESTNET_EXPLORER_URL}tx/${txn.hash}`
                // );
                setMessage("Error!")
                setLoading(false)
                console.log(error)
            }
        }
    }

    // Call the 'confirmAllAttendees' method of web3rsvp contract
    const confirmAllAttendees = async () => {
        console.log("confirmAllAttendees...")

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
                    console.log("contract exists")
                    const txn = await rsvpContract.confirmAllAttendees(event.id, {
                        gasLimit: 300000,
                    })
                    console.log("await txn")
                    setLoading(true)
                    console.log("Mining...", txn.hash)

                    await txn.wait()
                    console.log("Mined -- ", txn.hash)
                    setSuccess(true)
                    setLoading(false)
                    setMessage("All attendees confirmed successfully.")
                } else {
                    console.log("Ethereum object doesn't exist!")
                }
            } catch (error) {
                setSuccess(false)
                // setMessage(
                //   `Error: ${process.env.NEXT_PUBLIC_TESTNET_EXPLORER_URL}tx/${txn.hash}`
                // );
                setMessage("Error!")
                setLoading(false)
                console.log(error)
            }
        }
    }

    // Check if an attendee have already been confirmed
    function checkIfConfirmed(event, address) {
        for (let i = 0; i < event.confirmedAttendees.length; i++) {
            let confirmedAddress = event.confirmedAttendees[i].attendee.id
            if (confirmedAddress.toLowerCase() == address.toLowerCase()) {
                return true
            }
        }
        return false
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        mounted && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Head>
                    <title>My Dashboard | web3rsvp</title>
                    <meta name="description" content="Manage your events and RSVPs" />
                </Head>
                <div className="flex flex-wrap py-8">
                    <DashboardNav page={"events"} />
                    <div className="sm:w-10/12 sm:pl-8">
                        {loading && (
                            <Alert
                                alertType={"loading"}
                                alertBody={"Please wait"}
                                triggerAlert={true}
                                color={"white"}
                            />
                        )}
                        {success && (
                            <Alert alertType={"success"} alertBody={message} triggerAlert={true} color={"palegreen"} />
                        )}
                        {success === false && (
                            <Alert
                                alertType={"failed"}
                                alertBody={message}
                                triggerAlert={true}
                                color={"palevioletred"}
                            />
                        )}
                        {isConnected ? (
                            accountAddress.toLowerCase() === event.eventOwner.toLowerCase() ? (
                                <section>
                                    <Link href="/my-events/past">
                                        <a className="text-indigo-800 dark:text-indigo-400 text-sm hover:underline">
                                            &#8592; Back
                                        </a>
                                    </Link>
                                    <h6 className="text-sm text-gray-700 dark:text-gray-400 mt-4 mb-1">
                                        {formatTimestamp(event.eventTimestamp)}
                                    </h6>
                                    <h1 className="text-2xl tracking-tight font-extrabold text-gray-900 dark:text-gray-100 sm:text-3xl md:text-4xl mb-[2.5rem]">
                                        {event.name}
                                    </h1>
                                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                            <div className="overflow-hidden shadow ring-1 ring-black dark:ring-gray-500 ring-opacity-5 md:rounded-lg">
                                                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-500">
                                                    <thead className="bg-gray-50 dark:bg-[#1E2024] h-[72px]">
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-6"
                                                            >
                                                                Attendee
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="text-right py-3.5 pl-3 pr-4 sm:pr-6"
                                                            >
                                                                <button
                                                                    type="button"
                                                                    className="bg-white dark:bg-[#18191D] text-gray-900 dark:text-gray-200 px-[26px] py-2 text-sm font-normal rounded-md drop-shadow-md dark:drop-shadow-lg hover:scale-105"
                                                                    onClick={confirmAllAttendees}
                                                                >
                                                                    Confirm All
                                                                </button>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 bg-white dark:bg-[#202428] h-14">
                                                        {event.rsvps.map((rsvp) => (
                                                            <tr key={rsvp.attendee.id}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">
                                                                    {rsvp.attendee.id}
                                                                </td>
                                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                                    {checkIfConfirmed(event, rsvp.attendee.id) ? (
                                                                        <p>Confirmed</p>
                                                                    ) : (
                                                                        <button
                                                                            type="button"
                                                                            className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105"
                                                                            onClick={() =>
                                                                                confirmAttendee(rsvp.attendee.id)
                                                                            }
                                                                        >
                                                                            Confirm attendee
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            ) : (
                                <p>You do not have permission to manage this event.</p>
                            )
                        ) : (
                            <ConnectButton />
                        )}
                    </div>
                </div>
            </div>
        )
    )
}

export default PastEvent

export async function getServerSideProps(context) {
    const { id, chainId } = context.params

    const { data } = await client.query({
        query: gql`
            query Event($id: String!) {
                event(id: $id) {
                    id
                    eventID
                    name
                    eventOwner
                    eventTimestamp
                    maxCapacity
                    chainId
                    totalRSVPs
                    totalConfirmedAttendees
                    rsvps {
                        id
                        attendee {
                            id
                        }
                    }
                    confirmedAttendees {
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
