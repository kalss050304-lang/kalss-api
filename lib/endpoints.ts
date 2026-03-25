export type Endpoint = {
  method: 'GET' | 'POST'
  path: string
  desc: string
  category: string
  params?: { name: string; required: boolean; desc: string }[]
}

export const ENDPOINTS: Endpoint[] = [
  // ─── AI ──────────────────────────────────────────────
  {
    category: 'AI / CHATBOT',
    method: 'GET',
    path: '/api/ai/chat',
    desc: 'Chat dengan AI',
    params: [
      { name: 'q', required: true, desc: 'Pertanyaan kamu' },
      { name: 'apikey', required: true, desc: 'API key kamu' },
    ],
  },
  {
    category: 'AI / CHATBOT',
    method: 'GET',
    path: '/api/ai/imagine',
    desc: 'Generate gambar dari teks',
    params: [
      { name: 'prompt', required: true, desc: 'Deskripsi gambar' },
      { name: 'apikey', required: true, desc: 'API key kamu' },
    ],
  },

  // ─── DOWNLOADER ──────────────────────────────────────
  {
    category: 'DOWNLOADER',
    method: 'GET',
    path: '/api/dl/tiktok',
    desc: 'Download video TikTok tanpa watermark',
    params: [
      { name: 'url', required: true, desc: 'URL TikTok' },
      { name: 'apikey', required: true, desc: 'API key kamu' },
    ],
  },
  {
    category: 'DOWNLOADER',
    method: 'GET',
    path: '/api/dl/youtube',
    desc: 'Download video YouTube',
    params: [
      { name: 'url', required: true, desc: 'URL YouTube' },
      { name: 'quality', required: false, desc: '360p / 720p / 1080p' },
      { name: 'apikey', required: true, desc: 'API key kamu' },
    ],
  },
  {
    category: 'DOWNLOADER',
    method: 'GET',
    path: '/api/dl/instagram',
    desc: 'Download foto/video Instagram',
    params: [
      { name: 'url', required: true, desc: 'URL post Instagram' },
      { name: 'apikey', required: true, desc: 'API key kamu' },
    ],
  },

  // ─── MAKER ───────────────────────────────────────────
  {
    category: 'MAKER / TOOLS',
    method: 'GET',
    path: '/api/maker/qrcode',
    desc: 'Generate QR Code',
    params: [
      { name: 'text', required: true, desc: 'Teks / URL yang diconvert' },
      { name: 'apikey', required: true, desc: 'API key kamu' },
    ],
  },
  {
    category: 'MAKER / TOOLS',
    method: 'GET',
    path: '/api/maker/carbon',
    desc: 'Generate screenshot code (carbon-style)',
    params: [
      { name: 'code', required: true, desc: 'Code yang di-render' },
      { name: 'lang', required: false, desc: 'Bahasa pemrograman' },
      { name: 'apikey', required: true, desc: 'API key kamu' },
    ],
  },
  {
    category: 'MAKER / TOOLS',
    method: 'GET',
    path: '/api/maker/tts',
    desc: 'Text to speech (audio)',
    params: [
      { name: 'text', required: true, desc: 'Teks yang dibacakan' },
      { name: 'lang', required: false, desc: 'id / en / dll' },
      { name: 'apikey', required: true, desc: 'API key kamu' },
    ],
  },

  // ─── SEARCH ──────────────────────────────────────────
  {
    category: 'SEARCH',
    method: 'GET',
    path: '/api/search/youtube',
    desc: 'Cari video di YouTube',
    params: [
      { name: 'q', required: true, desc: 'Kata kunci pencarian' },
      { name: 'limit', required: false, desc: 'Jumlah hasil (default 5)' },
      { name: 'apikey', required: true, desc: 'API key kamu' },
    ],
  },
  {
    category: 'SEARCH',
    method: 'GET',
    path: '/api/search/google',
    desc: 'Cari di Google',
    params: [
      { name: 'q', required: true, desc: 'Kata kunci pencarian' },
      { name: 'limit', required: false, desc: 'Jumlah hasil (default 5)' },
      { name: 'apikey', required: true, desc: 'API key kamu' },
    ],
  },
]

export const CATEGORIES = [...new Set(ENDPOINTS.map((e) => e.category))]

