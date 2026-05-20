'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Search, Wallet, BarChart2, Globe, Image, ArrowRight, Zap } from 'lucide-react'

const DEMO_WALLETS = [
  { label: 'Vitalik', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
  { label: 'Binance Hot', address: '0x28C6c06298d514Db089934071355E5743bf21d60' },
  { label: 'Uniswap Treasury', address: '0x1a9C8182C09F50C8318d769245beA52c32BE35BC' },
  { label: 'Jesse Pollak', address: '0x849151d7D0bF1F34b70d5caD5149D28CC2308bf1' },
]

export default function HomePage() {
  const [input, setInput] = useState('')
  const router = useRouter()
  const { address, isConnected } = useAccount()

  const go = (addr: string) => {
    if (addr.trim()) router.push(`/wallet/${addr.trim()}`)
  }

  const features = [
    { icon: Globe, title: '7 Chains', desc: 'ETH, Base, Arbitrum, Polygon, Optimism, BNB, Avalanche' },
    { icon: BarChart2, title: 'Activity Score', desc: 'Gamified wallet score based on txns, chains, balance & NFTs' },
    { icon: Image, title: 'NFT Gallery', desc: 'See all Ethereum NFTs owned by any wallet' },
    { icon: Zap, title: 'Instant', desc: 'Real-time data directly from chain RPCs — no API key needed' },
  ]

  return (
    <div className="space-y-16">
      {/* Hero */}
      <div className="text-center py-12 space-y-7">
        <div className="inline-flex items-center gap-2 bg-[#0a0e1a] border border-[#6366f1]/30 text-[#6366f1] text-xs font-semibold px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] live-dot" /> Multi-chain · Real-time
        </div>

        <h1 className="text-5xl font-black leading-tight">
          X-Ray Any<br />
          <span className="text-[#6366f1]">Wallet</span>
        </h1>
        <p className="text-[#6b7280] text-lg max-w-md mx-auto">
          Instantly see balances, NFTs, and activity score for any wallet across 7 chains.
        </p>

        <form onSubmit={e => { e.preventDefault(); go(input) }}
          className="flex gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#374151]" />
            <input value={input} onChange={e => setInput(e.target.value)}
              placeholder="0x… or vitalik.eth"
              className="w-full bg-[#0a0e1a] border border-[#0f1629] focus:border-[#6366f1] rounded-xl pl-12 pr-4 py-4 text-base transition-colors font-mono" />
          </div>
          <button type="submit"
            className="px-6 py-4 bg-[#6366f1] text-white font-bold rounded-xl hover:bg-[#4f46e5] transition-colors flex items-center gap-2">
            Analyze <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {isConnected && address && (
          <button onClick={() => go(address)}
            className="flex items-center gap-2 mx-auto text-sm text-[#6366f1] hover:underline">
            <Wallet className="w-4 h-4" /> Analyze my wallet
          </button>
        )}
        {!isConnected && (
          <div className="flex justify-center">
            <ConnectButton label="Connect to analyze your wallet" />
          </div>
        )}
      </div>

      {/* Demo wallets */}
      <div>
        <p className="text-center text-sm text-[#4b5563] mb-4">Try with famous wallets</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {DEMO_WALLETS.map(w => (
            <button key={w.address} onClick={() => go(w.address)}
              className="flex items-center gap-2 bg-[#0a0e1a] border border-[#0f1629] hover:border-[#6366f1] px-4 py-2.5 rounded-xl transition-all group">
              <div className="w-6 h-6 rounded-full bg-[#6366f1]/20 flex items-center justify-center">
                <Wallet className="w-3 h-3 text-[#6366f1]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold group-hover:text-[#6366f1] transition-colors">{w.label}</p>
                <p className="text-[10px] text-[#4b5563] font-mono">{w.address.slice(0, 10)}…</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#4b5563] group-hover:text-[#6366f1] transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-[#0a0e1a] border border-[#0f1629] rounded-xl p-4 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
              <Icon className="w-4.5 h-4.5 text-[#6366f1]" />
            </div>
            <h3 className="font-bold text-sm">{title}</h3>
            <p className="text-xs text-[#4b5563] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
