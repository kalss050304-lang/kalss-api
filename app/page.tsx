'use client'

import { useEffect, useState, useMemo } from 'react'
import { ENDPOINTS, CATEGORIES } from '@/lib/endpoints'

// ─── Types ────────────────────────────────────────────
type StatusData = {
  server: string
  time_wib: string
  date: string
  visitors: number
  version: string
}

// ─── Component: Terminal Boot ──────────────────────────
const BOOT_LINES = [
  { type: 'cmd', text: 'npm run dev' },
  { type: 'dim', text: '> kalssapi@v1.0.0 dev' },
  { type: 'dim', text: '> node src/index.ts' },
  { type: 'info', text: `INFO Loading ${ENDPOINTS.length} routes...` },
  { type: 'ok', text: 'OK  Mapped {GET} /api/ai/chat' },
  { type: 'ok', text: 'OK  Mapped {GET} /api/dl/tiktok' },
  { type: 'ok', text: 'OK  Mapped {GET} /api/maker/qrcode' },
  { type: `info`, text: `INFO ... +${ENDPOINTS.length - 3} more endpoints` },
  { type: 'ok', text: 'OK  Server running at https://kalss-api.vercel.app' },
]

function Terminal() {
  const [lines, setLines] = useState<typeof BOOT_LINES>([])

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[i]])
        i++
      } else {
        clearInterval(interval)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [])

  const color = (type: string) => {
    if (type === 'ok') return '#22c55e'
    if (type === 'info') return '#4da6ff'
    if (type === 'dim') return '#3a5080'
    return '#c5d8ff'
  }

  return (
    <div style={{
      background: 'var(--bg3)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '14px 16px',
      fontFamily: 'var(--mono)',
      fontSize: 12,
      marginBottom: 14,
      lineHeight: 1.9,
    }}>
      {/* Traffic lights */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
        <span style={{ flex: 1, textAlign: 'center', color: 'var(--text4)', fontSize: 10 }}>
          kalssapi.js
        </span>
      </div>

      {/* Prompt */}
      <div>
        <span style={{ color: 'var(--text3)' }}>root@kalss~$ </span>
        <span style={{ color: '#c5d8ff' }}>npm run dev</span>
      </div>

      {/* Boot lines */}
      {lines.map((l, i) => (
        <div key={i} style={{ color: color(l.type) }}>{l.text}</div>
      ))}

      {/* Blinking cursor */}
      {lines.length === BOOT_LINES.length && (
        <div>
          <span style={{ color: 'var(--text3)' }}>root@kalss~$ </span>
          <span style={{
            display: 'inline-block',
            width: 8,
            height: 14,
            background: 'var(--accent)',
            verticalAlign: 'middle',
            animation: 'blink 1s step-end infinite',
          }} />
          <style>{`@keyframes blink { 50% { opacity: 0 } }`}</style>
        </div>
      )}
    </div>
  )
}

// ─── Component: Status Card ────────────────────────────
function StatusCard({ data }: { data: StatusData | null }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const rows = [
    { label: 'TIME (WIB)', value: time },
    { label: 'DATE', value: data?.date ?? '--' },
    { label: 'VISITORS', value: data?.visitors?.toLocaleString('id-ID') ?? '--' },
    { label: 'ENDPOINTS', value: String(ENDPOINTS.length) },
    { label: 'VERSION', value: data?.version ?? 'v1.0.0' },
  ]

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '14px 16px',
      marginBottom: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: 'var(--accent)' }}>
          SERVER STATUS
        </span>
        <div style={{
          width: 9, height: 9, borderRadius: '50%',
          background: data ? '#22c55e' : '#ef4444',
          boxShadow: data ? '0 0 6px #22c55e88' : 'none',
        }} />
      </div>
      {rows.map(({ label, value }) => (
        <div key={label} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '6px 0', borderBottom: '1px solid #111d38', fontSize: 12,
        }}>
          <span style={{ color: 'var(--text4)', letterSpacing: 1, fontSize: 11 }}>{label}</span>
          <span style={{ fontFamily: 'var(--mono)', color: 'var(--text2)', fontSize: 11.5 }}>{value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Component: Endpoint Card ──────────────────────────
function EndpointCard({ ep }: { ep: typeof ENDPOINTS[0] }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : 'https://kalss-api.vercel.app'

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border2)',
      borderRadius: 8, marginBottom: 5, overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '10px 14px', display: 'flex',
          alignItems: 'center', gap: 10, cursor: 'pointer',
          background: 'transparent', border: 'none', textAlign: 'left',
        }}
      >
        <span style={{
          fontSize: 9.5, fontWeight: 600, fontFamily: 'var(--mono)',
          padding: '2px 7px', borderRadius: 4,
          background: ep.method === 'GET' ? '#0e2a14' : '#1a1800',
          color: ep.method === 'GET' ? '#22c55e' : '#f59e0b',
          border: `1px solid ${ep.method === 'GET' ? '#1a4a24' : '#3a3000'}`,
        }}>
          {ep.method}
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#8ab4f8', flex: 1 }}>
          {ep.path}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text4)' }}>{ep.desc}</span>
        <span style={{ fontSize: 10, color: 'var(--text4)', marginLeft: 4 }}>
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div style={{ padding: '0 14px 12px', borderTop: '1px solid var(--border2)' }}>
          {/* Try URL */}
          <div style={{
            background: 'var(--bg3)', borderRadius: 6, padding: '8px 10px',
            fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)',
            marginTop: 10, display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', gap: 8, wordBreak: 'break-all',
          }}>
            <span>{baseUrl}{ep.path}?{ep.params?.map(p => `${p.name}=...`).join('&')}</span>
            <button
              onClick={() => copy(`${baseUrl}${ep.path}?${ep.params?.map(p => `${p.name}=...`).join('&')}`)}
              style={{
                flexShrink: 0, background: '#0e2050', border: '1px solid #1e4080',
                color: 'var(--accent)', fontSize: 10, padding: '3px 8px',
                borderRadius: 4, cursor: 'pointer',
              }}
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>

          {/* Params */}
          {ep.params && ep.params.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <p style={{ fontSize: 10, color: 'var(--text4)', letterSpacing: 1, marginBottom: 6 }}>PARAMETER</p>
              {ep.params.map((p) => (
                <div key={p.name} style={{
                  display: 'flex', gap: 10, alignItems: 'baseline',
                  fontSize: 11.5, marginBottom: 4,
                }}>
                  <span style={{ fontFamily: 'var(--mono)', color: p.required ? '#f59e0b' : 'var(--text2)', minWidth: 70 }}>
                    {p.name}
                  </span>
                  <span style={{ fontSize: 9, color: p.required ? '#f59e0b88' : 'var(--text4)' }}>
                    {p.required ? 'required' : 'optional'}
                  </span>
                  <span style={{ color: 'var(--text3)', fontSize: 11 }}>{p.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────
export default function Home() {
  const [status, setStatus] = useState<StatusData | null>(null)
  const [query, setQuery] = useState('')
  const [apikey, setApikey] = useState('kalss_••••••••••••••••')
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    fetch('/api/status').then((r) => r.json()).then(setStatus).catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return ENDPOINTS.filter(
      (ep) =>
        ep.path.toLowerCase().includes(q) ||
        ep.desc.toLowerCase().includes(q) ||
        ep.category.toLowerCase().includes(q)
    )
  }, [query])

  const byCategory = useMemo(() => {
    const map: Record<string, typeof ENDPOINTS> = {}
    for (const ep of filtered) {
      ;(map[ep.category] ??= []).push(ep)
    }
    return map
  }, [filtered])

  const demoKey = 'kalss_xK9mL2pQrT5vY8nA'
  const toggleKey = () => {
    setApikey(revealed ? 'kalss_••••••••••••••••' : demoKey)
    setRevealed(!revealed)
  }

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', padding: '0 0 40px' }}>
      {/* Top bar */}
      <div style={{
        background: '#0a1530', borderBottom: '1px solid var(--border)',
        padding: '12px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--accent)', letterSpacing: 2 }}>
          KALSS-API
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 10, background: '#0e2050', color: 'var(--accent)',
            border: '1px solid #1e4080', padding: '3px 8px', borderRadius: 20,
            fontFamily: 'var(--mono)',
          }}>v1.0.0</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--text3)', fontSize: 12, textDecoration: 'none' }}
          >
            GitHub ↗
          </a>
        </div>
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        <Terminal />
        <StatusCard data={status} />

        {/* Search */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '10px 14px', marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ color: 'var(--text4)', fontSize: 14 }}>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search endpoint..."
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text)', fontSize: 13, width: '100%',
              fontFamily: 'var(--sans)',
            }}
          />
        </div>

        {/* Endpoints */}
        {Object.entries(byCategory).map(([cat, eps]) => (
          <div key={cat} style={{ marginBottom: 14 }}>
            <p style={{
              fontSize: 10, fontWeight: 600, letterSpacing: 2,
              color: 'var(--text4)', marginBottom: 8, paddingLeft: 4,
            }}>{cat}</p>
            {eps.map((ep) => <EndpointCard key={ep.path} ep={ep} />)}
          </div>
        ))}

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text4)', fontSize: 13, padding: 24 }}>
            Endpoint tidak ditemukan.
          </p>
        )}

        {/* API Key */}
        <div style={{
          background: '#060f24', border: '1px solid var(--border)',
          borderRadius: 10, padding: '14px 16px', marginTop: 14,
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: 'var(--accent)', marginBottom: 10 }}>
            API KEY
          </p>
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 7, padding: '9px 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)' }}>
              {apikey}
            </span>
            <button
              onClick={toggleKey}
              style={{
                background: '#0e2050', border: '1px solid #1e4080',
                color: 'var(--accent)', fontSize: 10, padding: '4px 10px',
                borderRadius: 5, cursor: 'pointer', fontFamily: 'var(--sans)',
              }}
            >
              {revealed ? 'Hide' : 'Reveal'}
            </button>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text4)', marginTop: 8, lineHeight: 1.6 }}>
            Tambahkan ke setiap request:{' '}
            <code style={{ color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 10 }}>
              ?apikey=YOUR_KEY
            </code>
          </p>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center', fontSize: 11, color: 'var(--text4)',
          marginTop: 24, lineHeight: 1.6,
        }}>
          KALSS-API © {new Date().getFullYear()} — Built with Next.js & Vercel
        </p>
      </div>
    </main>
  )
}
