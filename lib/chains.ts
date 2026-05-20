import { createPublicClient, http, formatEther, formatUnits } from 'viem'
import { mainnet, base, arbitrum, polygon, optimism, bsc, avalanche } from 'wagmi/chains'

export const CHAINS = [
  { chain: mainnet,   label: 'Ethereum',  symbol: 'ETH',  color: '#627eea', explorer: 'https://etherscan.io' },
  { chain: base,      label: 'Base',      symbol: 'ETH',  color: '#0052ff', explorer: 'https://basescan.org' },
  { chain: arbitrum,  label: 'Arbitrum',  symbol: 'ETH',  color: '#12aaff', explorer: 'https://arbiscan.io' },
  { chain: polygon,   label: 'Polygon',   symbol: 'MATIC', color: '#8247e5', explorer: 'https://polygonscan.com' },
  { chain: optimism,  label: 'Optimism',  symbol: 'ETH',  color: '#ff0420', explorer: 'https://optimistic.etherscan.io' },
  { chain: bsc,       label: 'BNB Chain', symbol: 'BNB',  color: '#f0b90b', explorer: 'https://bscscan.com' },
  { chain: avalanche, label: 'Avalanche', symbol: 'AVAX', color: '#e84142', explorer: 'https://snowtrace.io' },
]

export interface ChainBalance {
  label: string
  symbol: string
  color: string
  explorer: string
  balance: bigint
  balanceFormatted: string
  usdValue: number
  txCount: number
  chainId: number
}

const NATIVE_PRICES: Record<number, number> = {
  1: 0,       // ETH - fetched live
  8453: 0,    // Base - ETH
  42161: 0,   // Arbitrum - ETH
  137: 0,     // Polygon - MATIC
  10: 0,      // Optimism - ETH
  56: 0,      // BNB
  43114: 0,   // AVAX
}

async function getEthPrice(): Promise<number> {
  try {
    const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network,binancecoin,avalanche-2&vs_currencies=usd', { next: { revalidate: 60 } })
    const d = await r.json()
    return {
      eth: d['ethereum']?.usd ?? 3000,
      matic: d['matic-network']?.usd ?? 0.8,
      bnb: d['binancecoin']?.usd ?? 600,
      avax: d['avalanche-2']?.usd ?? 35,
    } as unknown as number
  } catch { return 3000 }
}

export async function getChainBalances(address: `0x${string}`): Promise<ChainBalance[]> {
  let prices: Record<string, number> = { eth: 3000, matic: 0.8, bnb: 600, avax: 35 }
  try {
    const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network,binancecoin,avalanche-2&vs_currencies=usd', { next: { revalidate: 60 } })
    const d = await r.json()
    prices = {
      eth: d['ethereum']?.usd ?? 3000,
      matic: d['matic-network']?.usd ?? 0.8,
      bnb: d['binancecoin']?.usd ?? 600,
      avax: d['avalanche-2']?.usd ?? 35,
    }
  } catch {}

  const priceMap: Record<number, number> = {
    1: prices.eth, 8453: prices.eth, 42161: prices.eth,
    137: prices.matic, 10: prices.eth, 56: prices.bnb, 43114: prices.avax,
  }

  const RPC_URLS: Record<number, string> = {
    1:     'https://cloudflare-eth.com',
    8453:  'https://mainnet.base.org',
    42161: 'https://arb1.arbitrum.io/rpc',
    137:   'https://polygon-rpc.com',
    10:    'https://mainnet.optimism.io',
    56:    'https://bsc-dataseed1.binance.org',
    43114: 'https://api.avax.network/ext/bc/C/rpc',
  }

  const results = await Promise.allSettled(
    CHAINS.map(async ({ chain, label, symbol, color, explorer }) => {
      const client = createPublicClient({
        chain,
        transport: http(RPC_URLS[chain.id], { timeout: 8_000, retryCount: 1 }),
      })
      const [balance, txCount] = await Promise.all([
        client.getBalance({ address }),
        client.getTransactionCount({ address }),
      ])
      const balanceFormatted = parseFloat(formatEther(balance)).toFixed(6)
      const usdValue = parseFloat(balanceFormatted) * (priceMap[chain.id] ?? 0)
      return { label, symbol, color, explorer, balance, balanceFormatted, usdValue, txCount, chainId: chain.id } as ChainBalance
    })
  )

  return results
    .filter((r): r is PromiseFulfilledResult<ChainBalance> => r.status === 'fulfilled')
    .map(r => r.value)
}

export async function getWalletNFTs(address: string): Promise<{ count: number; items: NFTItem[] }> {
  try {
    const res = await fetch(
      `https://eth-mainnet.g.alchemy.com/nft/v3/demo/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=12`,
      { cache: 'no-store' }
    )
    if (!res.ok) return { count: 0, items: [] }
    const data = await res.json()
    return {
      count: data.totalCount ?? 0,
      items: (data.ownedNfts ?? []).slice(0, 12).map((n: NFTRaw) => ({
        name: n.name ?? `#${n.tokenId}`,
        collection: n.collection?.name ?? n.contract?.name ?? 'Unknown',
        image: n.image?.cachedUrl ?? n.image?.thumbnailUrl ?? '',
        tokenId: n.tokenId,
        contract: n.contract?.address ?? '',
      }))
    }
  } catch {
    return { count: 0, items: [] }
  }
}

export interface NFTItem {
  name: string
  collection: string
  image: string
  tokenId: string
  contract: string
}

interface NFTRaw {
  name?: string
  tokenId: string
  contract?: { address?: string; name?: string }
  collection?: { name?: string }
  image?: { cachedUrl?: string; thumbnailUrl?: string }
}

export async function resolveENS(address: string): Promise<string | null> {
  try {
    const client = createPublicClient({ chain: mainnet, transport: http('https://cloudflare-eth.com', { timeout: 8_000 }) })
    const name = await client.getEnsName({ address: address as `0x${string}` })
    return name
  } catch { return null }
}

export async function resolveENSToAddress(name: string): Promise<`0x${string}` | null> {
  try {
    const client = createPublicClient({ chain: mainnet, transport: http('https://cloudflare-eth.com', { timeout: 8_000 }) })
    const addr = await client.getEnsAddress({ name })
    return addr
  } catch { return null }
}

export function scoreWallet(balances: ChainBalance[], nftCount: number, totalUsd: number): {
  score: number; grade: string; color: string; breakdown: { label: string; pts: number; max: number }[]
} {
  const totalTxns = balances.reduce((s, b) => s + b.txCount, 0)
  const activeChains = balances.filter(b => b.txCount > 0).length

  const txPts = Math.min(totalTxns / 10, 30)          // max 30
  const chainPts = Math.min(activeChains * 5, 25)      // max 25
  const balPts = Math.min(totalUsd / 100, 25)          // max 25
  const nftPts = Math.min(nftCount * 2, 20)            // max 20

  const score = Math.round(txPts + chainPts + balPts + nftPts)

  let grade = 'F'; let color = '#ef4444'
  if (score >= 80) { grade = 'S'; color = '#f97316' }
  else if (score >= 60) { grade = 'A'; color = '#22c55e' }
  else if (score >= 40) { grade = 'B'; color = '#3b82f6' }
  else if (score >= 20) { grade = 'C'; color = '#a855f7' }
  else if (score >= 5) { grade = 'D'; color = '#6b7280' }

  return {
    score,
    grade,
    color,
    breakdown: [
      { label: 'Transactions', pts: Math.round(txPts), max: 30 },
      { label: 'Active Chains', pts: Math.round(chainPts), max: 25 },
      { label: 'Portfolio Value', pts: Math.round(balPts), max: 25 },
      { label: 'NFT Holdings', pts: Math.round(nftPts), max: 20 },
    ]
  }
}

export function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function fmtUsd(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`
  return `$${n.toFixed(2)}`
}
