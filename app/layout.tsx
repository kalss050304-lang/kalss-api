import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KALSS API — REST API Documentation',
  description: 'Public REST API by KALSS. AI, Downloader, Maker, Search endpoints.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Sora:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
