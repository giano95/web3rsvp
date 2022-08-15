import Layout from "../components/Layout"
import "../styles/globals.css"
import "@rainbow-me/rainbowkit/styles.css"
import { getDefaultWallets, RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit"
import { chain, configureChains, createClient, WagmiConfig } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { ApolloProvider } from "@apollo/client"
import client from "../apollo-client"

// RAINBOW_KIT: Configure the chains and generate the required connectors
const { chains, provider } = configureChains(
    [chain.polygonMumbai, chain.polygon],
    [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }), publicProvider()]
)
const { connectors } = getDefaultWallets({
    appName: "web3rsvp",
    chains,
})
const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
})

export default function MyApp({ Component, pageProps }) {
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
                theme={lightTheme({
                    accentColor: "#4F46E5",
                    accentColorForeground: "white",
                    borderRadius: "medium",
                    fontStack: "system",
                    overlayBlur: "small",
                })}
                chains={chains}
            >
                <ApolloProvider client={client}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ApolloProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    )
}
