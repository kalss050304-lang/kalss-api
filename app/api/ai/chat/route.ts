import { NextRequest } from 'next/server'
import { validateKey, ok, err } from '@/lib/apikey'

export async function GET(req: NextRequest) {
  const authErr = validateKey(req)
  if (authErr) return authErr

  const q = req.nextUrl.searchParams.get('q')
  if (!q) return err('Parameter ?q diperlukan', 400)

  try {
    /**
     * Ganti dengan AI provider pilihanmu:
     * - OpenAI: https://api.openai.com/v1/chat/completions
     * - Groq: https://api.groq.com/openai/v1/chat/completions
     * - Gemini, dll.
     *
     * Set API key provider di Vercel Environment Variables.
     */
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: q }],
        max_tokens: 1024,
      }),
    })

    if (!response.ok) throw new Error('AI provider error')

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content ?? 'Tidak ada respons'

    return ok({ query: q, reply })
  } catch (e) {
    return err('Gagal menghubungi AI provider. Cek env GROQ_API_KEY.', 500)
  }
}

