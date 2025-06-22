import { LoginFormData } from '@/types/validations'
import { Session } from '@/types/session'
import api from '@/lib/axios'

export async function login(data: LoginFormData): Promise<Session> {
  console.log('login')
  const response = await api.post('auth/login', data)

  console.log(response.data)
  return response.data
}

export async function logout(): Promise<void> {
  await api.post('auth/logout')
}
