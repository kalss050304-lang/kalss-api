import { NextRequest } from 'next/server'
import { validateKey, ok, err } from '@/lib/apikey'

export async function GET(req: NextRequest) {
  const authErr = validateKey(req)
  if (authErr) return authErr

  const code = req.nextUrl.searchParams.get('code')
  if (!code) return err('Parameter ?code diperlukan', 400)

  const lang = req.nextUrl.searchParams.get('lang') || 'auto'
  const theme = req.nextUrl.searchParams.get('theme') || 'one-dark'

  try {
    /**
     * Pakai Carbon API (unofficial) atau Ray.so API.
     * Contoh pakai ray.so embed URL (returns image link):
     */
    const params = new URLSearchParams({
      code: Buffer.from(code).toString('base64'),
      language: lang,
      theme: theme,
      background: 'true',
      darkMode: 'true',
      padding: '32',
    })

    // Return URL screenshot (bisa di-fetch ulang oleh client)
    const screenshotUrl = `https://ray.so/api/screenshot?${params}`

    return ok({
      code,
      lang,
      theme,
      image_url: screenshotUrl,
      note: 'Gunakan image_url untuk mendapatkan gambar PNG',
    })
  } catch (e) {
    return err('Gagal generate carbon image', 500)
  }
}
