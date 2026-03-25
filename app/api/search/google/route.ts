import { NextRequest } from 'next/server'
import { validateKey, ok, err } from '@/lib/apikey'

export async function GET(req: NextRequest) {
  const authErr = validateKey(req)
  if (authErr) return authErr

  const q = req.nextUrl.searchParams.get('q')
  if (!q) return err('Parameter ?q diperlukan', 400)

  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '5'), 10)

  try {
    /**
     * Pakai Google Custom Search API (gratis 100 req/hari).
     * Setup:
     * 1. Buat Search Engine di: https://programmablesearchengine.google.com
     * 2. Aktifkan "Search the entire web"
     * 3. Dapatkan GOOGLE_CSE_ID dan GOOGLE_API_KEY
     */
    const url = new URL('https://www.googleapis.com/customsearch/v1')
    url.searchParams.set('q', q)
    url.searchParams.set('cx', process.env.GOOGLE_CSE_ID || '')
    url.searchParams.set('key', process.env.GOOGLE_API_KEY || '')
    url.searchParams.set('num', String(limit))

    const res = await fetch(url.toString())
    if (!res.ok) throw new Error('Google Search API error')

    const data = await res.json()

    const results = data.items?.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      source: item.displayLink,
    })) ?? []

    return ok({ query: q, count: results.length, results })
  } catch (e) {
    return err('Gagal search Google. Cek env GOOGLE_CSE_ID & GOOGLE_API_KEY.', 500)
  }
}

