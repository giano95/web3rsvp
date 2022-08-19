const { network, config } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    args = []
    const web3Rsvp = await deploy("Web3RSVP", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && config.etherscan.apiKey[network.name]) {
        log("Verifying...")
        await verify(web3Rsvp.address, args)
    }
}

module.exports.tags = ["all", "web3-rsvp"]
