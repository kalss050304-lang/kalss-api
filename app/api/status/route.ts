import { NextResponse } from 'next/server'

// Visitor count sederhana (in-memory, reset tiap cold start)
// Untuk production: pakai Vercel KV / Upstash Redis
let visitors = 0

export async function GET() {
  visitors++

  const now = new Date()

  return NextResponse.json({
    status: 200,
    server: 'online',
    time_wib: now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }),
    date: now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    }),
    visitors,
    endpoints: 10, // update sesuai jumlah endpoint
    version: '1.0.0',
  })
}

