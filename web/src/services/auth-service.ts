import { LoginFormData } from '@/types/validations'
import { Session } from '@/types/session'
import { api } from '@/lib/axios'

export async function login(data: LoginFormData): Promise<Session> {
  const response = await api.post('auth/login', data)

  return response.data
}
