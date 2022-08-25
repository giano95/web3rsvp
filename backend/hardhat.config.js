require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-waffle") //new update from hardhat requires to import 'hardhat-toolbox'
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("dotenv").config()

module.exports = {
    solidity: "0.8.4",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        polygonMumbai: {
            chainId: 80001,
            url: process.env.MUMBAI_RPC_URL || "",
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
            gas: 2100000,
            gasPrice: 8000000000,
            blockConfirmations: 3,
        },
        rinkeby: {
            chainId: 4,
            url: process.env.RINKEBY_RPC_URL || "",
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
            gas: 2100000,
            gasPrice: 8000000000,
            blockConfirmations: 3,
        },
    },
    // Used by hardhat-deploy
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    // Etherscan-verify
    etherscan: {
        apiKey: {
            polygonMumbai: process.env.POLYGONSCAN_API_KEY,
            rinkeby: process.env.ETHERSCAN_API_KEY,
        },
    },
}
