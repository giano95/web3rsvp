import abiJSON from "./Web3RSVP.json"
import { ethers } from "ethers"

const contracts = require("../../backend/exportContracts.json")

async function connectContract() {
    let rsvpContract
    try {
        const { ethereum } = window

        if (ethereum) {
            //checking for eth object in the window
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const { chainId } = await provider.getNetwork()

            // Get contract info from the backennd export file
            const contractAddress = contracts[chainId]["Web3RSVP"].address
            const contractABI = contracts[chainId]["Web3RSVP"].abi

            //console.log(contractABI)

            rsvpContract = new ethers.Contract(contractAddress, contractABI, signer) // instantiating new connection to the contract
        } else {
            console.log("Ethereum object doesn't exist!")
        }
    } catch (error) {
        console.log("ERROR:", error)
    }
    return rsvpContract
}

export default connectContract
