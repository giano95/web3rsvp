# The Graph 🔍

-   [The Graph 🔍](#the-graph-🔍)
    -   [Requirements](#requirements)
    -   [Quickstart](#quickstart)
    -   [Setup](#setup)
    -   [Build & Deploy Rinkeby](#build--deploy-rinkeby)
    -   [Build & Deploy Mumbai](#build--deploy-mumbai)
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
-   [graph-cli](https://www.npmjs.com/package/@graphprotocol/graph-cli) run the yarn command
    -   You'll know you did it right if you can run `graph --version` and you see a response like `0.33.0`

## Quickstart

```
git clone https://github.com/giano95/web3rsvp.git
cd web3rsvp
yarn
cd thegraph
```

## Setup

First go to the `thegraph` folder then LogIn/SignUp into [thegraph](https://thegraph.com/hosted-service/dashboard) and click ont the Add Subgraph button and create two Subgraph with the following name:

-   `web3rsvp-rinkeby-2`: the one used to indexing and query data from the Rinkeby contract.
-   `web3rsvp-mumbai-2`: the one used to indexing and query data from the Mumbai contract.

Then generate the code:

```
graph codegen
```

And authenticate to your account by replacing `<access-token>` with your token:

```
graph auth --product hosted-service <access-token>
```

Now change the contracts addresses and starting blocks in the `networks.json` file with yours (the ones that you deployed [here](#deployment-to-rinkeby-and-mumbai-testnet))

## Build & Deploy Rinkeby

Build the graph with the Rinkeby dataSource info, and then deployed to its respective subgraph (replace `<account-name>` with your).

```
graph build --network rinkeby
graph deploy --product hosted-service <account-name>/web3rsvp-rinkeby-2 --network rinkeby
```

If everything go well you should be able to enter your subgraph, click the play button and run the example query without any error.

## Build & Deploy Mumbai

Build the graph with the Mumbai dataSource info, and then deployed to its respective subgraph (replace `<account-name>` with your).

```
graph build --network mumbai
graph deploy --product hosted-service <account-name>/web3rsvp-mumbai-2 --network mumbai
```

If everything go well you should be able to enter your subgraph, click the play button and run the example query without any error.

# Thanks 🎉

A special thanks to all the team of [30DaysofWeb3](https://www.30daysofweb3.xyz/) for the amazing project and the support given through the Discord Community. Also if you appreciated this, feel free to follow me or donate!

Metamask Address: 0x9680201d9c93d65a3603d2088d125e955c73BD65

[![Marco Gianelli Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/ERC_721Holder)
[![Marco Gianelli Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/marco_gianelli_ifbbbro/)
