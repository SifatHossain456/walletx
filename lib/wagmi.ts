import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { mainnet, base, arbitrum, polygon, optimism, bsc, avalanche } from 'wagmi/chains'

export const wagmiConfig = getDefaultConfig({
  appName: 'WalletX',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'walletx_demo',
  chains: [mainnet, base, arbitrum, polygon, optimism, bsc, avalanche],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [bsc.id]: http(),
    [avalanche.id]: http(),
  },
  ssr: true,
})
