# Backend 🛠

-   [Backend 🛠](#backend-🛠)
    -   [Requirements](#requirements)
    -   [Quickstart](#quickstart)
    -   [Deployment to the Hardhat net](#deployment-to-the-hardhat-net)
    -   [Deployment to Rinkeby and Mumbai testnet](#deployment-to-rinkeby-and-mumbai-testnet)
-   [Thanks 🎉](#thanks-🎉)

## Requirements

-   [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
    -   You'll know you did it right if you can run `git --version` and you see a response like `git version 2.32.1`
-   [Nodejs](https://nodejs.org/en/)
    -   You'll know you've installed nodejs right if you can run:
        -   `node --version` and get an ouput like: `v16.16.0`
-   [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) instead of `npm`
    -   You'll know you've installed yarn right if you can run:
        -   `yarn --version` and get an output like: `1.22.19`
        -   You might need to install it with `npm`

## Quickstart

```
git clone https://github.com/giano95/web3rsvp.git
cd web3rsvp
yarn
cd backend
```

## Deployment to the Hardhat net

Try to Deploy and Test the contract on the Hardhat Network and see if everything go smooth without error.

```
yarn hardhat deploy
yarn hardhat test
```

You can see the coverage of the Test by typing:

```
yarn hardhat coverage
```

## Deployment to Rinkeby and Mumbai testnet

The first thing to do is setup the environment variables, in particular `RINKEBY_RPC_URL`, `MUMBAI_RPC_URL` and `PRIVATE_KEY`. You can add them to a `.env` file, similar to what you see in `.env.example`.

-   `PRIVATE_KEY`: The private key of your account (like from [metamask](https://metamask.io/)). You can [learn how to export it here](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).
-   `RINKEBY_RPC_URL`: This is url of the Rinkeby testnet node you're working with. You can get setup with one for free from [Alchemy](https://alchemy.com/?a=673c802981)
-   `MUMBAI_RPC_URL`: This is url of the Mumbai testnet node you're working with. You can get setup with one for free from [Alchemy](https://alchemy.com/?a=673c802981)

In order to autamically verify the contract once deployed you need to set:

-   `ETHERSCAN_API_KEY`: This is the API Key of Etherscan, you can get one here [Etherscan](https://etherscan.io/myapikey)
-   `POLYGONSCAN_API_KEY`: This is the API Key of Polygonscan, you can get one here [Polygonscan](https://polygonscan.com/myapikey)

To deploy the contracts you need some token to pay for the gas fees:

-   Head over to [rinkebyfaucet](https://rinkebyfaucet.com/) and get some tesnet ETH. You should see the ETH show up in your metamask.
-   Head over to [mumbaifaucet](https://mumbaifaucet.com/) and get some tesnet MATIC. You should see the MATIC show up in your metamask.

Now it's finally time to Deploy:

```
yarn hardhat deploy --network rinkeby
yarn hardhat deploy --network polygonMumbai
```

If everything go smooth you should see the Hashes of the deployed contracts on the console at run-time and also on the `exportContracts.json` file with the contract abis.

# Thanks 🎉

A special thanks to all the team of [30DaysofWeb3](https://www.30daysofweb3.xyz/) for the amazing project and the support given through the Discord Community. Also if you appreciated this, feel free to follow me or donate!

Metamask Address: 0x9680201d9c93d65a3603d2088d125e955c73BD65

[![Marco Gianelli Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/ERC_721Holder)
[![Marco Gianelli Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/marco_gianelli_ifbbbro/)
