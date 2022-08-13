const hre = require("hardhat")

const main = async () => {
    // Get the RSVP contract and deploy it
    console.log(hre.ethers)
    const rsvpContractFactory = await hre.ethers.getContractFactory("Web3RSVP")
    const rsvpContract = await rsvpContractFactory.deploy()
    await rsvpContract.deployed()
    console.log("Contract deployed to:", rsvpContract.address)

    // Get the default hardhat wallet addresses
    const [deployer, address1, address2] = await hre.ethers.getSigners()

    // Set the Event var
    let deposit = hre.ethers.utils.parseEther("1")
    let maxCapacity = 3
    let timestamp = 1718926200
    let eventDataCID = "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi"

    // Create a new Event
    let txn = await rsvpContract.createNewEvent(timestamp, deposit, maxCapacity, eventDataCID)
    let wait = await txn.wait()
    console.log("NEW EVENT CREATED:", wait.events[0].event, wait.events[0].args)

    // Log out the eventId (hash generated)
    let eventID = wait.events[0].args.eventID
    console.log("EVENT ID:", eventID)

    // RSVP the 'deployer'
    txn = await rsvpContract.createNewRSVP(eventID, { value: deposit })
    wait = await txn.wait()
    console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args)

    // RSVP the 'address1'
    txn = await rsvpContract.connect(address1).createNewRSVP(eventID, { value: deposit })
    wait = await txn.wait()
    console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args)

    // RSVP the 'address2'
    txn = await rsvpContract.connect(address2).createNewRSVP(eventID, { value: deposit })
    wait = await txn.wait()
    console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args)

    // Confirm all the RSVP calling the 'confirmAllAttendees' function using the deployer (the owner)
    txn = await rsvpContract.confirmAllAttendees(eventID)
    wait = await txn.wait()
    wait.events.forEach((event) => console.log("CONFIRMED:", event.args.attendeeAddress))

    // wait 10 years
    await hre.network.provider.send("evm_increaseTime", [15778800000000])

    // Withdraw unclaimed deposits (using the deployer aka owner)
    txn = await rsvpContract.withdrawUnclaimedDeposits(eventID)
    wait = await txn.wait()
    console.log("WITHDRAWN:", wait.events[0].event, wait.events[0].args)
}

const runMain = async () => {
    try {
        await main()
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

runMain()
