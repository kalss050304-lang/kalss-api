import { NextRequest, NextResponse } from 'next/server'
import { validateKey, err } from '@/lib/apikey'

export async function GET(req: NextRequest) {
  const authErr = validateKey(req)
  if (authErr) return authErr

  const text = req.nextUrl.searchParams.get('text')
  if (!text) return err('Parameter ?text diperlukan', 400)

  const lang = req.nextUrl.searchParams.get('lang') || 'id'

  try {
    /**
     * Pakai Google Translate TTS (informal, bukan official API):
     * Cocok untuk demo. Untuk production, pakai:
     * - Google Cloud Text-to-Speech API
     * - ElevenLabs
     * - OpenAI TTS
     */
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`

    const res = await fetch(ttsUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })

    if (!res.ok) throw new Error('TTS error')

    const audio = await res.arrayBuffer()

    return new NextResponse(audio, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `inline; filename="tts.mp3"`,
      },
    })
  } catch (e) {
    return err('Gagal generate TTS. Coba teks yang lebih pendek.', 500)
  }
}

