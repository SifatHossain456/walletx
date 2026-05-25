import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: { default: 'WalletX — Multi-Chain Wallet Analyzer', template: '%s — WalletX' },
  description: 'Analyze any Ethereum wallet or ENS name across 7 chains. View balances, NFTs, activity score and on-chain history.',
  keywords: ['wallet analyzer', 'Ethereum', 'ENS', 'multi-chain', 'DeFi portfolio', 'on-chain analytics'],
  openGraph: {
    title: 'WalletX — Multi-Chain Wallet Analyzer',
    description: 'Analyze any wallet across 7 chains. See balances, NFTs, activity score and more.',
    type: 'website',
    siteName: 'WalletX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WalletX — Multi-Chain Wallet Analyzer',
    description: 'Analyze any Ethereum wallet or ENS name across 7 chains.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
