# KALSS-API 🚀

REST API publik dengan dokumentasi web built-in. Dibangun dengan **Next.js** dan di-deploy ke **Vercel**.

## Fitur

- 🤖 AI / Chatbot (via Groq / OpenAI)
- 📥 Downloader (TikTok, YouTube, Instagram)
- 🛠️ Maker / Tools (QR Code, Carbon, TTS)
- 🔍 Search (YouTube, Google)
- 🔑 Autentikasi via API key (`?apikey=`)
- 🌐 Halaman dokumentasi interaktif bawaan

## Struktur Project

```
kalss-api/
├── app/
│   ├── page.tsx              ← Halaman docs
│   ├── layout.tsx
│   ├── globals.css
│   └── api/
│       ├── status/route.ts   ← GET /api/status
│       ├── ai/chat/route.ts  ← GET /api/ai/chat
│       ├── dl/tiktok/route.ts
│       ├── dl/youtube/route.ts
│       ├── dl/instagram/route.ts
│       ├── maker/qrcode/route.ts
│       ├── maker/tts/route.ts
│       ├── search/youtube/route.ts
│       └── search/google/route.ts
├── lib/
│   ├── endpoints.ts          ← Daftar semua endpoint
│   └── apikey.ts             ← Helper validasi API key
└── .env.example              ← Template environment variables
```

## Setup Development

```bash
# 1. Clone / download project ini
# 2. Install dependencies
npm install

# 3. Copy env file
cp .env.example .env.local

# 4. Isi .env.local dengan API key yang valid
# (minimal: VALID_API_KEYS dan GROQ_API_KEY)

# 5. Jalankan dev server
npm run dev
# → http://localhost:3000
```

## Deploy ke Vercel

### Cara 1: Via GitHub (Direkomendasikan)
1. Push repo ini ke GitHub
2. Buka [vercel.com](https://vercel.com) → New Project
3. Import repo-nya
4. Tambahkan **Environment Variables** di Settings:
   - `VALID_API_KEYS`
   - `GROQ_API_KEY`
   - `YOUTUBE_API_KEY`
5. Deploy → otomatis!

### Cara 2: Via CLI
```bash
npm i -g vercel
vercel
# Ikuti instruksinya, isi env variables saat diminta
```

## Cara Pakai API

### 1. Dapatkan API Key
Hubungi admin atau generate sendiri, lalu tambahkan ke `VALID_API_KEYS` di env.

### 2. Tambahkan ke setiap request
```
GET https://kalss-api.vercel.app/api/ai/chat?q=Halo&apikey=YOUR_KEY
```

### Contoh Response
```json
{
  "status": 200,
  "result": {
    "query": "Halo",
    "reply": "Halo! Ada yang bisa saya bantu?"
  }
}
```

## Menambah Endpoint Baru

1. Buat file baru di `app/api/KATEGORI/NAMA/route.ts`
2. Daftarkan di `lib/endpoints.ts`

Contoh:
```ts
// app/api/tools/lorem/route.ts
import { NextRequest } from 'next/server'
import { validateKey, ok, err } from '@/lib/apikey'

export async function GET(req: NextRequest) {
  const authErr = validateKey(req)
  if (authErr) return authErr

  const count = parseInt(req.nextUrl.searchParams.get('count') || '5')
  // ... logic kamu

  return ok({ result: 'lorem ipsum...' })
}
```

## Environment Variables

| Variable | Keterangan | Wajib? |
|---|---|---|
| `VALID_API_KEYS` | API key yang valid, pisah koma | ✅ |
| `GROQ_API_KEY` | Key dari console.groq.com | Untuk /api/ai/* |
| `OPENAI_API_KEY` | Key dari platform.openai.com | Alternatif AI |
| `YOUTUBE_API_KEY` | Key dari Google Cloud Console | Untuk /api/search/youtube |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Deploy**: Vercel (free tier cukup)
- **Font**: JetBrains Mono + Sora

---

Made with ❤️ by KALSS
