/**
 * Validasi API key dari query string.
 * API key yang valid disimpan di environment variable VALID_API_KEYS
 * (dipisah koma, contoh: "kalss_abc123,kalss_xyz789")
 *
 * Cara pakai di endpoint:
 *   const err = validateKey(request)
 *   if (err) return err
 */

import { NextRequest, NextResponse } from 'next/server'

export function validateKey(req: NextRequest): NextResponse | null {
  const apikey = req.nextUrl.searchParams.get('apikey')

  if (!apikey) {
    return NextResponse.json(
      { status: 401, message: 'API key diperlukan. Tambahkan ?apikey=YOUR_KEY' },
      { status: 401 }
    )
  }

  const validKeys = (process.env.VALID_API_KEYS || '').split(',').map((k) => k.trim())

  if (!validKeys.includes(apikey)) {
    return NextResponse.json(
      { status: 403, message: 'API key tidak valid atau sudah expired.' },
      { status: 403 }
    )
  }

  return null // key valid, lanjut
}

/** Helper: bungkus response sukses dengan format standar */
export function ok(data: unknown) {
  return NextResponse.json({ status: 200, result: data })
}

/** Helper: bungkus response error */
export function err(message: string, code = 500) {
  return NextResponse.json({ status: code, message }, { status: code })
}

