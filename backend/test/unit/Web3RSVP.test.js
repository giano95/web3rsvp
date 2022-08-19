const { assert, expect } = require("chai")
const { BigNumber } = require("ethers")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

// We do unit test only on dev/local chains, so for real ones we skip
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Web3 RSVP Unit Tests", function () {
          let web3Rsvp
          let web3RsvpContract
          let deployer
          let user1
          let user2

          //  creatEvent var
          const deposit = hre.ethers.utils.parseEther("1")
          const maxCapacity = 2
          const eventTimestamp = 1718926200 // 20-06-2024
          const eventDataCID = "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi"

          beforeEach(async function () {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              user1 = accounts[1]
              user2 = accounts[2]

              await deployments.fixture(["web3-rsvp"]) // run the 'web3-rsvp' deployments
              web3RsvpContract = await ethers.getContract("Web3RSVP") // web3Rsvp contract
              web3Rsvp = web3RsvpContract.connect(deployer) // web3Rsvp contract with wallet connected
          })

          describe("createNewEvent", function () {
              it("successfull 'CreateNewEvent'", async () => {
                  // Call 'CreateNewEvent'
                  let txResponse = await web3Rsvp.createNewEvent(eventTimestamp, deposit, maxCapacity, eventDataCID)
                  let txReceipt = await txResponse.wait(1)

                  // The status of a transaction is 1 if successful or 0 if it was reverted
                  assert(txReceipt.status == 1)
              })

              it("emit a 'NewEventCreated' event correctly", async () => {
                  // Generate the 'eventID' using ethers utility function
                  const eventID = ethers.utils.solidityKeccak256(
                      ["address", "address", "uint256", "uint256", "uint256"],
                      [deployer.address, web3RsvpContract.address, eventTimestamp, deposit, maxCapacity]
                  )

                  await expect(web3Rsvp.createNewEvent(eventTimestamp, deposit, maxCapacity, eventDataCID))
                      .to.emit(web3Rsvp, "NewEventCreated")
                      .withArgs(
                          eventID,
                          deployer.address,
                          eventTimestamp.toString(),
                          maxCapacity.toString(),
                          deposit.toString(),
                          eventDataCID
                      )
              })

              it("correctly initialize the Event variables", async () => {
                  // Call 'CreateNewEvent'
                  await web3Rsvp.createNewEvent(eventTimestamp, deposit, maxCapacity, eventDataCID)

                  // Generate the 'eventID' using ethers utility function
                  const eventID = ethers.utils.solidityKeccak256(
                      ["address", "address", "uint256", "uint256", "uint256"],
                      [deployer.address, web3RsvpContract.address, eventTimestamp, deposit, maxCapacity]
                  )

                  // Get the 'CreateEvent' from the contract
                  const createEvent = await web3Rsvp.idToEvent(eventID)

                  // Compare each variable
                  assert(eventID == createEvent["eventId"])
                  assert(eventDataCID == createEvent["eventDataCID"])
                  assert(deployer.address == createEvent["eventOwner"])
                  assert(eventTimestamp.toString() == createEvent["eventTimestamp"].toString()) // cast to string in case of big number
                  assert(deposit.toString() == createEvent["deposit"].toString()) // cast to string in case of big number
                  assert(maxCapacity.toString() == createEvent["maxCapacity"].toString()) // cast to string in case of big number
                  assert(false == createEvent["paidOut"])
              })

              it("revert if re-called with the same args", async () => {
                  // Call 'CreateNewEvent'
                  await web3Rsvp.createNewEvent(eventTimestamp, deposit, maxCapacity, eventDataCID)

                  // Try to call 'CreateNewEvent' with the same args
                  await expect(
                      web3Rsvp.createNewEvent(eventTimestamp, deposit, maxCapacity, eventDataCID)
                  ).to.be.revertedWith("ALREADY REGISTERED")
              })
          })

          describe("createNewRSVP", function () {
              let eventID

              beforeEach(async function () {
                  txResponse = await web3Rsvp.createNewEvent(eventTimestamp, deposit, maxCapacity, eventDataCID)
                  txReceipt = await txResponse.wait(1)
                  eventID = txReceipt.events[0].args.eventID
              })

              it("successfull 'CreateNewRSVP'", async () => {
                  txRSVPResponse = await web3Rsvp.createNewRSVP(eventID, { value: deposit })
                  txReceipt = await txResponse.wait(1)

                  // The status of a transaction is 1 if successful or 0 if it was reverted
                  assert(txReceipt.status == 1)
              })

              it("revert if the passed value is < deposit", async () => {
                  await expect(
                      web3Rsvp.createNewRSVP(eventID, { value: hre.ethers.utils.parseEther("0.1") })
                  ).to.be.revertedWith("NOT ENOUGH")
              })

              it("revert if the event has already happened", async () => {
                  // increase the time of the network by 4 year
                  await hre.network.provider.send("evm_increaseTime", [4 * 365 * 24 * 60 * 60])

                  await expect(web3Rsvp.createNewRSVP(eventID, { value: deposit })).to.be.revertedWith(
                      "ALREADY HAPPENED"
                  )
              })

              it("revert if the event has reached capacity", async () => {
                  // RSVP 1
                  await web3Rsvp.createNewRSVP(eventID, { value: deposit })

                  // RSVP 2
                  web3Rsvp = web3RsvpContract.connect(user1)
                  await web3Rsvp.createNewRSVP(eventID, { value: deposit })

                  // RSVP 3
                  web3Rsvp = web3RsvpContract.connect(user2)
                  await expect(web3Rsvp.createNewRSVP(eventID, { value: deposit })).to.be.revertedWith(
                      "This event has reached capacity"
                  )
              })

              it("revert if the sender has already RSVP", async () => {
                  // RSVP 1
                  await web3Rsvp.createNewRSVP(eventID, { value: deposit })

                  await expect(web3Rsvp.createNewRSVP(eventID, { value: deposit })).to.be.revertedWith(
                      "ALREADY CONFIRMED"
                  )
              })

              it("emit a 'NewRSVP' event correctly", async () => {
                  await expect(web3Rsvp.createNewRSVP(eventID, { value: deposit }))
                      .to.emit(web3Rsvp, "NewRSVP")
                      .withArgs(eventID, deployer.address)
              })
          })

          describe("confirmAttendee", function () {
              let eventID

              beforeEach(async function () {
                  createNewEventResponse = await web3Rsvp.createNewEvent(
                      eventTimestamp,
                      deposit,
                      maxCapacity,
                      eventDataCID
                  )
                  createNewEventReceipt = await createNewEventResponse.wait(1)
                  eventID = createNewEventReceipt.events[0].args.eventID
              })

              it("successfull 'confirmAttendee'", async () => {
                  // RSVP user1
                  web3Rsvp = web3RsvpContract.connect(user1)
                  await web3Rsvp.createNewRSVP(eventID, { value: deposit })

                  // ConfirmAtendee user1
                  web3Rsvp = web3RsvpContract.connect(deployer)
                  txResponse = await web3Rsvp.confirmAttendee(eventID, user1.address)
                  txReceipt = await txResponse.wait(1)

                  // The status of a transaction is 1 if successful or 0 if it was reverted
                  assert(txReceipt.status == 1)
              })

              it("revert if the caller isn't the owner of the event", async () => {
                  web3Rsvp = web3RsvpContract.connect(user1)

                  await expect(web3Rsvp.confirmAttendee(eventID, user2.address)).to.be.revertedWith("NOT AUTHORIZED")
              })

              it("revert if the user hasn't RSVP to the event", async () => {
                  await expect(web3Rsvp.confirmAttendee(eventID, user1.address)).to.be.revertedWith(
                      "NO RSVP TO CONFIRM"
                  )
              })

              it("revert if the owner has already confirm the user", async () => {
                  // RSVP user1
                  web3Rsvp = web3RsvpContract.connect(user1)
                  await web3Rsvp.createNewRSVP(eventID, { value: deposit })

                  // ConfirmAtendee user1
                  web3Rsvp = web3RsvpContract.connect(deployer)
                  await web3Rsvp.confirmAttendee(eventID, user1.address)

                  await expect(web3Rsvp.confirmAttendee(eventID, user1.address)).to.be.revertedWith("ALREADY CLAIMED")
              })

              it("revert if the owner has already claimed the deposit", async () => {
                  // RSVP user1
                  web3Rsvp = web3RsvpContract.connect(user1)
                  await web3Rsvp.createNewRSVP(eventID, { value: deposit })

                  // Withdraw the "deposit"
                  await hre.network.provider.send("evm_increaseTime", [4 * 365 * 24 * 60 * 60])
                  web3Rsvp = web3RsvpContract.connect(deployer)
                  await web3Rsvp.withdrawUnclaimedDeposits(eventID)

                  await expect(web3Rsvp.confirmAttendee(eventID, user1.address)).to.be.revertedWith("ALREADY PAID OUT")
              })

              it("send back depoist to the user", async () => {
                  // RSVP user1
                  web3Rsvp = web3RsvpContract.connect(user1)
                  await web3Rsvp.createNewRSVP(eventID, { value: deposit })

                  // Get the user balance before the 'confirmAttendee' call
                  const userBalanceBefore = await user1.getBalance()

                  // ConfirmAttendee user1
                  web3Rsvp = web3RsvpContract.connect(deployer)
                  await web3Rsvp.confirmAttendee(eventID, user1.address)

                  await expect((await user1.getBalance()).toString()).to.equal(
                      userBalanceBefore.add(BigNumber.from(deposit)).toString()
                  )
              })

              it("emit a 'ConfirmAttendee' event correctly", async () => {
                  // RSVP user1
                  web3Rsvp = web3RsvpContract.connect(user1)
                  await web3Rsvp.createNewRSVP(eventID, { value: deposit })

                  web3Rsvp = web3RsvpContract.connect(deployer)
                  await expect(web3Rsvp.confirmAttendee(eventID, user1.address))
                      .to.emit(web3Rsvp, "ConfirmedAttendee")
                      .withArgs(eventID, user1.address)
              })
          })

          describe("confirmAllAttendees", function () {
              let eventID

              beforeEach(async function () {
                  createNewEventResponse = await web3Rsvp.createNewEvent(
                      eventTimestamp,
                      deposit,
                      maxCapacity,
                      eventDataCID
                  )
                  createNewEventReceipt = await createNewEventResponse.wait(1)
                  eventID = createNewEventReceipt.events[0].args.eventID
              })

              it("successfull 'confirmAllAttendees'", async () => {
                  // RSVP user1
                  web3Rsvp = web3RsvpContract.connect(user1)
                  await web3Rsvp.createNewRSVP(eventID, { value: deposit })

                  // RSVP user2
                  web3Rsvp = web3RsvpContract.connect(user2)
                  await web3Rsvp.createNewRSVP(eventID, { value: deposit })

                  // ConfirmAllAtendees
                  web3Rsvp = web3RsvpContract.connect(deployer)
                  txResponse = await web3Rsvp.confirmAllAttendees(eventID)
                  txReceipt = await txResponse.wait(1)

                  // The status of a transaction is 1 if successful or 0 if it was reverted
                  assert(txReceipt.status == 1)
              })

              it("revert if the caller isn't the owner of the event", async () => {
                  web3Rsvp = web3RsvpContract.connect(user1)

                  await expect(web3Rsvp.confirmAllAttendees(eventID)).to.be.revertedWith("NOT AUTHORIZED")
              })

              it("emit two 'ConfirmAttendee' event correctly", async () => {
                  // RSVP user1
                  web3Rsvp = web3RsvpContract.connect(user1)
                  await web3Rsvp.createNewRSVP(eventID, { value: deposit })

                  // RSVP user2
                  web3Rsvp = web3RsvpContract.connect(user2)
                  await web3Rsvp.createNewRSVP(eventID, { value: deposit })

                  // ConfirmAllAtendees
                  web3Rsvp = web3RsvpContract.connect(deployer)
                  await expect(web3Rsvp.confirmAllAttendees(eventID))
                      .to.emit(web3Rsvp, "ConfirmedAttendee")
                      .withArgs(eventID, user1.address)
                      .to.emit(web3Rsvp, "ConfirmedAttendee")
                      .withArgs(eventID, user2.address)
              })
          })

          describe("withdrawUnclaimedDeposits", function () {
              let eventID

              beforeEach(async function () {
                  createNewEventResponse = await web3Rsvp.createNewEvent(
                      eventTimestamp,
                      deposit,
                      maxCapacity,
                      eventDataCID
                  )
                  createNewEventReceipt = await createNewEventResponse.wait(1)
                  eventID = createNewEventReceipt.events[0].args.eventID
              })

              it("successfull 'withdrawUnclaimedDeposits'", async () => {
                  // RSVP user1
                  web3Rsvp = web3RsvpContract.connect(user1)
                  await web3Rsvp.createNewRSVP(eventID, { value: deposit })

                  // increase the time of the network by 4 year
                  await hre.network.provider.send("evm_increaseTime", [4 * 365 * 24 * 60 * 60])

                  // Withdraw the "deposit"
                  web3Rsvp = web3RsvpContract.connect(deployer)
                  txResponse = await web3Rsvp.withdrawUnclaimedDeposits(eventID)
                  txReceipt = await txResponse.wait(1)

                  // The status of a transaction is 1 if successful or 0 if it was reverted
                  assert(txReceipt.status == 1)
              })

              it("revert if the deposits have been already withdraw", async () => {
                  // increase the time of the network by 4 year
                  await hre.network.provider.send("evm_increaseTime", [4 * 365 * 24 * 60 * 60])

                  // Withdraw the "deposit"
                  await web3Rsvp.withdrawUnclaimedDeposits(eventID)

                  await expect(web3Rsvp.withdrawUnclaimedDeposits(eventID)).to.be.revertedWith("ALREADY PAID")
              })

              it("revert if the deposits have been already withdraw", async () => {
                  await expect(web3Rsvp.withdrawUnclaimedDeposits(eventID)).to.be.revertedWith("TOO EARLY")
              })

              it("revert if the caller isn't the owner of the event", async () => {
                  // increase the time of the network by 4 year
                  await hre.network.provider.send("evm_increaseTime", [4 * 365 * 24 * 60 * 60])

                  web3Rsvp = web3RsvpContract.connect(user1)

                  await expect(web3Rsvp.withdrawUnclaimedDeposits(eventID)).to.be.revertedWith("MUST BE EVENT OWNER")
              })

              it("withdraw correctly all deposits to owner", async () => {
                  // RSVP user1
                  web3Rsvp = web3RsvpContract.connect(user1)
                  await web3Rsvp.createNewRSVP(eventID, { value: deposit })

                  // RSVP user2
                  web3Rsvp = web3RsvpContract.connect(user2)
                  await web3Rsvp.createNewRSVP(eventID, { value: deposit })

                  // increase the time of the network by 4 year
                  await hre.network.provider.send("evm_increaseTime", [4 * 365 * 24 * 60 * 60])

                  // Get the owner balance before the call
                  const ownerBalanceBefore = await deployer.getBalance()

                  // WithdrawUnclaimedDeposits
                  web3Rsvp = web3RsvpContract.connect(deployer)
                  const txResponse = await web3Rsvp.withdrawUnclaimedDeposits(eventID)
                  const txReceipt = await txResponse.wait(1)

                  await expect(
                      (await deployer.getBalance()).add(txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice)).toString()
                  ).to.equal(ownerBalanceBefore.add(BigNumber.from(deposit)).add(BigNumber.from(deposit)).toString())
              })
          })
      })
