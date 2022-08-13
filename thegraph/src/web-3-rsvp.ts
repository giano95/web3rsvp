import { Address, ipfs, json } from "@graphprotocol/graph-ts"
import { ConfirmedAttendee, DepositsPaidOut, NewEventCreated, NewRSVP } from "../generated/Web3RSVP/Web3RSVP"
import { Account, RSVP, Confirmation, Event } from "../generated/schema"
import { integer } from "@protofire/subgraph-toolkit"

// Check if the 'Account' entity already exist, if so return it otherwise create it
function getOrCreateAccount(address: Address): Account {
    let account = Account.load(address.toHex())
    if (account == null) {
        account = new Account(address.toHex())
        account.totalRSVPs = integer.ZERO
        account.totalAttendedEvents = integer.ZERO
        account.save()
    }
    return account
}

// We create a new 'Event' entity every time a 'NewEventCreated' event is emitted (kinda)
export function handleNewEventCreated(event: NewEventCreated): void {
    // Check if we can load 'Event' entity, and create a new instance if there's no one
    let newEvent = Event.load(event.params.eventID.toHex())
    if (newEvent == null) {
        // Create new Event with ID = eventID
        newEvent = new Event(event.params.eventID.toHex())

        // Set the other var passed through the event
        newEvent.eventID = event.params.eventID
        newEvent.eventOwner = event.params.creatorAddress
        newEvent.eventTimestamp = event.params.eventTimestamp
        newEvent.maxCapacity = event.params.maxCapacity
        newEvent.deposit = event.params.deposit
        newEvent.paidOut = false

        // Set the count of RSVP and Attendes to 0
        newEvent.totalRSVPs = integer.ZERO
        newEvent.totalConfirmedAttendees = integer.ZERO

        // For the name, description, link, and imagePath fields, we will be using the eventCID to access data stored with ipfs
        let metadata = ipfs.cat(event.params.eventDataCID + "/data.json")
        if (metadata) {
            const value = json.fromBytes(metadata).toObject()
            if (value) {
                const name = value.get("name")
                const description = value.get("description")
                const link = value.get("link")
                const imagePath = value.get("image")

                if (name) {
                    newEvent.name = name.toString()
                }

                if (description) {
                    newEvent.description = description.toString()
                }

                if (link) {
                    newEvent.link = link.toString()
                }

                if (imagePath) {
                    const imageURL = "https://ipfs.io/ipfs/" + event.params.eventDataCID + imagePath.toString()
                    newEvent.imageURL = imageURL
                } else {
                    const fallbackURL =
                        "https://ipfs.io/ipfs/bafybeibssbrlptcefbqfh4vpw2wlmqfj2kgxt3nil4yujxbmdznau3t5wi/event.png"
                    newEvent.imageURL = fallbackURL
                }
            }
        }

        // Save the new instance
        newEvent.save()
    }
}

// We create a new 'RSVP' entity and a new 'Account' entity (assuming it’s a new user)
export function handleNewRSVP(event: NewRSVP): void {
    // Set the id as the combination of the eventID and the attendeeAddress
    let id = event.params.eventID.toHex() + event.params.attendeeAddress.toHex()

    let newRSVP = RSVP.load(id)
    let account = getOrCreateAccount(event.params.attendeeAddress)
    let thisEvent = Event.load(event.params.eventID.toHex())

    // Check if there isn't already a 'RSVP' entity, and if the event we are RSVP-ing exist
    if (newRSVP == null && thisEvent != null) {
        // If so create a new 'RSVP' entity
        newRSVP = new RSVP(id)
        newRSVP.attendee = account.id
        newRSVP.event = thisEvent.id
        newRSVP.save()

        // Increment the 'Event' totalRSVPs counter
        thisEvent.totalRSVPs = integer.increment(thisEvent.totalRSVPs)
        thisEvent.save()

        // Increment the 'Account' totalRSVPs counter
        account.totalRSVPs = integer.increment(account.totalRSVPs)
        account.save()
    }
}

export function handleConfirmedAttendee(event: ConfirmedAttendee): void {
    // Set the id as the combination of the eventID and the attendeeAddress
    let id = event.params.eventID.toHex() + event.params.attendeeAddress.toHex()

    let newConfirmation = Confirmation.load(id)
    let account = getOrCreateAccount(event.params.attendeeAddress)
    let thisEvent = Event.load(event.params.eventID.toHex())

    // Check if there isn't already a 'Confirmation' entity, and if the event we are confirming exist
    if (newConfirmation == null && thisEvent != null) {
        // If so create a new 'Confirmation' entity
        newConfirmation = new Confirmation(id)
        newConfirmation.attendee = account.id
        newConfirmation.event = thisEvent.id
        newConfirmation.save()

        // Increment the 'Event' totalRSVPs counter
        thisEvent.totalConfirmedAttendees = integer.increment(thisEvent.totalConfirmedAttendees)
        thisEvent.save()

        // Increment the 'Account' totalRSVPs counter
        account.totalAttendedEvents = integer.increment(account.totalAttendedEvents)
        account.save()
    }
}

//  All we need to do is change the 'paidOut' field of the matching 'Event' from false to true
export function handleDepositsPaidOut(event: DepositsPaidOut): void {
    let thisEvent = Event.load(event.params.eventID.toHex())
    if (thisEvent) {
        thisEvent.paidOut = true
        thisEvent.save()
    }
}
