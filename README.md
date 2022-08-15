# Web3 RSVP Project

In order to achieve a monorepo approach i split this project in 3 workspaces:

-   `backend`: Hardhat project where we defined the smart contract, we test it and deploy it
-   `thegraph`: TheGraph project were we create a GraphQL API in order to query data from the smart contract previously deployed
-   `frontend`: Frontend built with React, Next.js, ethers.js, Rainbowkit, Web3.Storage and The Graph where we offer the user the possibility to:
    -   Create a new event
    -   Display existing event
    -   RSVP to an existing event
