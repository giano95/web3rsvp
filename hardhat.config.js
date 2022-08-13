require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-waffle") //new update from hardhat requires to import 'hardhat-toolbox'
require("dotenv").config()

module.exports = {
    solidity: "0.8.4",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        mumbai: {
            url: process.env.MUMBAI_RPC_URL || "",
            accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
            gas: 2100000,
            gasPrice: 8000000000,
        },
    },
}
