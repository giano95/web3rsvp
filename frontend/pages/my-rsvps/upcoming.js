import Dashboard from "../../components/Dashboard"
import { useState, useEffect } from "react"
import { gql, useQuery, refet } from "@apollo/client"
import { useAccount, useNetwork } from "wagmi"
import EventCard from "../../components/EventCard"
import { useConnectModal } from "@rainbow-me/rainbowkit"

// gql query to fetch all of the rsvps for the user's account
const MY_RSVPS = gql`
    query Account($id: String) {
        account(id: $id) {
            id
            rsvps {
                event {
                    id
                    name
                    eventTimestamp
                    imageURL
                    chainId
                }
            }
        }
    }
`

export default function MyUpcomingRSVPs() {
    const { isConnected, address: accountAddress } = useAccount()
    const { chain } = useNetwork()
    const { openConnectModal } = useConnectModal()

    const id = isConnected ? accountAddress.toLowerCase() : ""
    const [currentTimestamp, setEventTimestamp] = useState(new Date().getTime())
    const { loading, error, data, refetch } = useQuery(MY_RSVPS, {
        variables: { id },
        context: { isRinkeby: chain?.id == 4 },
    })

    const upcomingRSVPs = data?.account?.rsvps.filter((rsvp) => rsvp.event.eventTimestamp > currentTimestamp)

    useEffect(() => {
        if (chain) {
            console.log(chain.id)
            refetch()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chain])

    if (loading)
        return (
            <Dashboard page="rsvps" isUpcoming={true}>
                <p>Loading...</p>
            </Dashboard>
        )
    if (error)
        return (
            <Dashboard page="rsvps" isUpcoming={true}>
                <p>{`Error! ${error.message}`}</p>
            </Dashboard>
        )

    return (
        <Dashboard page="rsvps" isUpcoming={true}>
            {isConnected ? (
                <div>
                    {!upcomingRSVPs && <p>No upcoming RSVPs found</p>}
                    {upcomingRSVPs && (
                        <ul
                            role="list"
                            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
                        >
                            {upcomingRSVPs.map(function (rsvp) {
                                return (
                                    <li key={rsvp.event.id}>
                                        <EventCard
                                            id={rsvp.event.id}
                                            name={rsvp.event.name}
                                            eventTimestamp={rsvp.event.eventTimestamp}
                                            imageURL={rsvp.event.imageURL}
                                            chainId={rsvp.event.chainId}
                                        />
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center py-8">
                    <p className="mb-4">Please connect your wallet to view your rsvps</p>
                    <button
                        onClick={openConnectModal}
                        className="bg-gray-50 dark:bg-[#1A1B1F] text-black dark:text-white text-center px-6 py-3 rounded-md drop-shadow-lg hover:scale-105 mb-3 mt-2 focus:ring-2 focus:ring-indigo-500"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            Connect
                        </span>
                    </button>
                </div>
            )}
        </Dashboard>
    )
}
