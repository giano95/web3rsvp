import Dashboard from "../../components/Dashboard"
import { useState } from "react"
import { gql, useQuery } from "@apollo/client"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import EventCard from "../../components/EventCard"

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
                }
            }
        }
    }
`

export default function MyPastRSVPs() {
    const { isConnected, address: accountAddress } = useAccount()

    const id = isConnected ? accountAddress.toLowerCase() : ""
    const [currentTimestamp, setEventTimestamp] = useState(new Date().getTime())
    const { loading, error, data } = useQuery(MY_RSVPS, {
        variables: { id },
    })

    if (loading)
        return (
            <Dashboard page="rsvps" isUpcoming={false}>
                <p>Loading...</p>
            </Dashboard>
        )
    if (error)
        return (
            <Dashboard page="rsvps" isUpcoming={false}>
                <p>`Error! ${error.message}`</p>
            </Dashboard>
        )
    let pastRSVPs
    if (data) {
        pastRSVPs = data.account.rsvps.filter((rsvp) => rsvp.event.eventTimestamp < currentTimestamp)
        console.log(pastRSVPs)
    }

    return (
        <Dashboard page="rsvps" isUpcoming={false}>
            {isConnected ? (
                <div>
                    {!pastRSVPs && <p>No past RSVPs found</p>}
                    {pastRSVPs && (
                        <ul
                            role="list"
                            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
                        >
                            {pastRSVPs.map(function (rsvp) {
                                return (
                                    <li key={rsvp.event.id}>
                                        <EventCard
                                            id={rsvp.event.id}
                                            name={rsvp.event.name}
                                            eventTimestamp={rsvp.event.eventTimestamp}
                                            imageURL={rsvp.event.imageURL}
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
                    <ConnectButton />
                </div>
            )}
        </Dashboard>
    )
}
