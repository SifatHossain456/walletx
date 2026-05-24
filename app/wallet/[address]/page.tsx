export const dynamic = 'force-dynamic'

import { getChainBalances, getWalletNFTs, resolveENS, resolveENSToAddress, scoreWallet, shortAddr, fmtUsd, type ChainBalance, type NFTItem } from '@/lib/chains'
import { notFound } from 'next/navigation'
import { ExternalLink, Wallet, Image as ImageIcon, Activity, Trophy, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function ScoreRing({ score, grade, color }: { score: number; grade: string; color: string }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const filled = (score / 100) * circ
  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="144" height="144">
        <circle cx="72" cy="72" r={r} fill="none" stroke="#0f1629" strokeWidth="10" />
        <circle cx="72" cy="72" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={circ - filled}
          strokeLinecap="round" className="score-ring" />
      </svg>
      <div className="text-center z-10">
        <p className="text-4xl font-black" style={{ color }}>{grade}</p>
        <p className="text-sm text-[#4b5563] font-mono">{score}/100</p>
      </div>
    </div>
  )
}

function ChainCard({ b, address }: { b: ChainBalance; address: string }) {
  const hasBalance = b.balance > 0n
  return (
    <div className={`bg-[#0a0e1a] border rounded-xl p-4 transition-all ${hasBalance ? 'border-[#0f1629] hover:border-[#6366f1]/40' : 'border-[#0a0e1a] opacity-60'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: b.color }} />
          <span className="text-xs font-semibold">{b.label}</span>
        </div>
        <a href={`${b.explorer}/address/${address}`}
          target="_blank" rel="noopener noreferrer"
          aria-label={`View on ${b.label} explorer`}
          className="text-[#374151] hover:text-[#6366f1] transition-colors">
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <p className="text-lg font-bold font-mono">{parseFloat(b.balanceFormatted).toFixed(4)} {b.symbol}</p>
      <p className="text-xs text-[#4b5563] mt-0.5">{fmtUsd(b.usdValue)}</p>
      <div className="mt-2 pt-2 border-t border-[#0f1629] flex items-center justify-between">
        <span className="text-[10px] text-[#4b5563]">Transactions</span>
        <span className="text-[10px] font-mono font-semibold">{b.txCount.toLocaleString()}</span>
      </div>
    </div>
  )
}

function NFTGrid({ items, total }: { items: NFTItem[]; total: number }) {
  if (items.length === 0) return (
    <div className="bg-[#0a0e1a] border border-[#0f1629] rounded-xl p-10 text-center">
      <ImageIcon className="w-8 h-8 text-[#1e2d45] mx-auto mb-2" />
      <p className="text-sm text-[#4b5563]">No NFTs found on Ethereum</p>
    </div>
  )
  return (
    <div>
      <p className="text-xs text-[#4b5563] mb-3">{total.toLocaleString()} total NFTs · showing {items.length}</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {items.map((n, i) => (
          <a key={i} href={`https://opensea.io/assets/ethereum/${n.contract}/${n.tokenId}`}
            target="_blank" rel="noopener noreferrer"
            className="bg-[#0a0e1a] border border-[#0f1629] rounded-xl overflow-hidden hover:border-[#6366f1]/40 transition-all group">
            <div className="aspect-square bg-[#0f1629]">
              {n.image
                ? <img src={n.image} alt={n.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                : <div className="w-full h-full flex items-center justify-center text-[#1e2d45]"><ImageIcon className="w-5 h-5" /></div>
              }
            </div>
            <div className="p-1.5">
              <p className="text-[9px] font-medium truncate">{n.name}</p>
              <p className="text-[8px] text-[#4b5563] truncate">{n.collection}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default async function WalletPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = await params
  const isValidAddr = /^0x[0-9a-fA-F]{40}$/.test(address)
  const isENS = address.endsWith('.eth')

  if (!isValidAddr && !isENS) notFound()

  let resolvedAddress: `0x${string}`
  let ensLabel: string | null = null

  if (isENS) {
    const addr = await resolveENSToAddress(address)
    if (!addr) notFound()
    resolvedAddress = addr
    ensLabel = address
  } else {
    resolvedAddress = address as `0x${string}`
  }

  const [balances, nftData, reverseName] = await Promise.all([
    getChainBalances(resolvedAddress),
    getWalletNFTs(resolvedAddress),
    isValidAddr ? resolveENS(resolvedAddress) : Promise.resolve(null),
  ])

  const ensName = ensLabel ?? reverseName

  const totalUsd = balances.reduce((s, b) => s + b.usdValue, 0)
  const totalTxns = balances.reduce((s, b) => s + b.txCount, 0)
  const activeChains = balances.filter(b => b.txCount > 0).length
  const { score, grade, color, breakdown } = scoreWallet(balances, nftData.count, totalUsd)

  const displayName = ensName ?? shortAddr(resolvedAddress)

  return (
    <div className="space-y-6">
      <Link href="/" className="flex items-center gap-2 text-[#4b5563] hover:text-white text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {/* Identity Card */}
      <header className="bg-[#0a0e1a] border border-[#0f1629] rounded-2xl overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-[#6366f1]/20 via-[#8b5cf6]/10 to-transparent" />
        <div className="px-6 pb-6 -mt-8">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex items-end gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center border-4 border-[#0a0e1a]">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-black">{displayName}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-[#4b5563] font-mono">{shortAddr(resolvedAddress)}</p>
                  <a href={`https://etherscan.io/address/${resolvedAddress}`} target="_blank" rel="noopener noreferrer"
                    aria-label="View on Etherscan"
                    className="text-[#4b5563] hover:text-[#6366f1] transition-colors">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 pb-1">
              <div className="text-center">
                <p className="text-xs text-[#4b5563]">Portfolio</p>
                <p className="text-xl font-bold font-mono text-[#6366f1]">{fmtUsd(totalUsd)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#4b5563]">Transactions</p>
                <p className="text-xl font-bold font-mono">{totalTxns.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#4b5563]">Active Chains</p>
                <p className="text-xl font-bold">{activeChains}/7</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score */}
        <div className="bg-[#0a0e1a] border border-[#0f1629] rounded-2xl p-6 flex flex-col items-center gap-5">
          <div className="flex items-center gap-2 self-start">
            <Trophy className="w-4 h-4 text-[#6366f1]" />
            <h2 className="font-bold text-sm">Wallet Score</h2>
          </div>
          <ScoreRing score={score} grade={grade} color={color} />
          <div className="w-full space-y-2.5">
            {breakdown.map(b => (
              <div key={b.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#4b5563]">{b.label}</span>
                  <span className="font-mono">{b.pts}/{b.max}</span>
                </div>
                <div className="h-1.5 bg-[#0f1629] rounded-full overflow-hidden">
                  <div className="h-full bg-[#6366f1] rounded-full transition-all"
                    style={{ width: `${(b.pts / b.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chain breakdown */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#6366f1]" />
            <h2 className="font-bold text-sm">Chain Balances</h2>
            <span className="text-xs text-[#4b5563] ml-auto">{fmtUsd(totalUsd)} total</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {balances.map(b => <ChainCard key={b.chainId} b={b} address={resolvedAddress} />)}
          </div>
        </div>
      </div>

      {/* NFTs */}
      <div className="bg-[#0a0e1a] border border-[#0f1629] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="w-4 h-4 text-[#6366f1]" />
          <h2 className="font-bold text-sm">NFT Holdings</h2>
          {nftData.count > 0 && (
            <span className="ml-auto text-xs bg-[#6366f1]/10 text-[#6366f1] px-2 py-0.5 rounded-full font-semibold">
              {nftData.count.toLocaleString()} NFTs
            </span>
          )}
        </div>
        <NFTGrid items={nftData.items} total={nftData.count} />
      </div>
    </div>
  )
}
