import { NextRequest } from 'next/server'
import { validateKey, ok, err } from '@/lib/apikey'

export async function GET(req: NextRequest) {
  const authErr = validateKey(req)
  if (authErr) return authErr

  const url = req.nextUrl.searchParams.get('url')
  if (!url) return err('Parameter ?url diperlukan', 400)

  if (!url.includes('tiktok.com')) return err('URL harus dari TikTok', 400)

  try {
    /**
     * Gunakan salah satu scraper/API:
     * - RapidAPI TikTok Downloader
     * - tikwm.com API (gratis, cukup reliable)
     *
     * Contoh pakai tikwm.com:
     */
    const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`)
    const data = await response.json()

    if (data.code !== 0) throw new Error('Gagal mengambil video')

    return ok({
      title: data.data?.title,
      author: data.data?.author?.nickname,
      thumbnail: data.data?.cover,
      video_nowm: data.data?.play,   // tanpa watermark
      video_wm: data.data?.wmplay,   // dengan watermark
      music: data.data?.music,
      duration: data.data?.duration,
    })
  } catch (e) {
    return err('Gagal mendownload. Pastikan URL valid & publik.', 500)
  }
}
