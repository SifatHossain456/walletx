import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="text-7xl font-black mb-4" style={{ color: 'var(--accent)' }}>404</div>
      <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>Page not found</h1>
      <p className="mb-8 max-w-sm text-sm" style={{ color: 'var(--muted)' }}>
        This page doesn&apos;t exist. Head back to your wallet overview.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80"
        style={{ background: 'var(--accent2)', color: '#fff' }}
      >
        Back to WalletX
      </Link>
    </div>
  )
}
