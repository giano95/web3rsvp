import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import getRandomImage from "../utils/getRandomImage"
import { ethers } from "ethers"
import connectContract from "../utils/connectContract"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import Alert from "../components/Alert"

export default function CreateEvent() {
    // wagmi useAccount hook
    const { isConnected } = useAccount()

    // Form variables
    const [eventName, setEventName] = useState("")
    const [eventDate, setEventDate] = useState("")
    const [eventTime, setEventTime] = useState("")
    const [maxCapacity, setMaxCapacity] = useState("")
    const [refund, setRefund] = useState("")
    const [eventLink, setEventLink] = useState("")
    const [eventDescription, setEventDescription] = useState("")

    // Alert messages variables
    const [success, setSuccess] = useState(null)
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(null)
    const [eventID, setEventID] = useState(null)

    // We use a try..catch statement to send the body to our 'api/store-event-data.js' endpoint
    // and if we get a successful response (meaning we store correctly the data on Web3.Storage and got back a CID)
    // we can pass that into a function called 'createEvent'
    async function handleSubmit(e) {
        e.preventDefault()

        const body = {
            name: eventName,
            description: eventDescription,
            link: eventLink,
            image: getRandomImage(),
        }

        try {
            const response = await fetch("/api/store-event-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            if (response.status !== 200) {
                alert("Oops! Something went wrong. Please refresh and try again.")
            } else {
                console.log("Form successfully submitted!")
                let responseJSON = await response.json()
                await createEvent(responseJSON.cid)
            }
            console.log("Form submitted")
            // check response, if success is false, dont take them to success page
        } catch (error) {
            alert(`Oops! Something went wrong. Please refresh and try again. Error ${error}`)
        }
    }

    // We pass the event data into our contract's 'createNewEvent' function.
    const createEvent = async (cid) => {
        try {
            const rsvpContract = connectContract()

            if (rsvpContract) {
                let deposit = ethers.utils.parseEther(refund)
                let eventDateAndTime = new Date(`${eventDate} ${eventTime}`)
                let eventTimestamp = eventDateAndTime.getTime()
                let eventDataCID = cid

                const txn = await rsvpContract.createNewEvent(eventTimestamp, deposit, maxCapacity, eventDataCID, {
                    gasLimit: 900000,
                })
                setLoading(true)
                console.log("Minting...", txn.hash)
                let wait = await txn.wait()
                console.log("Minted -- ", txn.hash)

                setEventID(wait.events[0].args[0])

                setSuccess(true)
                setLoading(false)
                setMessage("Your event has been created successfully.")
            } else {
                setSuccess(false)
                setMessage(`Unable to get the rsvpContract instace`)
                setLoading(false)
                console.log("Error getting contract.")
            }
        } catch (error) {
            setSuccess(false)
            setMessage(`There was an error creating your event: ${error.message}`)
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        // disable scroll on <input> elements of type number
        document.addEventListener("wheel", (event) => {
            if (document.activeElement.type === "number") {
                document.activeElement.blur()
            }
        })
    })

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Head>
                <title>Create your event | web3rsvp</title>
                <meta name="description" content="Create your virtual event on the blockchain" />
            </Head>
            <section className="relative py-12">
                {/* Loading Alert messages */}
                {loading && (
                    <Alert alertType={"loading"} alertBody={"Please wait"} triggerAlert={true} color={"white"} />
                )}
                {/* Success Alert messages */}
                {success && <Alert alertType={"success"} alertBody={message} triggerAlert={true} color={"palegreen"} />}
                {/* Unsuccess Alert messages */}
                {success === false && (
                    <Alert alertType={"failed"} alertBody={message} triggerAlert={true} color={"palevioletred"} />
                )}
                {/* Don't show the header if the user successfully creates an event */}
                {!success && (
                    <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-4xl md:text-5xl mb-4">
                        Create your virtual event
                    </h1>
                )}

                {/* Show the form only if the user has connected and hasn't already creted the events */}
                {isConnected && !success && (
                    <form onSubmit={handleSubmit} className="space-y-8 ">
                        <div className="space-y-6 sm:space-y-5">
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                                <label
                                    htmlFor="eventname"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2"
                                >
                                    Event name
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <input
                                        id="event-name"
                                        name="event-name"
                                        type="text"
                                        className="bg-white dark:bg-[#1A1B20] dark:border-gray-700 block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                                        required
                                        value={eventName}
                                        onChange={(e) => setEventName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                                <label
                                    htmlFor="date"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2"
                                >
                                    Date & time
                                    <p className="mt-1 max-w-2xl text-sm text-gray-400 dark:text-gray-500">
                                        Your event date and time
                                    </p>
                                </label>
                                <div className="mt-1 sm:mt-0 flex flex-wrap sm:flex-nowrap gap-2">
                                    <div className="w-1/2">
                                        <input
                                            id="date"
                                            name="date"
                                            type="date"
                                            className="bg-white dark:bg-[#1A1B20] dark:border-gray-700 max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                                            required
                                            value={eventDate}
                                            onChange={(e) => setEventDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <input
                                            id="time"
                                            name="time"
                                            type="time"
                                            className="bg-white dark:bg-[#1A1B20] dark:border-gray-700 max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                                            required
                                            value={eventTime}
                                            onChange={(e) => setEventTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                                <label
                                    htmlFor="max-capacity"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2"
                                >
                                    Max capacity
                                    <p className="mt-1 max-w-2xl text-sm text-gray-400 dark:text-gray-500">
                                        Limit the number of spots available for your event.
                                    </p>
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <input
                                        type="number"
                                        name="max-capacity"
                                        id="max-capacity"
                                        min="1"
                                        placeholder="100"
                                        className="bg-white dark:bg-[#1A1B20] dark:border-gray-700 max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                                        value={maxCapacity}
                                        onChange={(e) => setMaxCapacity(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                                <label
                                    htmlFor="refundable-deposit"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2"
                                >
                                    Refundable deposit
                                    <p className="mt-1 max-w-2xl text-sm text-gray-400 dark:text-gray-500">
                                        Require a refundable deposit (in MATIC) to reserve one spot at your event
                                    </p>
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <input
                                        type="number"
                                        name="refundable-deposit"
                                        id="refundable-deposit"
                                        min="0"
                                        step="any"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        className="bg-white dark:bg-[#1A1B20] dark:border-gray-700 max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                                        value={refund}
                                        onChange={(e) => setRefund(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                                <label
                                    htmlFor="event-link"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2"
                                >
                                    Event link
                                    <p className="mt-1 max-w-2xl text-sm text-gray-400 dark:text-gray-500">
                                        The link for your virtual event
                                    </p>
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <input
                                        id="event-link"
                                        name="event-link"
                                        type="text"
                                        className="bg-white dark:bg-[#1A1B20] dark:border-gray-700 block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                                        required
                                        value={eventLink}
                                        onChange={(e) => setEventLink(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                                <label
                                    htmlFor="about"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 sm:mt-px sm:pt-2"
                                >
                                    Event description
                                    <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                                        Let people know what your event is about!
                                    </p>
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <textarea
                                        id="about"
                                        name="about"
                                        rows={10}
                                        className="bg-white dark:bg-[#1A1B20] dark:border-gray-700 max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                                        value={eventDescription}
                                        onChange={(e) => setEventDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pt-5">
                            <div className="flex justify-end">
                                <Link href="/">
                                    <a className="bg-gray-50 dark:bg-[#1A1B1F] text-gray-700 dark:text-gray-200 px-6 py-[10px] text-[15px] font-medium rounded-md ml-5 drop-shadow-lg hover:scale-105">
                                        Cancel
                                    </a>
                                </Link>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:text-[#202428] text-white px-6 py-[10px] text-[15px] font-medium rounded-md ml-5 drop-shadow-lg hover:scale-105"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Show this if only if the user hasn't connect the wallet yet */}
                {!isConnected && (
                    <section className="flex flex-col items-start py-8">
                        <p className="mb-4">Please connect your wallet to create events.</p>
                        <ConnectButton />
                    </section>
                )}

                {/* If the event is successfully created, show a success message and a link to event page. */}
                {success && eventID && (
                    <div>
                        Success! Please wait a few minutes, then check out your event page{" "}
                        <span className="font-bold">
                            <Link href={`/event/${eventID}`}>here</Link>
                        </span>
                    </div>
                )}
            </section>
        </div>
    )
}
