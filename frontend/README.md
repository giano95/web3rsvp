# Frontend 🖥

-   [Frontend 🖥](#frontend-🖥)
    -   [Requirements](#requirements)
    -   [Quickstart](#quickstart)
    -   [Setup local variables](#setup-local-variables)
    -   [Run Locally](#run-locally)
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
cd frontend
```

## Setup local variables

First go to the `frontend` folder and the setup the environment variables, you can add them to a `.env.local` file, similar to what you see in `.env.example.local`.

-   `WEB3STORAGE_TOKEN`: This is the API Token used to upload data into ipfs. You can get one [here](https://web3.storage/tokens/) after signing up.
-   `NEXT_PUBLIC_POLYGON_MUMBAI_ALCHEMY_ID`: This is API Key of the Rinkeby app that you prevously created on [Alchemy](https://alchemy.com/?a=673c802981)
-   `NEXT_PUBLIC_RINKEBY_ALCHEMY_ID`: This is API Key of the Mumbai app that you prevously created on [Alchemy](https://alchemy.com/?a=673c802981)

For easiness we are gonna also set the block's explorer urls:

-   `NEXT_PUBLIC_MUMBAI_POLYGONSCAN_URL`: https://mumbai.polygonscan.com/
-   `NEXT_PUBLIC_RINKEBY_ETHERSCAN_URL`: https://rinkeby.etherscan.io/

The last step of the setup is gonna be replace the Endpoint of the subgraphs we [previously](#the-graph) deployed. To do that replace the http queries with yours http queries in `apollo-client.js`.

```
const rinkebyEndpoint = new HttpLink({
    uri: "<web3rsvp-rinkeby-2-http-queries>",
})
const mumbaiEndpoint = new HttpLink({
    uri: "<web3rsvp-mumbai-2-http-queries>",
})
```

## Run locally

Now it's time to finally run locally on your web broswer this dApp, just run:

```
const rinkebyEndpoint = new HttpLink({
    uri: "<web3rsvp-rinkeby-2-http-queries>",
})
const mumbaiEndpoint = new HttpLink({
    uri: "<web3rsvp-mumbai-2-http-queries>",
})
```

And pray 🙏 the gods of conding that everything will go smoothly

# Thanks 🎉

A special thanks to all the team of [30DaysofWeb3](https://www.30daysofweb3.xyz/) for the amazing project and the support given through the Discord Community. Also if you appreciated this, feel free to follow me or donate!

Metamask Address: 0x9680201d9c93d65a3603d2088d125e955c73BD65

[![Marco Gianelli Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/ERC_721Holder)
[![Marco Gianelli Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/marco_gianelli_ifbbbro/)
