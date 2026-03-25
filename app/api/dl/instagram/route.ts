import { NextRequest } from 'next/server'
import { validateKey, ok, err } from '@/lib/apikey'

export async function GET(req: NextRequest) {
  const authErr = validateKey(req)
  if (authErr) return authErr

  const url = req.nextUrl.searchParams.get('url')
  if (!url) return err('Parameter ?url diperlukan', 400)
  if (!url.includes('instagram.com')) return err('URL harus dari Instagram', 400)

  try {
    /**
     * Pakai Instaloader API atau RapidAPI Instagram Downloader.
     * Contoh pakai savefrom-style endpoint (ganti sesuai provider kamu):
     */
    const res = await fetch(`https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com',
        url: url,
      },
    })

    if (!res.ok) throw new Error('Instagram downloader error')
    const data = await res.json()

    return ok({
      type: data.Type,
      thumbnail: data.thumbnail,
      download_url: data.media,
    })
  } catch (e) {
    return err('Gagal download Instagram. Pastikan post publik & URL valid.', 500)
  }
}
