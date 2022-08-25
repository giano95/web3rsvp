import { useState, useEffect } from "react"
import { gql, useQuery } from "@apollo/client"
import Landing from "../components/Landing"
import EventCard from "../components/EventCard"
import { chainId, useNetwork } from "wagmi"

const UPCOMING_EVENTS = gql`
    query Events($currentTimestamp: String) {
        events(where: { eventTimestamp_gt: $currentTimestamp }) {
            id
            name
            eventTimestamp
            imageURL
            chainId
        }
    }
`

const UPCOMING_EVENTS_RINKEBY = gql`
    query Events($currentTimestamp: String) {
        events(where: { eventTimestamp_gt: $currentTimestamp, chainId: 4 }) {
            id
            name
            eventTimestamp
            imageURL
            chainId
        }
    }
`

const UPCOMING_EVENTS_MUMBAI = gql`
    query Events($currentTimestamp: String) {
        events(where: { eventTimestamp_gt: $currentTimestamp, chainId: 80001 }) {
            id
            name
            eventTimestamp
            imageURL
            chainId
        }
    }
`

export default function Home() {
    const [currentTimestamp, setEventTimestamp] = useState(new Date().getTime().toString())

    const { chain } = useNetwork()
    const [mounted, setMounted] = useState(false)

    const rinkebyQuery = useQuery(UPCOMING_EVENTS_RINKEBY, {
        variables: { currentTimestamp },
        context: { isRinkeby: true },
        fetchPolicy: "no-cache",
    })

    const mumbaiQuery = useQuery(UPCOMING_EVENTS_MUMBAI, {
        variables: { currentTimestamp },
        context: { isRinkeby: false },
        fetchPolicy: "no-cache",
    })

    const loading = rinkebyQuery.loading || mumbaiQuery.loading
    const error = rinkebyQuery.error || mumbaiQuery.error

    const dataRinkeby = rinkebyQuery.data
    const dataMumbai = mumbaiQuery.data

    if (loading)
        return (
            <Landing>
                <p>Loading...</p>
            </Landing>
        )
    if (error)
        return (
            <Landing>
                <p>{`Error! ${error.message}`}</p>
            </Landing>
        )

    return (
        <Landing>
            <ul
                role="list"
                className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
            >
                {dataRinkeby &&
                    dataRinkeby.events.map((event) => (
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
                {dataMumbai &&
                    dataMumbai.events.map((event) => (
                        <li key={event.id}>
                            <EventCard
                                id={event.id}
                                name={event.name}
                                eventTimestamp={event.eventTimestamp}
                                imageURL={event.imageURL}
                            />
                        </li>
                    ))}
                {/* {data &&
                        data.events.map((event) => (
                            <li key={event.id}>
                                <EventCard
                                    id={event.id}
                                    name={event.name}
                                    eventTimestamp={event.eventTimestamp}
                                    imageURL={event.imageURL}
                                />
                            </li>
                        ))} */}
            </ul>
        </Landing>
    )
}
