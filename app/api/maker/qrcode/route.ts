import { NextRequest, NextResponse } from 'next/server'
import { validateKey, err } from '@/lib/apikey'

export async function GET(req: NextRequest) {
  const authErr = validateKey(req)
  if (authErr) return authErr

  const text = req.nextUrl.searchParams.get('text')
  if (!text) return err('Parameter ?text diperlukan', 400)

  try {
    /**
     * Pakai QR Server API (gratis, tanpa API key):
     * Mengembalikan gambar PNG langsung.
     */
    const size = req.nextUrl.searchParams.get('size') || '200'
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`

    const imgRes = await fetch(qrUrl)
    if (!imgRes.ok) throw new Error('QR generation failed')

    const imgBuffer = await imgRes.arrayBuffer()

    return new NextResponse(imgBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (e) {
    return err('Gagal generate QR code', 500)
  }
}

