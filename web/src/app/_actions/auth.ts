'use server'

import { cookies } from 'next/headers'
import { Session } from '@/types/session'

export async function saveSession(session: Session) {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30d
  cookies().set('session', JSON.stringify(session), {
    expires,
    httpOnly: true,
  })
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) })
}

export async function getSession(): Promise<Session | null> {
  const session = cookies().get('session')?.value

  if (!session) return null

  return JSON.parse(session)
}
