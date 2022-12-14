import Dashboard from "../../components/Dashboard"
import { useState, useEffect } from "react"
import { gql, useQuery } from "@apollo/client"
import { useAccount, useNetwork } from "wagmi"
import EventCard from "../../components/EventCard"
import { useConnectModal } from "@rainbow-me/rainbowkit"

const MY_UPCOMING_EVENTS = gql`
    query Events($eventOwner: String, $currentTimestamp: String) {
        events(where: { eventOwner: $eventOwner, eventTimestamp_gt: $currentTimestamp }) {
            id
            eventID
            name
            description
            eventTimestamp
            maxCapacity
            totalRSVPs
            imageURL
            chainId
        }
    }
`

export default function MyUpcomingEvents() {
    const { isConnected, address: accountAddress } = useAccount()
    const { chain } = useNetwork()
    const { openConnectModal } = useConnectModal()

    const eventOwner = isConnected ? accountAddress.toLowerCase() : ""
    const [currentTimestamp, setEventTimestamp] = useState(new Date().getTime().toString())
    const { loading, error, data, refetch } = useQuery(MY_UPCOMING_EVENTS, {
        variables: { eventOwner, currentTimestamp },
        context: { isRinkeby: chain?.id == 4 },
    })

    useEffect(() => {
        if (chain) {
            console.log(chain.id)
            refetch()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chain])

    if (loading)
        return (
            <Dashboard page="events" isUpcoming={true}>
                <p>Loading...</p>
            </Dashboard>
        )
    if (error)
        return (
            <Dashboard page="events" isUpcoming={true}>
                <p>{`Error! ${error.message}`}</p>
            </Dashboard>
        )

    return (
        <Dashboard page="events" isUpcoming={true}>
            {isConnected ? (
                <div>
                    {data && data.events.length == 0 && <p>No upcoming events found</p>}
                    {data && data.events.length > 0 && (
                        <ul
                            role="list"
                            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
                        >
                            {data.events.map((event) => (
                                <li key={event.id}>
                                    <EventCard
                                        id={event.id}
                                        name={event.name}
                                        eventTimestamp={event.eventTimestamp}
                                        imageURL={event.imageURL}
                                        chainId={event.chainId}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center py-8">
                    <p className="mb-4">Please connect your wallet to view your events</p>
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
