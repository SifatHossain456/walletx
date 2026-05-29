# WalletX — Multi-Chain Wallet Analyzer

Paste any Ethereum address or ENS name to instantly see a complete multi-chain portfolio: balances across 7 EVM chains, NFT holdings, transaction history, and a weighted on-chain activity score.

## Features

- **Multi-chain balances** — ETH, Base, Arbitrum, Optimism, Polygon, BSC, Avalanche in one view
- **ENS resolution** — enter `vitalik.eth` and it resolves to the address automatically
- **Wallet score** — 0–100 activity score with grade (S/A/B/C) based on balance, TXs, active chains, NFTs
- **NFT holdings** — Ethereum NFTs fetched via Alchemy with collection names and images
- **Explorer links** — deep-link to Etherscan, Basescan, Arbiscan for every chain
- **Dynamic SEO** — `generateMetadata` per wallet address for shareable URLs

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Styling | Tailwind CSS v4 |
| Web3 | viem, Alchemy API |
| Fonts | Geist Sans + Geist Mono |

## Getting Started

```bash
git clone https://github.com/SifatHossain456/walletx.git
cd walletx
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

```env
ALCHEMY_API_KEY=your_alchemy_api_key
```

Get a free key at [alchemy.com](https://www.alchemy.com).

## Usage

Navigate to `/wallet/0x...` or `/wallet/name.eth` to analyze any wallet. The home page has a search box that routes to the correct URL.

## License

MIT
