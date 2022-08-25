import Layout from "../components/Layout"
import "../styles/globals.css"
import "@rainbow-me/rainbowkit/styles.css"
import {
    getDefaultWallets,
    RainbowKitProvider,
    lightTheme,
    darkTheme,
    cssStringFromTheme,
} from "@rainbow-me/rainbowkit"
import { chain, configureChains, createClient, WagmiConfig } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { ApolloProvider } from "@apollo/client"
import client from "../apollo-client"
import { ThemeProvider } from "next-themes"

// RAINBOW_KIT: Configure the chains and generate the required connectors
const { chains, provider } = configureChains(
    [chain.polygonMumbai, chain.rinkeby],
    [
        alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_POLYGON_MUMBAI_ALCHEMY_ID }),
        alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_RINKEBY_ALCHEMY_ID }),
        publicProvider(),
    ]
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
        <ThemeProvider attribute="class">
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider theme={null} chains={chains}>
                    <style
                        dangerouslySetInnerHTML={{
                            __html: `
                            :root {
                            ${cssStringFromTheme(
                                lightTheme({
                                    accentColor: "#9ca3af",
                                    borderRadius: "medium",
                                    fontStack: "system",
                                    overlayBlur: "small",
                                })
                            )}
                            }

                            html[class="dark"] {
                            ${cssStringFromTheme(
                                darkTheme({
                                    accentColor: "#1f2937",
                                    borderRadius: "medium",
                                    fontStack: "system",
                                    overlayBlur: "small",
                                })
                            )}
                            }
                        `,
                        }}
                    />
                    <ApolloProvider client={client}>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </ApolloProvider>
                </RainbowKitProvider>
            </WagmiConfig>
        </ThemeProvider>
    )
}
