'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Search, Wallet } from 'lucide-react'
import { useAccount } from 'wagmi'

export default function Navbar() {
  const [q, setQ] = useState('')
  const router = useRouter()
  const { address } = useAccount()

  const go = (e: React.FormEvent) => {
    e.preventDefault()
    const val = q.trim()
    if (val) { router.push(`/wallet/${val}`); setQ('') }
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#060810]/95 backdrop-blur border-b border-[#0f1629]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[#6366f1] flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-base hidden sm:block tracking-tight">WalletX</span>
        </Link>

        <form onSubmit={go} className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#374151]" />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Enter wallet address or ENS…"
            className="w-full bg-[#0a0e1a] border border-[#0f1629] rounded-xl pl-9 pr-3 py-2 text-sm focus:border-[#6366f1] transition-colors" />
        </form>

        <div className="ml-auto flex items-center gap-3">
          {address && (
            <button onClick={() => router.push(`/wallet/${address}`)}
              className="text-xs text-[#6366f1] hover:underline hidden sm:block">
              My Wallet
            </button>
          )}
          <ConnectButton showBalance={false} chainStatus="none"
            accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }} />
        </div>
      </div>
    </nav>
  )
}
