const { ethers, network } = require("hardhat")
const fs = require("fs")
const path = require("path")
const { developmentChains } = require("../helper-hardhat-config")

const OUTPUT_FILE = "./exportContracts.json"

module.exports = async function () {
    if (!developmentChains.includes(network.name)) {
        try {
            const files = fs.readdirSync("./contracts/")
            for await (const file of files) {
                await updateExportContracts(path.parse(file).name)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

async function updateExportContracts(contractName) {
    const contract = await ethers.getContract(contractName)
    const chainId = network.config.chainId.toString()
    const exportFile = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"))

    // Set contract data
    if (chainId in exportFile && exportFile[chainId].hasOwnProperty(contractName)) {
        Object.assign(exportFile[chainId][contractName], {
            address: contract.address,
            abi: contract.interface.format(ethers.utils.FormatTypes.json),
        })
    } else if (chainId in exportFile) {
        Object.assign(exportFile[chainId], {
            [contractName]: {
                address: contract.address,
                abi: contract.interface.format(ethers.utils.FormatTypes.json),
            },
        })
    } else {
        exportFile[chainId] = {
            [contractName]: {
                address: contract.address,
                abi: contract.interface.format(ethers.utils.FormatTypes.json),
            },
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(exportFile))
}

module.exports.tags = ["all", "update-export", "main"]
