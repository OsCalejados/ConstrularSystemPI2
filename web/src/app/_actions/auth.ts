'use server'

import { cookies } from 'next/headers'
import { Session } from '@/types/session'

export async function saveSession(session: Session) {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30d
  cookies().set('user', JSON.stringify(session.user), {
    expires,
    secure: true,
    httpOnly: true,
  })
}

export async function clearUser() {
  cookies().set('user', '', { expires: new Date(0) })
}

export async function getSession(): Promise<Session | null> {
  const session = cookies().get('user')?.value

  if (!session) return null

  const user = JSON.parse(session)
  return { user, access_token: '' }
}
