import { NextRequest } from 'next/server'
import { validateKey, ok, err } from '@/lib/apikey'

export async function GET(req: NextRequest) {
  const authErr = validateKey(req)
  if (authErr) return authErr

  const url = req.nextUrl.searchParams.get('url')
  if (!url) return err('Parameter ?url diperlukan', 400)
  if (!url.includes('youtube.com') && !url.includes('youtu.be'))
    return err('URL harus dari YouTube', 400)

  const quality = req.nextUrl.searchParams.get('quality') || '360p'

  try {
    /**
     * Gunakan yt-dlp wrapper API atau RapidAPI YouTube Downloader.
     * Contoh pakai y2mate API (cek TOS sebelum production):
     *
     * Alternatif: cobain cobalt.tools API → https://github.com/imputnet/cobalt
     */
    const res = await fetch(
      `https://api.cobalt.tools/api/json`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ url, vQuality: quality.replace('p', '') }),
      }
    )

    if (!res.ok) throw new Error('Downloader error')
    const data = await res.json()

    return ok({
      url,
      quality,
      download_url: data.url,
      filename: data.filename,
    })
  } catch (e) {
    return err('Gagal mendownload. Coba URL lain atau quality berbeda.', 500)
  }
}
