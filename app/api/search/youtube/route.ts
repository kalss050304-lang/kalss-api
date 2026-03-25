import { NextRequest } from 'next/server'
import { validateKey, ok, err } from '@/lib/apikey'

export async function GET(req: NextRequest) {
  const authErr = validateKey(req)
  if (authErr) return authErr

  const q = req.nextUrl.searchParams.get('q')
  if (!q) return err('Parameter ?q diperlukan', 400)

  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '5'), 20)

  try {
    /**
     * Pakai YouTube Data API v3.
     * Set YOUTUBE_API_KEY di Vercel Environment Variables.
     * Dapatkan key gratis di: console.cloud.google.com
     */
    const url = new URL('https://www.googleapis.com/youtube/v3/search')
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('q', q)
    url.searchParams.set('maxResults', String(limit))
    url.searchParams.set('type', 'video')
    url.searchParams.set('key', process.env.YOUTUBE_API_KEY || '')

    const res = await fetch(url.toString())
    if (!res.ok) throw new Error('YouTube API error')

    const data = await res.json()

    const results = data.items?.map((item: any) => ({
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
      video_id: item.id.videoId,
      url: `https://youtube.com/watch?v=${item.id.videoId}`,
      published: item.snippet.publishedAt,
    }))

    return ok({ query: q, count: results.length, results })
  } catch (e) {
    return err('Gagal search YouTube. Cek env YOUTUBE_API_KEY.', 500)
  }
}

